"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { isDatabaseConfigured } from "@/lib/env";

export default function SignupPage() {
  const router = useRouter();
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function submit(event) {
    event.preventDefault();
    const ig = new URLSearchParams(window.location.search).get("ig")?.replace(/^@/, "").trim();
    setError("");
    setLoading(true);

    const response = await fetch("/api/auth/signup", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ fullName, email, password, instagramUsername: ig || "" }),
    });
    const data = await response.json();

    if (!response.ok) {
      setError(data.error || "Imeshindwa kufungua akaunti.");
      setLoading(false);
      return;
    }

    router.push("/dashboard");
    router.refresh();
  }

  return (
    <main className="auth-page">
      <div className="auth-card">
        <Link href="/" className="brand"><span className="brand-mark">f</span><span className="brand-name">Folowaz</span></Link>
        <h1>Anza bure</h1>
        <p>Fungua akaunti yako ya ukuaji wa Instagram.</p>
        {!isDatabaseConfigured && <div className="setup-note">Database bado haijaunganishwa. Weka <code>DATABASE_URL</code> kwenye <code>.env.local</code>.</div>}
        {error && <div className="auth-error">{error}</div>}
        <form onSubmit={submit}>
          <div className="field"><label htmlFor="name">Jina kamili</label><input id="name" value={fullName} onChange={(e) => setFullName(e.target.value)} placeholder="Jina lako" required /></div>
          <div className="field"><label htmlFor="email">Barua pepe</label><input id="email" type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="wewe@mfano.com" required /></div>
          <div className="field"><label htmlFor="password">Nenosiri</label><input id="password" type="password" value={password} onChange={(e) => setPassword(e.target.value)} minLength={6} placeholder="Angalau herufi 6" required /></div>
          <button className="btn btn-primary" type="submit" disabled={loading}>{loading ? "Inaunda..." : "Fungua akaunti"}</button>
        </form>
        <p className="auth-switch">Una akaunti? <Link href="/login">Ingia</Link></p>
      </div>
    </main>
  );
}
