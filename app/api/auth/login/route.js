import { NextResponse } from "next/server";
import { sql } from "@/lib/db";
import { createSession, verifyPassword } from "@/lib/auth";

export async function POST(request) {
  const body = await request.json();
  const email = String(body.email || "").trim().toLowerCase();
  const password = String(body.password || "");

  if (!email || !password) {
    return NextResponse.json({ error: "Enter your email and password." }, { status: 400 });
  }

  const rows = await sql`select id, password_hash from public.users where email = ${email} limit 1`;
  if (!rows.length || !(await verifyPassword(password, rows[0].password_hash))) {
    return NextResponse.json({ error: "Invalid email or password." }, { status: 401 });
  }

  await createSession(rows[0].id);
  return NextResponse.json({ ok: true });
}
