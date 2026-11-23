"use client";

import { useEffect, useState } from "react";
import { Loader2 } from "lucide-react";

export default function SettingsPage() {
  const [fullName, setFullName] = useState("");
  const [username, setUsername] = useState("");
  const [language, setLanguage] = useState("sw");
  const [subject, setSubject] = useState("");
  const [message, setMessage] = useState("");
  const [notice, setNotice] = useState("");
  const [loading, setLoading] = useState(true);
  const [savingProfile, setSavingProfile] = useState(false);
  const [sendingTicket, setSendingTicket] = useState(false);

  useEffect(() => {
    async function load() {
      try {
        const response = await fetch("/api/profile");
        const { user } = await response.json();
        if (!user) return;
        setFullName(user.full_name || "");
        setUsername(user.instagram_username || "");
        setLanguage(user.language || "sw");
      } finally {
        setLoading(false);
      }
    }
    load();
  }, []);

  async function saveProfile(event) {
    event.preventDefault();
    setNotice("");
    setSavingProfile(true);
    try {
      const response = await fetch("/api/profile", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ fullName, instagramUsername: username, language }),
      });
      const data = await response.json();
      setNotice(response.ok ? "Wasifu umesahihishwa." : data.error);
    } catch {
      setNotice("Hitilafu ya mtandao. Tafadhali jaribu tena.");
    } finally {
      setSavingProfile(false);
    }
  }

  async function sendTicket(event) {
    event.preventDefault();
    setNotice("");
    setSendingTicket(true);
    try {
      const response = await fetch("/api/support", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ subject, message }),
      });
      const data = await response.json();
      setNotice(response.ok ? "Tumepokea ujumbe wako. Timu yetu itakujibu hivi karibuni." : data.error);
      if (response.ok) { setSubject(""); setMessage(""); }
    } catch {
      setNotice("Hitilafu ya mtandao. Tafadhali jaribu tena.");
    } finally {
      setSendingTicket(false);
    }
  }

  return (
    <>
      <div className="content-head"><h1>Mipangilio</h1><p>Sasisha wasifu wako na uwasiliane na timu yetu.</p></div>
      {notice && <div className="auth-success">{notice}</div>}
      <form onSubmit={saveProfile}>
        <div className="panel">
          <h3>Wasifu</h3>
          {loading ? (
            <div className="skeleton-stack">
              <div className="skeleton skeleton-line" />
              <div className="skeleton skeleton-line" />
              <div className="skeleton skeleton-line short" />
            </div>
          ) : (
            <>
              <div className="field"><label>Jina kamili</label><input value={fullName} onChange={(e) => setFullName(e.target.value)} required disabled={savingProfile} /></div>
              <div className="field"><label>Jina la mtumiaji</label><input value={username} onChange={(e) => setUsername(e.target.value)} disabled={savingProfile} /></div>
              <div className="field"><label>Lugha</label><select value={language} onChange={(e) => setLanguage(e.target.value)} disabled={savingProfile}><option value="sw">Kiswahili</option><option value="en">English</option></select></div>
            </>
          )}
          <button className="btn btn-primary" type="submit" disabled={loading || savingProfile}>
            {savingProfile ? <><Loader2 size={17} className="spin" /> Inahifadhi...</> : "Hifadhi wasifu"}
          </button>
        </div>
      </form>
      <form onSubmit={sendTicket}>
        <div className="panel">
          <h3>Wasiliana na msaada</h3>
          <div className="field"><label>Mada</label><input value={subject} onChange={(e) => setSubject(e.target.value)} required disabled={sendingTicket} /></div>
          <div className="field"><label>Ujumbe</label><textarea value={message} onChange={(e) => setMessage(e.target.value)} required disabled={sendingTicket} /></div>
          <button className="btn btn-outline" type="submit" disabled={sendingTicket}>
            {sendingTicket ? <><Loader2 size={17} className="spin" /> Inatuma...</> : "Tuma ujumbe"}
          </button>
        </div>
      </form>
    </>
  );
}
