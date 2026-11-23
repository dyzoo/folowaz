import { NextResponse } from "next/server";
import { sql } from "@/lib/db";
import { getSessionUser } from "@/lib/auth";

export async function POST(request) {
  const user = await getSessionUser();
  if (!user) return NextResponse.json({ error: "Unahitaji kuingia." }, { status: 401 });

  const body = await request.json();
  const subject = String(body.subject || "").trim();
  const message = String(body.message || "").trim();
  if (!subject || !message) return NextResponse.json({ error: "Jaza mada na ujumbe." }, { status: 400 });

  await sql`
    insert into public.support_tickets (user_id, subject, message)
    values (${user.id}::uuid, ${subject}, ${message})
  `;
  return NextResponse.json({ ok: true });
}
