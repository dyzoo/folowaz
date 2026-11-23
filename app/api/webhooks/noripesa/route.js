import { NextResponse } from "next/server";
import { verifyWebhookSignature } from "@/lib/noripesa";
import { syncPayment } from "@/lib/payments";

export async function POST(request) {
  const rawBody = await request.text();
  const signature = request.headers.get("x-noripesa-signature");
  const eventName = request.headers.get("x-noripesa-event");

  if (!verifyWebhookSignature(rawBody, signature)) {
    return NextResponse.json({ error: "Invalid signature" }, { status: 400 });
  }

  let event;
  try {
    event = JSON.parse(rawBody);
  } catch {
    return NextResponse.json({ error: "Invalid payload" }, { status: 400 });
  }

  if (eventName && eventName !== "payment.updated") {
    return NextResponse.json({ received: true });
  }

  const reference = event?.data?.reference || event?.data?.merchant_reference;
  if (!reference) {
    return NextResponse.json({ error: "Reference is missing" }, { status: 400 });
  }

  try {
    const result = await syncPayment(reference);
    return NextResponse.json({ received: true, status: result.orderStatus });
  } catch (error) {
    return NextResponse.json({
      error: error.message || "Webhook processing failed",
      code: error.code,
    }, { status: error.status || 502 });
  }
}
