import { createServerClient } from "@supabase/ssr";
import { cookies } from "next/headers";
import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export const dynamic = "force-dynamic";

export async function POST(request: NextRequest) {
  try {
    const { password } = await request.json();

    if (!password || password.length < 6) {
      return NextResponse.json(
        { error: "Password must be at least 6 characters" },
        { status: 400 }
      );
    }

    const cookieStore = await cookies();

    const supabase = createServerClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
      {
        // cookieOptions: { name: "lingofy-auth-token" },
        cookies: {
          getAll() {
            return cookieStore.getAll();
          },
          setAll(cookiesToSet) {
            try {
              cookiesToSet.forEach(({ name, value, options }) =>
                cookieStore.set(name, value, options)
              );
            } catch (error) {
              console.error("Cookie setting error:", error);
            }
          },
        },
      }
    );

    // Session kontrolü
    const {
      data: { session },
    } = await supabase.auth.getSession();

    if (!session) {
      return NextResponse.json(
        { error: "No active session found" },
        { status: 401 }
      );
    }

    console.log("Updating password for user:", session.user.email);

    // Password update
    const { data, error } = await supabase.auth.updateUser({
      password: password,
    });

    if (error) {
      console.error("Update password error:", error);
      return NextResponse.json({ error: error.message }, { status: 400 });
    }

    console.log("Password updated successfully for:", data.user.email);

    return NextResponse.json({
      success: true,
      user: {
        id: data.user.id,
        email: data.user.email,
      },
    });
  } catch (error: any) {
    console.error("Update password route error:", error);
    return NextResponse.json(
      { error: error.message || "Internal server error" },
      { status: 500 }
    );
  }
}
