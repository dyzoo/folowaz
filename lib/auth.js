import { SignJWT, jwtVerify } from "jose";
import bcrypt from "bcryptjs";
import { cookies } from "next/headers";
import { sql } from "@/lib/db";

const secret = new TextEncoder().encode(process.env.SESSION_SECRET || "folowaz-change-this-secret");
const cookieName = "folowaz_session";

export async function hashPassword(password) {
  return bcrypt.hash(password, 10);
}

export async function verifyPassword(password, hash) {
  return bcrypt.compare(password, hash);
}

export async function createSession(userId) {
  const token = await new SignJWT({ sub: userId })
    .setProtectedHeader({ alg: "HS256" })
    .setIssuedAt()
    .setExpirationTime("7d")
    .sign(secret);

  const store = await cookies();
  store.set(cookieName, token, {
    httpOnly: true,
    sameSite: "lax",
    secure: (process.env.NEXT_PUBLIC_SITE_URL || "").startsWith("https://"),
    path: "/",
    maxAge: 7 * 24 * 60 * 60,
  });
}

export async function clearSession() {
  const store = await cookies();
  store.delete(cookieName);
}

export async function getSessionUser() {
  const store = await cookies();
  const token = store.get(cookieName)?.value;
  if (!token) return null;

  try {
    const { payload } = await jwtVerify(token, secret);
    if (!payload.sub) return null;
    const rows = await sql`
      select id, email, full_name, instagram_username, language
      from public.users
      where id = ${payload.sub}::uuid
      limit 1
    `;
    return rows[0] || null;
  } catch {
    return null;
  }
}
