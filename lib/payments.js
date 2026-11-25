import { sql } from "@/lib/db";
import { getPayment } from "@/lib/settlopay";

const orderStatuses = {
  CREATED: "pending",
  RISK_REVIEW: "pending",
  ROUTED: "pending",
  PENDING_AUTH: "pending",
  AWAITING_CUSTOMER: "pending",
  AUTHORIZED: "processing",
  CAPTURING: "processing",
  SUCCEEDED: "paid",
  CHARGEBACK_WON: "paid",
  PARTIALLY_REFUNDED: "paid",
  DISPUTED: "processing",
  REFUNDED: "refunded",
  BLOCKED: "failed",
  FAILED: "failed",
  EXPIRED: "expired",
  CANCELLED: "cancelled",
  CHARGEBACK_LOST: "failed",
};

export function mapOrderStatus(status) {
  return orderStatuses[status] || "pending";
}

export function normalizePhone(value) {
  const digits = String(value || "").replace(/\D/g, "");
  if (/^0\d{9}$/.test(digits)) return `+255${digits.slice(1)}`;
  if (/^255\d{9}$/.test(digits)) return `+${digits}`;
  return "";
}

export function formatAmount(amount) {
  return `TZS ${Number(amount || 0).toLocaleString("en-TZ")}`;
}

export async function syncPayment(reference) {
  const rows = await sql`
    select id, user_id, plan, status, settlo_payment_id
    from public.orders
    where settlo_payment_id = ${reference} or merchant_reference = ${reference}
    limit 1
  `;
  const order = rows[0];
  const paymentId = /^pi_/.test(String(reference)) ? reference : order?.settlo_payment_id;

  if (!paymentId) {
    const error = new Error("Payment reference could not be matched.");
    error.code = "PAYMENT_REFERENCE_UNKNOWN";
    error.status = 404;
    throw error;
  }

  const payment = await getPayment(paymentId);
  const orderStatus = mapOrderStatus(payment.state);
  const paymentReference = payment.id || paymentId;

  if (order) {
    await sql`
      update public.orders
      set status = ${orderStatus},
          settlo_payment_id = ${paymentReference},
          updated_at = now()
      where id = ${order.id}::uuid
        and (${orderStatus} = 'paid' or public.orders.status <> 'paid')
    `;

    if (orderStatus === "paid" && order.status !== "paid") {
      await sql`
        insert into public.subscriptions (
          user_id, plan, status, settlo_payment_id, current_period_end
        ) values (
          ${order.user_id}::uuid,
          ${order.plan},
          'active',
          ${paymentReference},
          ${new Date(Date.now() + 30 * 86400000).toISOString()}::timestamptz
        )
        on conflict (user_id) do update set
          plan = excluded.plan,
          status = excluded.status,
          settlo_payment_id = excluded.settlo_payment_id,
          current_period_end = excluded.current_period_end
      `;
    }
  }

  return {
    paymentStatus: payment.state,
    orderStatus,
    reference: paymentReference,
    paymentRef: payment.ref || paymentReference,
    message: payment.message || null,
    amount: payment.amount?.value ?? null,
    currency: payment.amount?.currency || "TZS",
    nextAction: payment.next_action || null,
  };
}
