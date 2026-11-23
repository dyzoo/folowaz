import { sql } from "@/lib/db";
import { getPaymentStatus } from "@/lib/noripesa";

const orderStatuses = {
  initiating: "pending",
  pending: "pending",
  processing: "processing",
  success: "paid",
  failed: "failed",
  cancelled: "cancelled",
  expired: "expired",
};

export function mapOrderStatus(status) {
  return orderStatuses[status] || "pending";
}

export function normalizePhone(value) {
  const digits = String(value || "").replace(/\D/g, "");
  if (/^0\d{9}$/.test(digits)) return `255${digits.slice(1)}`;
  if (/^255\d{9}$/.test(digits)) return digits;
  return "";
}

export function formatAmount(amount) {
  return `TZS ${Number(amount || 0).toLocaleString("en-TZ")}`;
}

export async function syncPayment(reference) {
  const payment = await getPaymentStatus(reference);
  const orderStatus = mapOrderStatus(payment.status);
  const rows = await sql`
    select id, user_id, plan, status
    from public.orders
    where noripesa_reference = ${reference} or merchant_reference = ${reference}
    limit 1
  `;
  const order = rows[0];

  if (!order) {
    return { paymentStatus: payment.status, orderStatus, reference: payment.reference || reference, message: payment.message || null };
  }

  await sql`
    update public.orders
    set status = ${orderStatus},
        noripesa_reference = coalesce(${payment.reference || null}, noripesa_reference),
        updated_at = now()
    where id = ${order.id}::uuid
      and (${orderStatus} = 'paid' or public.orders.status <> 'paid')
  `;

  if (orderStatus === "paid") {
    await sql`
      insert into public.subscriptions (
        user_id, plan, status, noripesa_reference, current_period_end
      ) values (
        ${order.user_id}::uuid,
        ${order.plan},
        'active',
        ${payment.reference || reference},
        ${new Date(Date.now() + 30 * 86400000).toISOString()}::timestamptz
      )
      on conflict (user_id) do update set
        plan = excluded.plan,
        status = excluded.status,
        noripesa_reference = excluded.noripesa_reference,
        current_period_end = excluded.current_period_end
    `;
  }

  return {
    paymentStatus: payment.status,
    orderStatus,
    reference: payment.reference || reference,
    message: payment.message || null,
    amount: payment.amount,
    currency: payment.currency,
  };
}
