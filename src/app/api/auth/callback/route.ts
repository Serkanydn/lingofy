import { createServerClient } from "@supabase/ssr";
import { cookies } from "next/headers";
import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export const dynamic = "force-dynamic";

export async function GET(request: NextRequest) {
  try {
    const requestUrl = new URL(request.url);
    const code = requestUrl.searchParams.get("code");
    const next = requestUrl.searchParams.get("next") || "/";
    const error_description = requestUrl.searchParams.get("error_description");

    // Eğer error varsa direkt login'e yönlendir
    if (error_description) {
      return NextResponse.redirect(
        new URL(
          `/login?error=${encodeURIComponent(error_description)}`,
          request.url
        )
      );
    }

    if (!code) {
      return NextResponse.redirect(
        new URL("/login?error=no_code", request.url)
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
              // Cookie setting hatası - SSR'da olabilir
            }
          },
        },
      }
    );

    // Code'u session'a çevir
    const { data, error } = await supabase.auth.exchangeCodeForSession(code);

    if (error) {
      console.error("Exchange code error:", error);
      return NextResponse.redirect(
        new URL(
          `/login?error=${encodeURIComponent(error.message)}`,
          request.url
        )
      );
    }

    // Session başarıyla oluşturuldu
    console.log("Session created:", data.session);

    // Password recovery mi kontrol et
    const isPasswordRecovery = next.includes("reset-password");

    if (isPasswordRecovery) {
      // Reset password sayfasına yönlendir
      return NextResponse.redirect(new URL(next, request.url));
    }

    // Normal login flow - dashboard'a veya belirtilen next'e yönlendir
    return NextResponse.redirect(new URL(next, request.url));
  } catch (error) {
    console.error("Callback error:", error);
    return NextResponse.redirect(
      new URL("/login?error=callback_error", request.url)
    );
  }
}
