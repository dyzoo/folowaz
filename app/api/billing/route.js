import { NextResponse } from "next/server";
import { sql } from "@/lib/db";
import { getSessionUser } from "@/lib/auth";

export async function GET() {
  const user = await getSessionUser();
  if (!user) return NextResponse.json({ error: "Unahitaji kuingia." }, { status: 401 });

  const [subscription, orders] = await Promise.all([
    sql`select * from public.subscriptions where user_id = ${user.id}::uuid limit 1`,
    sql`select * from public.orders where user_id = ${user.id}::uuid order by created_at desc limit 10`,
  ]);

  return NextResponse.json({ subscription: subscription[0] || null, orders });
}
