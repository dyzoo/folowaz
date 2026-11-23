import { randomUUID } from "node:crypto";
import { NextResponse } from "next/server";
import { sql } from "@/lib/db";
import { getSessionUser } from "@/lib/auth";
import { isDatabaseConfigured, plans, siteUrl } from "@/lib/env";
import { createCardPayment, createMobilePayment, isNoripesaConfigured } from "@/lib/noripesa";
import { mapOrderStatus, normalizePhone } from "@/lib/payments";

export async function POST(request) {
  if (!isNoripesaConfigured) {
    return NextResponse.json({ error: "Malipo hayajasanidiwa." }, { status: 503 });
  }

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

  const plan = plans[body?.plan];
  const method = body?.method === "card" ? "card" : body?.method === "mobile" ? "mobile" : "";
  const phone = normalizePhone(body?.phone);

  if (!plan || !method || !phone) {
    return NextResponse.json({ error: "Chagua mpango, njia ya malipo, na namba sahihi ya simu." }, { status: 400 });
  }

  const merchantReference = `FLW-${randomUUID()}`;
  const customerName = user?.full_name || user?.email?.split("@")[0] || "Folowaz Customer";
  const customerEmail = user?.email || "noreply@folowaz.local";
  const description = `Folowaz ${plan.name} plan`;
  const returnUrl = method === "card" && siteUrl.startsWith("https://")
    ? `${siteUrl}/dashboard/billing?payment=return&reference=${encodeURIComponent(merchantReference)}`
    : undefined;

  if (user) {
    await sql`
      insert into public.orders (
        user_id, merchant_reference, plan, amount, currency, status, payment_method, phone
      ) values (
        ${user.id}::uuid, ${merchantReference}, ${body.plan}, ${plan.price}, 'TZS', 'pending', ${method}, ${phone}
      )
    `;
  }

  try {
    const common = {
      amount: plan.price,
      phone,
      customerName,
      customerEmail,
      merchantReference,
      description,
    };
    const payment = method === "card"
      ? await createCardPayment({ ...common, returnUrl })
      : await createMobilePayment(common);
    const reference = payment.reference || merchantReference;

    if (user) {
      await sql`
        update public.orders
        set noripesa_reference = ${reference},
            status = ${mapOrderStatus(payment.status)},
            checkout_url = ${payment.checkout_url || null},
            updated_at = now()
        where merchant_reference = ${merchantReference}
      `;
    }

    return NextResponse.json({
      reference,
      merchantReference,
      status: payment.status,
      orderStatus: mapOrderStatus(payment.status),
      checkoutUrl: payment.checkout_url || null,
      amount: plan.price,
      currency: "TZS",
    });
  } catch (error) {
    const outcomeUnknown = error.code === "PROVIDER_OUTCOME_UNKNOWN";
    if (user && !outcomeUnknown) {
      await sql`update public.orders set status = 'failed', updated_at = now() where merchant_reference = ${merchantReference}`;
    }

    return NextResponse.json({
      error: error.message || "Ombi la malipo halikufanikiwa.",
      code: error.code,
      reference: outcomeUnknown ? merchantReference : undefined,
    }, { status: outcomeUnknown ? 202 : error.status || 502 });
  }
}
