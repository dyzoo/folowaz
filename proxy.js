import { NextResponse } from "next/server";

export async function proxy(request) {
  if (!process.env.DATABASE_URL) return NextResponse.next();

  const hasSession = Boolean(request.cookies.get("folowaz_session")?.value);
  if (!hasSession) {
    const loginUrl = new URL("/login", request.url);
    loginUrl.searchParams.set("next", request.nextUrl.pathname);
    return NextResponse.redirect(loginUrl);
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/dashboard/:path*"],
};
