import { createHmac, timingSafeEqual } from "node:crypto";
import { settloApiKey, settloWebhookSecret } from "@/lib/env";

const baseUrl = "https://api.settlopay.co.tz/v1";
const apiVersion = "2026-04-29";

export const isSettloPayConfigured = Boolean(settloApiKey);

async function request(path, { method = "GET", body, idempotencyKey } = {}) {
  if (!settloApiKey) {
    const error = new Error("Settlo Pay is not configured");
    error.code = "NOT_CONFIGURED";
    error.status = 503;
    throw error;
  }

  const response = await fetch(`${baseUrl}${path}`, {
    method,
    headers: {
      Authorization: `Bearer ${settloApiKey}`,
      "Content-Type": "application/json",
      "Settlo-Version": apiVersion,
      ...(idempotencyKey ? { "Idempotency-Key": idempotencyKey } : {}),
    },
    body: body ? JSON.stringify(body) : undefined,
    cache: "no-store",
  });

  const payload = await response.json().catch(() => ({}));

  if (!response.ok) {
    const error = new Error(payload.message || `Settlo Pay request failed (${response.status})`);
    error.code = payload.code || "SETTLO_PAY_ERROR";
    error.status = response.status;
    error.retryAfterSeconds = Number(response.headers.get("retry-after")) || payload.retry_after_seconds || null;
    throw error;
  }

  return payload;
}

export function createMobilePayment({ amount, phone, merchantReference, description }) {
  return request("/payments", {
    method: "POST",
    idempotencyKey: merchantReference,
    body: {
      amount: { value: Number(amount), currency: "TZS" },
      method: "mobile_money",
      method_data: { phone },
      merchant_reference: merchantReference,
      ...(description ? { description } : {}),
    },
  });
}

export function getPayment(id) {
  if (!/^pi_[A-Za-z0-9_-]+$/.test(String(id || ""))) {
    const error = new Error("Invalid payment reference");
    error.code = "INVALID_PAYMENT_REFERENCE";
    error.status = 400;
    throw error;
  }

  return request(`/payments/${encodeURIComponent(id)}`);
}

export function verifyWebhookSignature(rawBody, header) {
  if (!settloWebhookSecret || !header) return false;

  const parts = Object.fromEntries(header.split(",").map((part) => {
    const separator = part.indexOf("=");
    return separator < 0 ? [part.trim(), ""] : [part.slice(0, separator).trim(), part.slice(separator + 1).trim()];
  }));
  const timestamp = Number(parts.t);
  const signature = parts.v1;

  if (!Number.isFinite(timestamp) || !signature || Math.abs(Date.now() / 1000 - timestamp) > 300) return false;

  const expected = createHmac("sha256", settloWebhookSecret)
    .update(`${timestamp}.`)
    .update(rawBody)
    .digest();
  const received = Buffer.from(signature, "hex");

  return received.length === expected.length && timingSafeEqual(received, expected);
}
