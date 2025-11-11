# Audio Storage Migration Guide

## Overview
This guide provides a step-by-step approach to create a separate audio storage table that can be shared between reading and listening content, eliminating redundant audio URL storage.

## Current State Analysis

### Existing Tables with Audio URLs
1. **reading_content** table
   - Stores: `audio_url` (text NOT NULL)
   - Used for reading passages with audio narration

2. **listening_content** table
   - Stores: `audio_url` (text NOT NULL)
   - Used for listening exercises

### Current Issues
- Duplicate audio URL storage in both tables
- No centralized audio metadata (duration, file size, format)
- Difficult to manage audio assets across features
- No audio versioning or optimization tracking

## Proposed Solution

### New Audio Assets Table
Create a centralized `audio_assets` table to store all audio files used across the application.

---

## Implementation Steps

### Step 1: Create Audio Assets Table

Create a new SQL file: `src/scripts/create_audio_assets_table.sql`

```sql
-- Create audio_assets table for centralized audio storage
CREATE TABLE IF NOT EXISTS public.audio_assets (
  id uuid NOT NULL DEFAULT uuid_generate_v4(),
  
  -- Audio file information
  storage_url text NOT NULL UNIQUE,
  original_filename text,
  file_size_bytes integer,
  duration_seconds integer,
  
  -- Audio metadata
  format text CHECK (format = ANY (ARRAY['mp3'::text, 'wav'::text, 'ogg'::text, 'm4a'::text])),
  bitrate integer,
  sample_rate integer,
  
  -- Content classification
  content_type text CHECK (content_type = ANY (ARRAY['reading'::text, 'listening'::text, 'pronunciation'::text, 'general'::text])),
  language text DEFAULT 'en',
  
  -- Storage provider info (S3, Cloudflare R2, etc.)
  storage_provider text DEFAULT 'cloudflare_r2',
  storage_bucket text,
  storage_path text,
  
  -- CDN/Optimization
  cdn_url text,
  is_optimized boolean DEFAULT false,
  
  -- Management
  is_active boolean DEFAULT true,
  created_at timestamp with time zone DEFAULT now(),
  updated_at timestamp with time zone DEFAULT now(),
  
  CONSTRAINT audio_assets_pkey PRIMARY KEY (id)
);

-- Create indexes for better query performance
CREATE INDEX IF NOT EXISTS idx_audio_assets_content_type 
  ON public.audio_assets(content_type);

CREATE INDEX IF NOT EXISTS idx_audio_assets_active 
  ON public.audio_assets(is_active);

CREATE INDEX IF NOT EXISTS idx_audio_assets_provider 
  ON public.audio_assets(storage_provider);

-- Add trigger for updated_at timestamp
CREATE OR REPLACE FUNCTION update_audio_assets_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trigger_audio_assets_updated_at
  BEFORE UPDATE ON public.audio_assets
  FOR EACH ROW
  EXECUTE FUNCTION update_audio_assets_updated_at();

-- Enable RLS (Row Level Security)
ALTER TABLE public.audio_assets ENABLE ROW LEVEL SECURITY;

-- Create policy for public read access
CREATE POLICY "Audio assets are viewable by everyone"
  ON public.audio_assets FOR SELECT
  USING (is_active = true);

-- Create policy for admin management
CREATE POLICY "Audio assets are manageable by admins"
  ON public.audio_assets FOR ALL
  USING (
    EXISTS (
      SELECT 1 FROM public.profiles
      WHERE id = auth.uid()
      AND is_admin = true
    )
  );
```

### Step 2: Add Foreign Keys to Existing Tables

Create a new SQL file: `src/scripts/migrate_audio_references.sql`

```sql
-- Step 2.1: Add audio_asset_id column to reading_content
ALTER TABLE public.reading_content 
  ADD COLUMN IF NOT EXISTS audio_asset_id uuid;

-- Add foreign key constraint
ALTER TABLE public.reading_content
  ADD CONSTRAINT reading_content_audio_asset_id_fkey 
  FOREIGN KEY (audio_asset_id) 
  REFERENCES public.audio_assets(id)
  ON DELETE SET NULL;

-- Create index for the foreign key
CREATE INDEX IF NOT EXISTS idx_reading_content_audio_asset
  ON public.reading_content(audio_asset_id);

-- Step 2.2: Add audio_asset_id column to listening_content
ALTER TABLE public.listening_content 
  ADD COLUMN IF NOT EXISTS audio_asset_id uuid;

-- Add foreign key constraint
ALTER TABLE public.listening_content
  ADD CONSTRAINT listening_content_audio_asset_id_fkey 
  FOREIGN KEY (audio_asset_id) 
  REFERENCES public.audio_assets(id)
  ON DELETE SET NULL;

-- Create index for the foreign key
CREATE INDEX IF NOT EXISTS idx_listening_content_audio_asset
  ON public.listening_content(audio_asset_id);
```

### Step 3: Data Migration Script

Create a new SQL file: `src/scripts/migrate_existing_audio_data.sql`

