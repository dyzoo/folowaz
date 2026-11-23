"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { AtSign, TrendingUp } from "lucide-react";
import { isDatabaseConfigured } from "@/lib/env";
import { demoConnection, demoSettings, demoSnapshots } from "@/lib/demo-data";

export default function OverviewPage() {
  const [snapshots, setSnapshots] = useState([]);
  const [connection, setConnection] = useState(null);
  const [settings, setSettings] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function load() {
      if (!isDatabaseConfigured) {
        setSnapshots(demoSnapshots);
        setConnection(demoConnection);
        setSettings(demoSettings);
        setLoading(false);
        return;
      }
      const [snapRes, profileRes, settingRes] = await Promise.all([
        fetch("/api/analytics"), fetch("/api/profile"), fetch("/api/growth-settings"),
      ]);
      const [snapData, profileData, settingData] = await Promise.all([
        snapRes.json(), profileRes.json(), settingRes.json(),
      ]);
      setSnapshots(snapData.snapshots || []);
      setConnection(profileData.user?.instagram_username ? { username: profileData.user.instagram_username } : null);
      setSettings(settingData.settings || null);
      setLoading(false);
    }
    load();
  }, []);

  const latest = snapshots[snapshots.length - 1];
  const previous = snapshots[snapshots.length - 2];
  const growth = latest && previous ? latest.followers - previous.followers : 0;
  const maxFollowers = Math.max(...snapshots.map((s) => s.followers), 1);

  return (
    <>
      <div className="content-head">
        <h1>Muhtasari</h1>
        <p>Karibu! Hapa ndivyo akaunti yako inavyofanya leo.</p>
      </div>

      {!connection && !loading && (
        <div className="panel">
          <div className="connect-card">
            <div className="connect-icon"><AtSign size={20} /></div>
            <div><h3 style={{ marginBottom: 4 }}>Weka jina la akaunti yako ya Instagram</h3><p style={{ margin: 0, fontSize: ".86rem" }}>Ingiza jina la mtumiaji ili lionekane kwenye dashibodi yako.</p></div>
            <Link href="/dashboard/connect" className="btn btn-primary">Weka sasa</Link>
          </div>
        </div>
      )}

      <div className="grid-4">
        <div className="metric"><span>Wafuasi</span><strong>{latest?.followers?.toLocaleString() || "0"}</strong><small><TrendingUp size={13} /> {growth.toLocaleString()} leo</small></div>
        <div className="metric"><span>Kufikia (reach)</span><strong>{latest?.reach?.toLocaleString() || "0"}</strong><small>vipindi 7 vilivyopita</small></div>
        <div className="metric"><span>Kupendwa</span><strong>{latest?.likes?.toLocaleString() || "0"}</strong><small><TrendingUp size={13} /> {growth > 0 ? Math.round(growth / 4) : 0} leo</small></div>
        <div className="metric"><span>Maoni ya wasifu</span><strong>{latest?.profile_views?.toLocaleString() || "0"}</strong><small><TrendingUp size={13} /> {growth > 0 ? Math.round(growth / 10) : 0} leo</small></div>
      </div>

      <div className="grid-2">
        <div className="panel">
          <div className="panel-head"><h3>Ukuaji wa wafuasi</h3><span className="tag green">Siku 7 zilizopita</span></div>
          {snapshots.length ? (
            <>
              <div className="chart">
                {snapshots.map((item) => (
                  <div key={item.recorded_on} className="chart-bar" data-value={item.followers.toLocaleString()} style={{ height: `${Math.max(6, (item.followers / maxFollowers) * 100)}%` }}></div>
                ))}
              </div>
              <div className="chart-labels">{snapshots.map((item) => <span key={item.recorded_on}>{item.recorded_on.slice(5)}</span>)}</div>
            </>
          ) : <div className="empty-state">{loading ? "Inapakia..." : "Hakuna takwimu bado. Unganisha Instagram ili kuanza kufuatilia."}</div>}
        </div>

        <div className="panel">
          <div className="panel-head"><h3>Hali ya ukuaji</h3><span className={`tag ${settings?.status === "active" ? "green" : "gray"}`}>{settings?.status === "active" ? "Inafanya kazi" : "Imesitishwa"}</span></div>
          <p style={{ fontSize: ".88rem" }}><strong>Niche:</strong> {settings?.niche || "Bado haijawekwa"}</p>
          <p style={{ fontSize: ".88rem" }}><strong>Kikomo cha kila siku:</strong> {settings?.daily_limit || 0}</p>
          <p style={{ fontSize: ".88rem" }}><strong>Jina la akaunti:</strong> @{connection?.username || "bado"}</p>
          <div className="action-row"><Link href="/dashboard/targeting" className="btn btn-outline btn-sm">Hariri ulengaji</Link><Link href="/dashboard/analytics" className="btn btn-primary btn-sm">Angalia uchanganuzi</Link></div>
          <p className="hint">Shughuli za ukuaji zinaonyeshwa kwa madhumuni ya mfano. Hakuna wiki au boti zinazotumika.</p>
        </div>
      </div>

      <div className="panel">
        <div className="panel-head"><h3>Takwimu za hivi karibuni</h3><Link href="/dashboard/analytics" className="tag">Tazama zote</Link></div>
        <table className="table">
          <thead><tr><th>Tarehe</th><th>Wafuasi</th><th>Unafuata</th><th>Kupendwa</th><th>Maoni</th></tr></thead>
          <tbody>
            {[...snapshots].reverse().slice(0, 5).map((item) => (
              <tr key={item.recorded_on}><td>{item.recorded_on}</td><td>{item.followers.toLocaleString()}</td><td>{item.following.toLocaleString()}</td><td>{item.likes.toLocaleString()}</td><td>{item.profile_views.toLocaleString()}</td></tr>
            ))}
            {!snapshots.length && <tr><td colSpan={5} className="empty-state">Hakuna data bado.</td></tr>}
          </tbody>
        </table>
      </div>
    </>
  );
}
