import { NextResponse } from "next/server";
import { sql } from "@/lib/db";
import { getSessionUser } from "@/lib/auth";

export async function GET() {
  const user = await getSessionUser();
  return NextResponse.json({ user });
}

export async function PUT(request) {
  const user = await getSessionUser();
  if (!user) return NextResponse.json({ error: "You must sign in." }, { status: 401 });

  const body = await request.json();
  const fullName = body.fullName === undefined ? user.full_name : String(body.fullName).trim();
  const language = body.language === undefined ? user.language : String(body.language);
  const instagramUsername = body.instagramUsername === undefined
    ? user.instagram_username
    : String(body.instagramUsername).replace(/^@/, "").trim() || null;

  await sql`
    update public.users
    set full_name = ${fullName || null}, language = ${language}, instagram_username = ${instagramUsername}
    where id = ${user.id}::uuid
  `;

  return NextResponse.json({ ok: true, user: { ...user, full_name: fullName, language, instagram_username: instagramUsername } });
}