```sql
-- Migrate existing reading_content audio URLs to audio_assets
WITH reading_audio_insert AS (
  INSERT INTO public.audio_assets (
    storage_url,
    content_type,
    is_active,
    created_at
  )
  SELECT DISTINCT
    audio_url,
    'reading'::text,
    true,
    now()
  FROM public.reading_content
  WHERE audio_url IS NOT NULL
    AND audio_url != ''
  ON CONFLICT (storage_url) DO NOTHING
  RETURNING id, storage_url
)
UPDATE public.reading_content rc
SET audio_asset_id = rai.id
FROM reading_audio_insert rai
WHERE rc.audio_url = rai.storage_url;

-- Migrate existing listening_content audio URLs to audio_assets
WITH listening_audio_insert AS (
  INSERT INTO public.audio_assets (
    storage_url,
    content_type,
    is_active,
    created_at
  )
  SELECT DISTINCT
    audio_url,
    'listening'::text,
    true,
    now()
  FROM public.listening_content
  WHERE audio_url IS NOT NULL
    AND audio_url != ''
  ON CONFLICT (storage_url) DO NOTHING
  RETURNING id, storage_url
)
UPDATE public.listening_content lc
SET audio_asset_id = lai.id
FROM listening_audio_insert lai
WHERE lc.audio_url = lai.storage_url;

-- Verify migration
SELECT 
  'Reading Content' as table_name,
  COUNT(*) as total_records,
  COUNT(audio_asset_id) as migrated_records,
  COUNT(*) - COUNT(audio_asset_id) as pending_records
FROM public.reading_content
UNION ALL
SELECT 
  'Listening Content' as table_name,
  COUNT(*) as total_records,
  COUNT(audio_asset_id) as migrated_records,
  COUNT(*) - COUNT(audio_asset_id) as pending_records
FROM public.listening_content;
```

### Step 4: Update Application Types

Update TypeScript types to include the new audio asset structure.

Create/Update: `src/shared/types/audio.types.ts`

```typescript
export interface AudioAsset {
  id: string;
  storage_url: string;
  original_filename?: string;
  file_size_bytes?: number;
  duration_seconds?: number;
  format?: 'mp3' | 'wav' | 'ogg' | 'm4a';
  bitrate?: number;
  sample_rate?: number;
  content_type?: 'reading' | 'listening' | 'pronunciation' | 'general';
  language?: string;
  storage_provider?: string;
  storage_bucket?: string;
  storage_path?: string;
  cdn_url?: string;
  is_optimized?: boolean;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

export interface ReadingContentWithAudio {
  id: string;
  title: string;
  level: string;
  content: string;
  audio_url: string; // Deprecated - keep for backward compatibility
  audio_asset_id?: string;
  audio_asset?: AudioAsset;
  is_premium: boolean;
  order_index?: number;
  created_at: string;
  updated_at: string;
  content_id?: string;
}

export interface ListeningContentWithAudio {
  id: string;
  title: string;
  level: string;
  description?: string;
  audio_url: string; // Deprecated - keep for backward compatibility
  audio_asset_id?: string;
  audio_asset?: AudioAsset;
  duration_seconds?: number;
  transcript?: string;
  is_premium: boolean;
  order_index?: number;
  created_at: string;
  updated_at: string;
  content_id?: string;
}
```

### Step 5: Update API Endpoints

Update your API to fetch audio asset data along with content.

Example: `src/app/api/reading/route.ts`

```typescript
// Before:
const { data: readingContent } = await supabase
  .from('reading_content')
  .select('*')
  .eq('level', level);

// After:
const { data: readingContent } = await supabase
  .from('reading_content')
  .select(`
    *,
    audio_asset:audio_assets(*)
  `)
  .eq('level', level);
```

Example: `src/app/api/listening/route.ts`

```typescript
// Before:
const { data: listeningContent } = await supabase
  .from('listening_content')
  .select('*')
  .eq('level', level);

// After:
const { data: listeningContent } = await supabase
  .from('listening_content')
  .select(`
    *,
    audio_asset:audio_assets(*)
  `)
  .eq('level', level);
```

### Step 6: Update Components to Use New Audio Structure

Update `AudioPlayer.tsx` to support the new structure:

```typescript
interface AudioPlayerProps {
  audioUrl?: string; // Legacy support
  audioAsset?: AudioAsset; // New preferred method
  title?: string;
  thumbnail?: string;
}

export function AudioPlayer({ audioUrl, audioAsset, title, thumbnail }: AudioPlayerProps) {
  // Prefer audio asset, fallback to direct URL
  const audioSource = audioAsset?.cdn_url || audioAsset?.storage_url || audioUrl;
  const audioDuration = audioAsset?.duration_seconds;
  
  // ... rest of component logic
}
```

### Step 7: Create Audio Upload Service

Create: `src/shared/services/audioUploadService.ts`

