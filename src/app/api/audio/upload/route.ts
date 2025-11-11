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

    // Get file from form data
    const formData = await request.formData();
    const file = formData.get("file") as File;

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

    console.log('result',result);

    return NextResponse.json({
      success: true,
      url: result.url,
      key: result.key,
    });
  } catch (error) {
    console.error("Audio upload error:", error);
    return NextResponse.json(
      { error: "Failed to upload audio" },
      { status: 500 }
    );
  }
}
