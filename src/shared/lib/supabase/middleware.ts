import { createMiddlewareClient } from "@supabase/auth-helpers-nextjs";
import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { Database } from "@/types/database.types";

export async function middleware(req: NextRequest) {
  const res = NextResponse.next();
  const supabase = createMiddlewareClient<Database>({ req, res });

  const {
    data: { session },
  } = await supabase.auth.getSession();

  // Protected routes
  if (!session && req.nextUrl.pathname.startsWith("/my-words")) {
    return NextResponse.redirect(new URL("/login", req.url));
  }

  if (!session && req.nextUrl.pathname.startsWith("/statistics")) {
    return NextResponse.redirect(new URL("/login", req.url));
  }

  return res;
}

export const config = {
  matcher: ["/my-words/:path*", "/statistics/:path*"],
};
