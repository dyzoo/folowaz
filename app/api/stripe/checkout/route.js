import { NextResponse } from "next/server";
import Stripe from "stripe";
import { sql } from "@/lib/db";
import { getSessionUser } from "@/lib/auth";
import { isDatabaseConfigured, plans, siteUrl, stripeSecretKey } from "@/lib/env";

export async function GET(request) {
  const { searchParams } = new URL(request.url);
  const planKey = searchParams.get("plan");
  const plan = plans[planKey];

  if (!plan) return NextResponse.redirect(new URL("/dashboard/billing?status=invalid", siteUrl));
  if (!stripeSecretKey) return NextResponse.redirect(new URL("/dashboard/billing?status=not_configured", siteUrl));

  const stripe = new Stripe(stripeSecretKey);
  const user = isDatabaseConfigured ? await getSessionUser() : null;

  const session = await stripe.checkout.sessions.create({
    mode: "subscription",
    line_items: [{
      price_data: {
        currency: "usd",
        unit_amount: plan.price,
        recurring: { interval: "month" },
        product_data: { name: `Folowaz ${plan.name}` },
      },
      quantity: 1,
    }],
    customer_email: user?.email,
    client_reference_id: user?.id,
    metadata: { plan: planKey, user_id: user?.id || "" },
    success_url: `${siteUrl}/dashboard/billing?status=success`,
    cancel_url: `${siteUrl}/dashboard/billing?status=cancelled`,
  });

  if (user) {
    await sql`
      insert into public.orders (user_id, stripe_session_id, plan, amount, currency, status)
      values (${user.id}::uuid, ${session.id}, ${planKey}, ${plan.price}, 'usd', 'pending')
    `;
  }

  return NextResponse.redirect(session.url, 303);
}
