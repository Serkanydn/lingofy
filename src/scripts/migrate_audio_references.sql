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
