import { NextResponse } from "next/server";
import { verifyWebhookSignature } from "@/lib/settlopay";
import { syncPayment } from "@/lib/payments";

const seenEvents = new Map();
const maxSeenEvents = 1000;

function rememberEvent(eventId) {
  if (!eventId || seenEvents.has(eventId)) return;
  if (seenEvents.size >= maxSeenEvents) {
    const oldest = seenEvents.keys().next().value;
    seenEvents.delete(oldest);
  }
  seenEvents.set(eventId, Date.now());
}

export async function POST(request) {
  const rawBody = await request.text();
  const signature = request.headers.get("settlo-signature");

  if (!verifyWebhookSignature(rawBody, signature)) {
    return NextResponse.json({ error: "Invalid signature" }, { status: 400 });
  }

  let event;
  try {
    event = JSON.parse(rawBody);
  } catch {
    return NextResponse.json({ error: "Invalid payload" }, { status: 400 });
  }

  const eventId = request.headers.get("settlo-event-id") || event?.id;
  if (eventId && seenEvents.has(eventId)) {
    return NextResponse.json({ received: true, duplicate: true });
  }

  if (event?.type && !event.type.startsWith("payment_intent.")) {
    rememberEvent(eventId);
    return NextResponse.json({ received: true });
  }

  const reference = event?.data?.id || event?.data?.external_id || event?.data?.merchant_reference;
  if (!reference) {
    return NextResponse.json({ error: "Reference is missing" }, { status: 400 });
  }

  try {
    const result = await syncPayment(reference);
    rememberEvent(eventId);
    return NextResponse.json({ received: true, status: result.orderStatus });
  } catch (error) {
    return NextResponse.json({
      error: error.message || "Webhook processing failed",
      code: error.code,
    }, { status: error.status || 502 });
  }
}
