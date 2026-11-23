import { NextResponse } from "next/server";
import { sql } from "@/lib/db";
import { getSessionUser } from "@/lib/auth";

export async function GET() {
  const user = await getSessionUser();
  if (!user) return NextResponse.json({ error: "Unahitaji kuingia." }, { status: 401 });

  const rows = await sql`select * from public.growth_settings where user_id = ${user.id}::uuid limit 1`;
  return NextResponse.json({ settings: rows[0] || null });
}

export async function PUT(request) {
  const user = await getSessionUser();
  if (!user) return NextResponse.json({ error: "Unahitaji kuingia." }, { status: 401 });

  const body = await request.json();
  const list = (value) => Array.isArray(value) ? value.filter(Boolean) : [];
  const settings = {
    niche: String(body.niche || ""),
    target_locations: list(body.target_locations),
    age_min: Number(body.age_min) || 18,
    age_max: Number(body.age_max) || 45,
    genders: list(body.genders),
    languages: list(body.languages),
    interests: list(body.interests),
    hashtags: list(body.hashtags),
    daily_limit: Number(body.daily_limit) || 100,
    status: body.status === "active" ? "active" : "paused",
  };

  await sql`
    insert into public.growth_settings (
      user_id, niche, target_locations, age_min, age_max, genders,
      languages, interests, hashtags, daily_limit, status, updated_at
    ) values (
      ${user.id}::uuid, ${settings.niche}, ${settings.target_locations}, ${settings.age_min}, ${settings.age_max},
      ${settings.genders}, ${settings.languages}, ${settings.interests}, ${settings.hashtags},
      ${settings.daily_limit}, ${settings.status}, now()
    )
    on conflict (user_id) do update set
      niche = excluded.niche,
      target_locations = excluded.target_locations,
      age_min = excluded.age_min,
      age_max = excluded.age_max,
      genders = excluded.genders,
      languages = excluded.languages,
      interests = excluded.interests,
      hashtags = excluded.hashtags,
      daily_limit = excluded.daily_limit,
      status = excluded.status,
      updated_at = excluded.updated_at
  `;

  return NextResponse.json({ ok: true, settings });
}
