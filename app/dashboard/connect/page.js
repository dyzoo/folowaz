"use client";

import { useEffect, useState } from "react";
import { ArrowUpRight, AtSign, Loader2 } from "lucide-react";

export default function ConnectPage() {
  const [username, setUsername] = useState("");
  const [savedName, setSavedName] = useState(null);
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    async function load() {
      try {
        const response = await fetch("/api/profile");
        const data = await response.json();
        setSavedName(data.user?.instagram_username || null);
      } finally {
        setLoading(false);
      }
    }
    load();
  }, []);

  async function save(event) {
    event.preventDefault();
    const clean = username.trim().replace(/^@/, "");
    if (!clean) return;
    setSaving(true);
    setMessage("");

    try {
      const response = await fetch("/api/profile", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ instagramUsername: clean }),
      });
      const data = await response.json();
      setMessage(response.ok ? "Jina la akaunti limehifadhiwa." : data.error);
      if (response.ok) { setSavedName(clean); setUsername(""); }
    } catch {
      setMessage("Hitilafu ya mtandao. Tafadhali jaribu tena.");
    } finally {
      setSaving(false);
    }
  }

  return (
    <>
      <div className="content-head"><h1>Akaunti ya Instagram</h1><p>Weka jina la akaunti yako ili lionekane kwenye dashibodi yako.</p></div>
      {message && <div className="auth-success">{message}</div>}

      <div className="panel">
        {loading ? (
          <div className="skeleton-stack">
            <div className="skeleton skeleton-line tall" />
            <div className="skeleton skeleton-line short" />
          </div>
        ) : savedName ? (
          <div className="connect-card">
            <div className="connect-icon"><AtSign size={20} /></div>
            <div>
              <h3 style={{ marginBottom: 4 }}>@{savedName}</h3>
              <p style={{ margin: 0, fontSize: ".86rem" }}>Jina hili linaonyeshwa kwenye muhtasari wako na uchanganuzi.</p>
            </div>
            <a className="btn btn-outline" href={`https://www.instagram.com/${savedName}/`} target="_blank" rel="noreferrer">Fungua wasifu <ArrowUpRight size={15} /></a>
          </div>
        ) : (
          <div className="connect-card">
            <div className="connect-icon"><AtSign size={20} /></div>
            <div><h3 style={{ marginBottom: 4 }}>Hakuna akaunti iliyowekwa</h3><p style={{ margin: 0, fontSize: ".86rem" }}>Ingiza jina la mtumiaji la Instagram ili kuanza.</p></div>
          </div>
        )}
      </div>

      <form onSubmit={save}>
        <div className="panel">
          <h3>Weka jina la akaunti</h3>
          <div className="field">
            <label htmlFor="ig-username">Jina la mtumiaji la Instagram</label>
            <input id="ig-username" value={username} onChange={(e) => setUsername(e.target.value)} placeholder="jina-lako-la-instagram" required disabled={saving} />
          </div>
          <button className="btn btn-primary" type="submit" disabled={saving || loading}>
            {saving ? <><Loader2 size={17} className="spin" /> Inahifadhi...</> : "Hifadhi jina"}
          </button>
          <p className="hint">Hatuhitaji nenosiri lako wala ruhusa ya Meta. Tunatumia jina unaloingiza tu.</p>
        </div>
      </form>
    </>
  );
}
