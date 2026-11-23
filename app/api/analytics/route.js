import { NextResponse } from "next/server";
import { sql } from "@/lib/db";
import { getSessionUser } from "@/lib/auth";

export async function GET() {
  const user = await getSessionUser();
  if (!user) return NextResponse.json({ error: "Unahitaji kuingia." }, { status: 401 });

  const rows = await sql`
    select * from public.analytics_snapshots
    where user_id = ${user.id}::uuid
    order by recorded_on asc
    limit 30
  `;
  return NextResponse.json({ snapshots: rows });
}
