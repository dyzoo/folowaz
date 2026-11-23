export const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000";
export const databaseUrl = process.env.DATABASE_URL || "";
export const isDatabaseConfigured =
  process.env.NEXT_PUBLIC_DATABASE_CONFIGURED === "true" || Boolean(databaseUrl);
export const stripeSecretKey = process.env.STRIPE_SECRET_KEY || "";

export const plans = {
  basic: { name: "Basic", price: 1900, limit: 1000 },
  pro: { name: "Pro", price: 3900, limit: 4000 },
  turbo: { name: "Turbo", price: 7900, limit: 10000 },
};
