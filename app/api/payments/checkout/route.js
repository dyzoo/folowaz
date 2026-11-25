import { randomUUID } from "node:crypto";
import { NextResponse } from "next/server";
import { sql } from "@/lib/db";
import { getSessionUser } from "@/lib/auth";
import { isDatabaseConfigured, plans } from "@/lib/env";
import { createMobilePayment, isSettloPayConfigured } from "@/lib/settlopay";
import { mapOrderStatus, normalizePhone } from "@/lib/payments";

export async function POST(request) {
  if (!isSettloPayConfigured) {
    return NextResponse.json({ error: "Payments are not configured." }, { status: 503 });
  }

  const user = isDatabaseConfigured ? await getSessionUser() : null;

  let body;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid request." }, { status: 400 });
  }

  const plan = plans[body?.plan];
  const method = body?.method === "mobile" || body?.method === "mobile_money" ? "mobile_money" : "";
  const phone = normalizePhone(body?.phone);

  if (!plan) {
    return NextResponse.json({ error: "Choose a valid plan." }, { status: 400 });
  }
  if (!method) {
    return NextResponse.json({ error: "Only mobile money payments are available." }, { status: 400 });
  }
  if (!phone) {
    return NextResponse.json({ error: "Enter a valid phone number." }, { status: 400 });
  }

  const merchantReference = `FWZ-${randomUUID()}`;
  const description = `Folowaz ${plan.name} plan`;

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
    const payment = await createMobilePayment({
      amount: plan.price,
      phone,
      merchantReference,
      description,
    });
    const reference = payment.id || merchantReference;

    if (user) {
      await sql`
        update public.orders
        set settlo_payment_id = ${reference},
            status = ${mapOrderStatus(payment.state)},
            updated_at = now()
        where merchant_reference = ${merchantReference}
      `;
    }

    return NextResponse.json({
      reference,
      paymentRef: payment.ref || reference,
      merchantReference,
      status: payment.state,
      orderStatus: mapOrderStatus(payment.state),
      checkoutUrl: null,
      message: payment.message || null,
      providerStatus: payment.state || null,
      nextAction: payment.next_action || null,
      amount: payment.amount?.value ?? plan.price,
      currency: payment.amount?.currency || "TZS",
    });
  } catch (error) {
    const outcomeUnknown = error.code === "PROVIDER_OUTCOME_UNKNOWN" || error.code === "idempotency_conflict";
    if (user && !outcomeUnknown) {
      await sql`update public.orders set status = 'failed', updated_at = now() where merchant_reference = ${merchantReference}`;
    }

    return NextResponse.json({
      error: error.message || "The payment request failed.",
      code: error.code,
      reference: outcomeUnknown ? merchantReference : undefined,
      retryAfterSeconds: error.retryAfterSeconds || null,
    }, { status: outcomeUnknown ? 202 : error.status || 502 });
  }
}
