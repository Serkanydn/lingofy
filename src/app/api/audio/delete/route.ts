import { NextRequest, NextResponse } from "next/server";
import { deleteAudioFromR2, extractR2KeyFromUrl } from "@/shared/services/cloudflareService";
import { createServerSupabaseClient } from "@/shared/lib/supabase/server";

export async function POST(request: NextRequest) {
  try {
    // Check authentication
    const supabase = await createServerSupabaseClient();
    const { data: { user }, error: authError } = await supabase.auth.getUser();

    if (authError || !user) {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      );
    }

    // Get URL from request body
    const body = await request.json();
    const { url } = body;

    if (!url) {
      return NextResponse.json(
        { error: "No URL provided" },
        { status: 400 }
      );
    }

    // Extract key from URL
    const key = extractR2KeyFromUrl(url);

    if (!key) {
      return NextResponse.json(
        { error: "Invalid R2 URL" },
        { status: 400 }
      );
    }

    // Delete from R2
    await deleteAudioFromR2(key);

    return NextResponse.json({
      success: true,
      message: "Audio deleted successfully",
    });
  } catch (error) {
    console.error("Audio deletion error:", error);
    return NextResponse.json(
      { error: "Failed to delete audio" },
      { status: 500 }
    );
  }
}
