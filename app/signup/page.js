"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Loader2 } from "lucide-react";
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

    try {
      const response = await fetch("/api/auth/signup", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ fullName, email, password, instagramUsername: ig || "" }),
      });
      const data = await response.json();

      if (!response.ok) {
        setError(data.error || "Account creation failed.");
        setLoading(false);
        return;
      }

      router.push("/dashboard");
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
        <h1>Start for free</h1>
        <p>Create your Instagram growth account.</p>
        {!isDatabaseConfigured && <div className="setup-note">Database is not connected yet. Set <code>DATABASE_URL</code> in <code>.env.local</code>.</div>}
        {error && <div className="auth-error">{error}</div>}
        <form onSubmit={submit}>
          <div className="field"><label htmlFor="name">Full name</label><input id="name" value={fullName} onChange={(e) => setFullName(e.target.value)} placeholder="Your name" required /></div>
          <div className="field"><label htmlFor="email">Email</label><input id="email" type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="you@example.com" required /></div>
          <div className="field"><label htmlFor="password">Password</label><input id="password" type="password" value={password} onChange={(e) => setPassword(e.target.value)} minLength={6} placeholder="At least 6 characters" required /></div>
          <button className="btn btn-primary" type="submit" disabled={loading}>{loading ? <><Loader2 size={17} className="spin" /> Creating...</> : "Create account"}</button>
        </form>
        <p className="auth-switch">Already have an account? <Link href="/login">Sign in</Link></p>
      </div>
    </main>
  );
}
