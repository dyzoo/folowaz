"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { isDatabaseConfigured } from "@/lib/env";

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function submit(event) {
    event.preventDefault();
    const requested = new URLSearchParams(window.location.search).get("next");
    const nextPath = requested?.startsWith("/dashboard") ? requested : "/dashboard";
    setError("");
    setLoading(true);

    const response = await fetch("/api/auth/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password }),
    });
    const data = await response.json();

    if (!response.ok) {
      setError(data.error || "Imeshindwa kuingia.");
      setLoading(false);
      return;
    }

    router.push(nextPath);
    router.refresh();
  }

  return (
    <main className="auth-page">
      <div className="auth-card">
        <Link href="/" className="brand"><span className="brand-mark">f</span><span className="brand-name">Folowaz</span></Link>
        <h1>Karibu tena</h1>
        <p>Ingia kwenye dashibodi yako ya ukuaji.</p>
        {!isDatabaseConfigured && <div className="setup-note">Database bado haijaunganishwa. Weka <code>DATABASE_URL</code> kwenye <code>.env.local</code>.</div>}
        {error && <div className="auth-error">{error}</div>}
        <form onSubmit={submit}>
          <div className="field"><label htmlFor="email">Barua pepe</label><input id="email" type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="wewe@mfano.com" required /></div>
          <div className="field"><label htmlFor="password">Nenosiri</label><input id="password" type="password" value={password} onChange={(e) => setPassword(e.target.value)} placeholder="••••••••" required /></div>
          <button className="btn btn-primary" type="submit" disabled={loading}>{loading ? "Ingia..." : "Ingia"}</button>
        </form>
        <p className="auth-switch">Huna akaunti? <Link href="/signup">Jisajili bure</Link></p>
      </div>
    </main>
  );
}
