import { NextResponse } from "next/server";
import { sql } from "@/lib/db";
import { createSession, hashPassword } from "@/lib/auth";

export async function POST(request) {
  const body = await request.json();
  const email = String(body.email || "").trim().toLowerCase();
  const password = String(body.password || "");
  const fullName = String(body.fullName || "").trim();
  const instagramUsername = String(body.instagramUsername || "").replace(/^@/, "").trim();

  if (!/^\S+@\S+\.\S+$/.test(email) || password.length < 6 || !fullName) {
    return NextResponse.json({ error: "Please provide valid details." }, { status: 400 });
  }

  const existing = await sql`select id from public.users where email = ${email} limit 1`;
  if (existing.length) return NextResponse.json({ error: "This email is already registered." }, { status: 409 });

  const hash = await hashPassword(password);
  const rows = await sql`
    insert into public.users (email, password_hash, full_name, instagram_username)
    values (${email}, ${hash}, ${fullName}, ${instagramUsername || null})
    returning id
  `;
  const userId = rows[0].id;

  for (let i = 0; i < 7; i++) {
    const day = new Date();
    day.setUTCDate(day.getUTCDate() - (6 - i));
    const recordedOn = day.toISOString().slice(0, 10);
    await sql`
      insert into public.analytics_snapshots
        (user_id, recorded_on, followers, following, likes, comments, reach, profile_views)
      values
        (${userId}::uuid, ${recordedOn}::date, ${12480 + i * 1270}, ${301 + i * 3},
         ${842 + i * 120}, ${96 + i * 18}, ${14200 + i * 2500}, ${2240 + i * 390})
      on conflict (user_id, recorded_on) do nothing
    `;
  }

  await createSession(userId);
  return NextResponse.json({ ok: true });
}
