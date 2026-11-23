"use client";

import { useEffect, useState } from "react";
import { ArrowUpRight, AtSign } from "lucide-react";
import { isDatabaseConfigured } from "@/lib/env";
import { demoConnection } from "@/lib/demo-data";

export default function ConnectPage() {
  const [username, setUsername] = useState("");
  const [savedName, setSavedName] = useState(isDatabaseConfigured ? null : demoConnection.username);
  const [message, setMessage] = useState("");
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (!isDatabaseConfigured) return;
    async function load() {
      const response = await fetch("/api/profile");
      const data = await response.json();
      setSavedName(data.user?.instagram_username || null);
    }
    load();
  }, []);

  async function save(event) {
    event.preventDefault();
    const clean = username.trim().replace(/^@/, "");
    if (!clean) return;
    setSaving(true);
    setMessage("");

    if (!isDatabaseConfigured) {
      setSavedName(clean);
      setUsername("");
      setMessage("Jina la akaunti limehifadhiwa (hali ya demo).");
      setSaving(false);
      return;
    }

    const response = await fetch("/api/profile", {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ instagramUsername: clean }),
    });
    const data = await response.json();
    setMessage(response.ok ? "Jina la akaunti limehifadhiwa." : data.error);
    if (response.ok) { setSavedName(clean); setUsername(""); }
    setSaving(false);
  }

  return (
    <>
      <div className="content-head"><h1>Akaunti ya Instagram</h1><p>Weka jina la akaunti yako ili lionekane kwenye dashibodi yako.</p></div>
      {message && <div className="auth-success">{message}</div>}

      <div className="panel">
        {savedName ? (
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
            <input id="ig-username" value={username} onChange={(e) => setUsername(e.target.value)} placeholder="jina-lako-la-instagram" required />
          </div>
          <button className="btn btn-primary" type="submit" disabled={saving}>{saving ? "Inahifadhi..." : "Hifadhi jina"}</button>
          <p className="hint">Hatuhitaji nenosiri lako wala ruhusa ya Meta. Tunatumia jina unaloingiza tu.</p>
        </div>
      </form>
    </>
  );
}
