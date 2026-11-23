import { NextResponse } from "next/server";
import { getSessionUser } from "@/lib/auth";
import { isDatabaseConfigured } from "@/lib/env";
import { syncPayment } from "@/lib/payments";

export async function POST(request) {
  const user = isDatabaseConfigured ? await getSessionUser() : null;
  if (isDatabaseConfigured && !user) {
    return NextResponse.json({ error: "Unahitaji kuingia." }, { status: 401 });
  }

  let body;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Ombi batili." }, { status: 400 });
  }

  const reference = String(body?.reference || "").trim();
  if (!reference) {
    return NextResponse.json({ error: "Reference ya malipo inahitajika." }, { status: 400 });
  }

  try {
    const result = await syncPayment(reference);
    return NextResponse.json(result);
  } catch (error) {
    return NextResponse.json({
      error: error.message || "Hali ya malipo haikuweza kusomwa.",
      code: error.code,
    }, { status: error.status || 502 });
  }
}
