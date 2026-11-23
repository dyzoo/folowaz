import { NextResponse } from "next/server";
import { sql } from "@/lib/db";
import { getSessionUser } from "@/lib/auth";

export async function POST(request) {
  const user = await getSessionUser();
  if (!user) return NextResponse.json({ error: "You must sign in." }, { status: 401 });

  const body = await request.json();
  const subject = String(body.subject || "").trim();
  const message = String(body.message || "").trim();
  if (!subject || !message) return NextResponse.json({ error: "Enter a subject and message." }, { status: 400 });

  await sql`
    insert into public.support_tickets (user_id, subject, message)
    values (${user.id}::uuid, ${subject}, ${message})
  `;
  return NextResponse.json({ ok: true });
}
