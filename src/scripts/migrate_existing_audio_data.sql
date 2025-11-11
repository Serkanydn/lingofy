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
