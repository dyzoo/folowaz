"use client";

import { useEffect, useState } from "react";
import { Loader2 } from "lucide-react";

export default function SettingsPage() {
  const [fullName, setFullName] = useState("");
  const [username, setUsername] = useState("");
  const [language, setLanguage] = useState("en");
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
        setLanguage(user.language || "en");
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
      setNotice(response.ok ? "Profile updated." : data.error);
    } catch {
      setNotice("Network error. Please try again.");
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
      setNotice(response.ok ? "We received your message. Our team will get back to you shortly." : data.error);
      if (response.ok) { setSubject(""); setMessage(""); }
    } catch {
      setNotice("Network error. Please try again.");
    } finally {
      setSendingTicket(false);
    }
  }

  return (
    <>
      <div className="content-head"><h1>Settings</h1><p>Update your profile and contact our support team.</p></div>
      {notice && <div className="auth-success">{notice}</div>}
      <form onSubmit={saveProfile}>
        <div className="panel">
          <h3>Profile</h3>
          {loading ? (
            <div className="skeleton-stack">
              <div className="skeleton skeleton-line" />
              <div className="skeleton skeleton-line" />
              <div className="skeleton skeleton-line short" />
            </div>
          ) : (
            <>
              <div className="field"><label>Full name</label><input value={fullName} onChange={(e) => setFullName(e.target.value)} required disabled={savingProfile} /></div>
              <div className="field"><label>Username</label><input value={username} onChange={(e) => setUsername(e.target.value)} disabled={savingProfile} /></div>
              <div className="field"><label>Language</label><select value={language} onChange={(e) => setLanguage(e.target.value)} disabled={savingProfile}><option value="en">English</option><option value="sw">Swahili</option></select></div>
            </>
          )}
          <button className="btn btn-primary" type="submit" disabled={loading || savingProfile}>
            {savingProfile ? <><Loader2 size={17} className="spin" /> Saving...</> : "Save profile"}
          </button>
        </div>
      </form>
      <form onSubmit={sendTicket}>
        <div className="panel">
          <h3>Contact support</h3>
          <div className="field"><label>Subject</label><input value={subject} onChange={(e) => setSubject(e.target.value)} required disabled={sendingTicket} /></div>
          <div className="field"><label>Message</label><textarea value={message} onChange={(e) => setMessage(e.target.value)} required disabled={sendingTicket} /></div>
          <button className="btn btn-outline" type="submit" disabled={sendingTicket}>
            {sendingTicket ? <><Loader2 size={17} className="spin" /> Sending...</> : "Send message"}
          </button>
        </div>
      </form>
    </>
  );
}
