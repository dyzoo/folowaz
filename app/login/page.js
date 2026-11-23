"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Loader2 } from "lucide-react";
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

    try {
      const response = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });
      const data = await response.json();

      if (!response.ok) {
        setError(data.error || "Sign in failed.");
        setLoading(false);
        return;
      }

      router.push(nextPath);
      router.refresh();
    } catch {
      setError("Network error. Please try again.");
      setLoading(false);
    }
  }

  return (
    <main className="auth-page">
      <div className="auth-card">
        <Link href="/" className="brand"><span className="brand-mark">f</span><span className="brand-name">Folowaz</span></Link>
        <h1>Welcome back</h1>
        <p>Sign in to your growth dashboard.</p>
        {!isDatabaseConfigured && <div className="setup-note">Database is not connected yet. Set <code>DATABASE_URL</code> in <code>.env.local</code>.</div>}
        {error && <div className="auth-error">{error}</div>}
        <form onSubmit={submit}>
          <div className="field"><label htmlFor="email">Email</label><input id="email" type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="you@example.com" required /></div>
          <div className="field"><label htmlFor="password">Password</label><input id="password" type="password" value={password} onChange={(e) => setPassword(e.target.value)} placeholder="••••••••" required /></div>
          <button className="btn btn-primary" type="submit" disabled={loading}>{loading ? <><Loader2 size={17} className="spin" /> Signing in...</> : "Sign in"}</button>
        </form>
        <p className="auth-switch">No account? <Link href="/signup">Sign up free</Link></p>
      </div>
    </main>
  );
}
