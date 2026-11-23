"use client";

import { useEffect, useState } from "react";
import { isDatabaseConfigured } from "@/lib/env";

export default function SettingsPage() {
  const [fullName, setFullName] = useState("");
  const [username, setUsername] = useState("");
  const [language, setLanguage] = useState("sw");
  const [subject, setSubject] = useState("");
  const [message, setMessage] = useState("");
  const [notice, setNotice] = useState("");

  useEffect(() => {
    async function load() {
      if (!isDatabaseConfigured) { setFullName("Mtumiaji wa Demo"); setUsername("demo"); return; }
      const response = await fetch("/api/profile");
      const { user } = await response.json();
      if (!user) return;
      setFullName(user.full_name || "");
      setUsername(user.instagram_username || "");
      setLanguage(user.language || "sw");
    }
    load();
  }, []);

  async function saveProfile(event) {
    event.preventDefault();
    setNotice("");
    if (!isDatabaseConfigured) { setNotice("Wasifu umesahihishwa (demo)."); return; }
    const response = await fetch("/api/profile", {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ fullName, instagramUsername: username, language }),
    });
    const data = await response.json();
    setNotice(response.ok ? "Wasifu umesahihishwa." : data.error);
  }

  async function sendTicket(event) {
    event.preventDefault();
    setNotice("");
    if (!isDatabaseConfigured) { setNotice("Ujumbe wako umepokelewa (demo)."); setSubject(""); setMessage(""); return; }
    const response = await fetch("/api/support", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ subject, message }),
    });
    const data = await response.json();
    setNotice(response.ok ? "Tumepokea ujumbe wako. Timu yetu itakujibu hivi karibuni." : data.error);
    if (response.ok) { setSubject(""); setMessage(""); }
  }

  return (
    <>
      <div className="content-head"><h1>Mipangilio</h1><p>Sasisha wasifu wako na uwasiliane na timu yetu.</p></div>
      {notice && <div className="auth-success">{notice}</div>}
      <form onSubmit={saveProfile}>
        <div className="panel">
          <h3>Wasifu</h3>
          <div className="field"><label>Jina kamili</label><input value={fullName} onChange={(e) => setFullName(e.target.value)} required /></div>
          <div className="field"><label>Jina la mtumiaji</label><input value={username} onChange={(e) => setUsername(e.target.value)} /></div>
          <div className="field"><label>Lugha</label><select value={language} onChange={(e) => setLanguage(e.target.value)}><option value="sw">Kiswahili</option><option value="en">English</option></select></div>
          <button className="btn btn-primary" type="submit">Hifadhi wasifu</button>
        </div>
      </form>
      <form onSubmit={sendTicket}>
        <div className="panel">
          <h3>Wasiliana na msaada</h3>
          <div className="field"><label>Mada</label><input value={subject} onChange={(e) => setSubject(e.target.value)} required /></div>
          <div className="field"><label>Ujumbe</label><textarea value={message} onChange={(e) => setMessage(e.target.value)} required /></div>
          <button className="btn btn-outline" type="submit">Tuma ujumbe</button>
        </div>
      </form>
    </>
  );
}
