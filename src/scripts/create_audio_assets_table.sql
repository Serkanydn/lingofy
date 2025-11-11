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
