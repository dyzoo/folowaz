export const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000";
export const databaseUrl = process.env.DATABASE_URL || "";
export const isDatabaseConfigured =
  process.env.NEXT_PUBLIC_DATABASE_CONFIGURED === "true" || Boolean(databaseUrl);
export const noripesaApiKey = process.env.NORIPESA_API_KEY || "";
export const noripesaWebhookSecret = process.env.NORIPESA_WEBHOOK_SECRET || "";

export const plans = {
  basic: { name: "Basic", price: 19000, limit: 1000 },
  pro: { name: "Pro", price: 39000, limit: 4000 },
  turbo: { name: "Turbo", price: 79000, limit: 10000 },
};