```typescript
import { supabase } from '@/shared/lib/supabase';

export interface AudioUploadOptions {
  file: File;
  contentType: 'reading' | 'listening' | 'pronunciation' | 'general';
  bucket?: string;
  path?: string;
}

export interface AudioUploadResult {
  success: boolean;
  audioAsset?: any;
  error?: string;
}

export async function uploadAudioAsset(
  options: AudioUploadOptions
): Promise<AudioUploadResult> {
  try {
    const { file, contentType, bucket = 'audio-assets', path = '' } = options;
    
    // Generate unique filename
    const timestamp = Date.now();
    const filename = `${path}${timestamp}-${file.name}`;
    
    // Upload to storage
    const { data: uploadData, error: uploadError } = await supabase.storage
      .from(bucket)
      .upload(filename, file);
    
    if (uploadError) {
      return { success: false, error: uploadError.message };
    }
    
    // Get public URL
    const { data: urlData } = supabase.storage
      .from(bucket)
      .getPublicUrl(filename);
    
    // Create audio asset record
    const { data: audioAsset, error: insertError } = await supabase
      .from('audio_assets')
      .insert({
        storage_url: urlData.publicUrl,
        original_filename: file.name,
        file_size_bytes: file.size,
        content_type: contentType,
        storage_provider: 'supabase',
        storage_bucket: bucket,
        storage_path: filename,
        format: file.name.split('.').pop() as any,
        is_active: true,
      })
      .select()
      .single();
    
    if (insertError) {
      return { success: false, error: insertError.message };
    }
    
    return { success: true, audioAsset };
  } catch (error) {
    return { 
      success: false, 
      error: error instanceof Error ? error.message : 'Unknown error' 
    };
  }
}

export async function deleteAudioAsset(assetId: string): Promise<boolean> {
  try {
    // Get asset details
    const { data: asset } = await supabase
      .from('audio_assets')
      .select('*')
      .eq('id', assetId)
      .single();
    
    if (!asset) return false;
    
    // Delete from storage
    if (asset.storage_bucket && asset.storage_path) {
      await supabase.storage
        .from(asset.storage_bucket)
        .remove([asset.storage_path]);
    }
    
    // Soft delete from database
    await supabase
      .from('audio_assets')
      .update({ is_active: false })
      .eq('id', assetId);
    
    return true;
  } catch (error) {
    console.error('Error deleting audio asset:', error);
    return false;
  }
}
```

### Step 8: (Optional) Deprecate Old audio_url Columns

After successful migration and testing, you can optionally remove the old columns:

```sql
-- Create backup views first (recommended)
CREATE VIEW reading_content_backup AS 
SELECT * FROM public.reading_content;

CREATE VIEW listening_content_backup AS 
SELECT * FROM public.listening_content;

-- Remove old columns (do this only after thorough testing)
-- ALTER TABLE public.reading_content DROP COLUMN audio_url;
-- ALTER TABLE public.listening_content DROP COLUMN audio_url;
```

---

## Testing Checklist

- [ ] Run `create_audio_assets_table.sql` in your Supabase database
- [ ] Run `migrate_audio_references.sql` to add foreign keys
- [ ] Run `migrate_existing_audio_data.sql` to migrate existing data
- [ ] Verify data migration with the SELECT queries
- [ ] Update TypeScript types in your codebase
- [ ] Update API endpoints to include audio_asset joins
- [ ] Update components to use new audio structure
- [ ] Test reading content with audio playback
- [ ] Test listening content with audio playback
- [ ] Test audio upload functionality (if applicable)
- [ ] Verify RLS policies work correctly
- [ ] Check performance with indexes
- [ ] Test backward compatibility with old audio_url fields

---

## Rollback Plan

If something goes wrong, you can rollback:

```sql
-- Remove foreign keys
ALTER TABLE public.reading_content DROP CONSTRAINT IF EXISTS reading_content_audio_asset_id_fkey;
ALTER TABLE public.listening_content DROP CONSTRAINT IF EXISTS listening_content_audio_asset_id_fkey;

-- Remove columns
ALTER TABLE public.reading_content DROP COLUMN IF EXISTS audio_asset_id;
ALTER TABLE public.listening_content DROP COLUMN IF EXISTS audio_asset_id;

-- Drop audio_assets table
DROP TABLE IF EXISTS public.audio_assets CASCADE;
```

---

## Benefits After Migration

1. **Centralized Management**: All audio files in one place
2. **Metadata Tracking**: Store duration, file size, format, etc.
3. **Reusability**: Same audio can be used across multiple content items
4. **Optimization**: Track which files are optimized/compressed
5. **CDN Support**: Separate CDN URLs from storage URLs
6. **Analytics**: Better tracking of audio usage
7. **Storage Efficiency**: Eliminate duplicate audio files
8. **Version Control**: Easier to manage audio versions

---

## Next Steps

1. Implement the database changes in your development environment
2. Test thoroughly with existing content
3. Deploy to staging environment
4. Verify all functionality works as expected
5. Deploy to production with a maintenance window if needed
6. Monitor for any issues in the first 24-48 hours
7. Consider implementing audio analytics and optimization features

---

## Support & Maintenance

- **Database Schema**: Keep `audio_assets` table schema updated in documentation
- **API Documentation**: Update API docs to reflect new audio structure
- **Admin Panel**: Consider adding an audio asset management interface
- **Monitoring**: Set up alerts for failed audio loads or missing assets
