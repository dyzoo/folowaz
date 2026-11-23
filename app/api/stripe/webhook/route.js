import { NextResponse } from "next/server";
import Stripe from "stripe";
import { sql } from "@/lib/db";
import { isDatabaseConfigured, stripeSecretKey } from "@/lib/env";

export async function POST(request) {
  const signature = request.headers.get("stripe-signature");
  const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET;

  if (!stripeSecretKey || !webhookSecret || !signature) {
    return NextResponse.json({ error: "Webhook is not configured" }, { status: 400 });
  }

  const stripe = new Stripe(stripeSecretKey);
  const body = await request.text();

  let event;
  try {
    event = stripe.webhooks.constructEvent(body, signature, webhookSecret);
  } catch {
    return NextResponse.json({ error: "Invalid signature" }, { status: 400 });
  }

  if (event.type === "checkout.session.completed") {
    const session = event.data.object;
    const userId = session.metadata?.user_id || session.client_reference_id;
    const plan = session.metadata?.plan;

    if (isDatabaseConfigured && userId) {
      await sql`update public.orders set status = 'paid' where stripe_session_id = ${session.id}`;
      await sql`
        insert into public.subscriptions (
          user_id, plan, status, stripe_customer_id, stripe_subscription_id, current_period_end
        ) values (
          ${userId}::uuid, ${plan}, 'active', ${session.customer}, ${session.subscription},
          ${new Date(Date.now() + 30 * 86400000).toISOString()}::timestamptz
        )
        on conflict (user_id) do update set
          plan = excluded.plan,
          status = excluded.status,
          stripe_customer_id = excluded.stripe_customer_id,
          stripe_subscription_id = excluded.stripe_subscription_id,
          current_period_end = excluded.current_period_end
      `;
    }
  }

  return NextResponse.json({ received: true });
}
