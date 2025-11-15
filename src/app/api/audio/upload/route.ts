import { NextRequest, NextResponse } from "next/server";
import { uploadAudioToR2 } from "@/shared/services/cloudflareService";
import { createServerSupabaseClient } from "@/shared/lib/supabase/server";

export async function POST(request: NextRequest) {
  try {
    // Check authentication
    const supabase = await createServerSupabaseClient();
    const { data: { user }, error: authError } = await supabase.auth.getUser();
    console.log('authError',authError);
    console.log('user',user);
    if (authError || !user) {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      );
    }

    // Get file and content type from form data
    const formData = await request.formData();
    const file = formData.get("file") as File;
    const contentType = formData.get("contentType") as string || "general";

    if (!file) {
      return NextResponse.json(
        { error: "No file provided" },
        { status: 400 }
      );
    }

    // Validate file type
    const allowedTypes = ["audio/mpeg", "audio/mp3", "audio/wav", "audio/ogg", "audio/m4a"];
    if (!allowedTypes.includes(file.type)) {
      return NextResponse.json(
        { error: "Invalid file type. Only audio files allowed." },
        { status: 400 }
      );
    }

    // Validate file size (max 10MB)
    const maxSize = 10 * 1024 * 1024; // 10MB
    if (file.size > maxSize) {
      return NextResponse.json(
        { error: "File too large. Maximum size is 10MB." },
        { status: 400 }
      );
    }

    // Upload to R2
    const result = await uploadAudioToR2({
      file,
      fileName: file.name,
      contentType: file.type,
    });

    console.log('Cloudflare upload result:', result);

    // Create audio asset record in Supabase
    const { data: audioAsset, error: insertError } = await (supabase
      .from('audio_assets') as any)
      .insert({
        storage_url: result.url,
        cdn_url: result.url, // Use public URL as CDN URL
        original_filename: file.name,
        file_size_bytes: file.size,
        content_type: contentType,
        storage_provider: 'cloudflare_r2',
        storage_bucket: process.env.CLOUDFLARE_R2_BUCKET_NAME || 'audio-assets',
        storage_path: result.key,
        format: file.name.split('.').pop(),
        is_active: true,
      })
      .select()
      .single();

    if (insertError) {
      console.error('Database insert error:', insertError);
      return NextResponse.json(
        { error: "Failed to create audio asset record" },
        { status: 500 }
      );
    }

    console.log('Audio asset created:', audioAsset);

    return NextResponse.json({
      success: true,
      audioAsset,
    });
  } catch (error) {
    console.error("Audio upload error:", error);
    return NextResponse.json(
      { error: "Failed to upload audio" },
      { status: 500 }
    );
  }
}
