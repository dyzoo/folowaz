import { createHmac, timingSafeEqual } from "node:crypto";
import { noripesaApiKey, noripesaWebhookSecret } from "@/lib/env";

const baseUrl = "https://noripesa.com/api/v1";

export const isNoripesaConfigured = Boolean(noripesaApiKey);

async function request(path, { method = "GET", body, idempotencyKey } = {}) {
  if (!noripesaApiKey) {
    const error = new Error("Noripesa is not configured");
    error.code = "NOT_CONFIGURED";
    error.status = 503;
    throw error;
  }

  const response = await fetch(`${baseUrl}${path}`, {
    method,
    headers: {
      Authorization: `Bearer ${noripesaApiKey}`,
      "Content-Type": "application/json",
      ...(idempotencyKey ? { "Idempotency-Key": idempotencyKey } : {}),
    },
    body: body ? JSON.stringify(body) : undefined,
    cache: "no-store",
  });

  const payload = await response.json().catch(() => ({}));

  if (!response.ok) {
    const error = new Error(payload.message || `Noripesa request failed (${response.status})`);
    error.code = payload.code || "NORIPESA_ERROR";
    error.status = response.status;
    throw error;
  }

  return payload.data || payload;
}

export function createMobilePayment({
  amount,
  phone,
  customerName,
  customerEmail,
  merchantReference,
  description,
}) {
  return request("/collect", {
    method: "POST",
    idempotencyKey: merchantReference,
    body: {
      amount,
      phone,
      customer_name: customerName,
      customer_email: customerEmail,
      merchant_reference: merchantReference,
      description,
    },
  });
}

export function createCardPayment({
  amount,
  phone,
  customerName,
  customerEmail,
  merchantReference,
  description,
  returnUrl,
}) {
  return request("/card-collect", {
    method: "POST",
    idempotencyKey: merchantReference,
    body: {
      amount,
      phone,
      customer_name: customerName,
      customer_email: customerEmail,
      city: "Dar es Salaam",
      merchant_reference: merchantReference,
      description,
      ...(returnUrl ? { return_url: returnUrl } : {}),
    },
  });
}

export function getPaymentStatus(reference) {
  return request("/status", {
    method: "POST",
    body: { reference },
  });
}

export function verifyWebhookSignature(rawBody, header) {
  if (!noripesaWebhookSecret) return true;
  if (!header) return false;

  const parts = Object.fromEntries(header.split(",").map((part) => part.split("=")));
  const timestamp = Number(parts.t);
  const signature = parts.v1;

  if (!timestamp || !signature || Math.abs(Date.now() / 1000 - timestamp) > 300) return false;

  const expected = createHmac("sha256", noripesaWebhookSecret)
    .update(`${timestamp}.${rawBody}`)
    .digest("hex");
  const expectedBuffer = Buffer.from(expected, "hex");
  const receivedBuffer = Buffer.from(signature, "hex");

  return expectedBuffer.length === receivedBuffer.length && timingSafeEqual(expectedBuffer, receivedBuffer);
}
