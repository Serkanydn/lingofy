import { supabase } from '@/shared/lib/supabase/client';
import type { AudioAsset } from '@/shared/types/audio.types';

export interface AudioUploadOptions {
  file: File;
  contentType: 'reading' | 'listening' | 'pronunciation' | 'general';
}

export interface AudioUploadResult {
  success: boolean;
  audioAsset?: AudioAsset;
  error?: string;
}

/**
 * Upload an audio file to Cloudflare R2 via API route and create an audio asset record in Supabase
 */
export async function uploadAudioAsset(
  options: AudioUploadOptions
): Promise<AudioUploadResult> {
  try {
    const { file, contentType } = options;
    
    // Validate file
    if (!file || file.size === 0) {
      return { success: false, error: 'Invalid or empty file' };
    }
    
    console.log('Uploading audio file via API:', {
      name: file.name,
      size: file.size,
      type: file.type,
      contentType,
    });
    
    // Create form data
    const formData = new FormData();
    formData.append('file', file);
    formData.append('contentType', contentType);
    
    // Upload via API route
    const response = await fetch('/api/audio/upload', {
      method: 'POST',
      body: formData,
    });
    
    const result = await response.json();
    
    if (!response.ok || !result.success) {
      console.error('Upload failed:', result.error);
      return { success: false, error: result.error || 'Failed to upload audio' };
    }
    
    console.log('Upload successful:', result.audioAsset);
    
    return { success: true, audioAsset: result.audioAsset as AudioAsset };
  } catch (error) {
    console.error('Upload exception:', error);
    return { 
      success: false, 
      error: error instanceof Error ? error.message : 'Unknown error' 
    };
  }
}

/**
 * Delete an audio asset (soft delete and remove from Cloudflare R2)
 */
export async function deleteAudioAsset(assetId: string): Promise<boolean> {
  try {
    // Get asset details
    const { data: asset } = await supabase
      .from('audio_assets')
      .select('*')
      .eq('id', assetId)
      .single();
    
    if (!asset) return false;
    
    // Delete from Cloudflare R2 if storage path exists
    if ((asset as any).storage_path) {
      try {
        const { deleteAudioFromR2 } = await import('./cloudflareService');
        await deleteAudioFromR2((asset as any).storage_path);
      } catch (error) {
        console.error('Error deleting from R2:', error);
        // Continue with soft delete even if R2 deletion fails
      }
    }
    
    // Soft delete from database
    await (supabase
      .from('audio_assets') as any)
      .update({ is_active: false })
      .eq('id', assetId);
    
    return true;
  } catch (error) {
    console.error('Error deleting audio asset:', error);
    return false;
  }
}

/**
 * Get audio asset by ID
 */
export async function getAudioAsset(assetId: string): Promise<AudioAsset | null> {
  try {
    const { data, error } = await supabase
      .from('audio_assets')
      .select('*')
      .eq('id', assetId)
      .eq('is_active', true)
      .single();
    
    if (error) throw error;
    return data as AudioAsset;
  } catch (error) {
    console.error('Error fetching audio asset:', error);
    return null;
  }
}

/**
 * Update audio asset metadata
 */
export async function updateAudioAsset(
  assetId: string,
  updates: Partial<AudioAsset>
): Promise<boolean> {
  try {
    const { error } = await (supabase
      .from('audio_assets') as any)
      .update(updates)
      .eq('id', assetId);
    
    if (error) throw error;
    return true;
  } catch (error) {
    console.error('Error updating audio asset:', error);
    return false;
  }
}

/**
 * List audio assets by content type
 */
export async function listAudioAssets(
  contentType?: 'reading' | 'listening' | 'pronunciation' | 'general'
): Promise<AudioAsset[]> {
  try {
    let query = supabase
      .from('audio_assets')
      .select('*')
      .eq('is_active', true)
      .order('created_at', { ascending: false });
    
    if (contentType) {
      query = query.eq('content_type', contentType);
    }
    
    const { data, error } = await query;
    
    if (error) throw error;
    return data as AudioAsset[];
  } catch (error) {
    console.error('Error listing audio assets:', error);
    return [];
  }
}
