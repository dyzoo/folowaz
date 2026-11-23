"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { AtSign, TrendingUp } from "lucide-react";

export default function OverviewPage() {
  const [snapshots, setSnapshots] = useState([]);
  const [connection, setConnection] = useState(null);
  const [settings, setSettings] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function load() {
      try {
        const [snapRes, profileRes, settingRes] = await Promise.all([
          fetch("/api/analytics"), fetch("/api/profile"), fetch("/api/growth-settings"),
        ]);
        const [snapData, profileData, settingData] = await Promise.all([
          snapRes.json(), profileRes.json(), settingRes.json(),
        ]);
        setSnapshots(snapData.snapshots || []);
        setConnection(profileData.user?.instagram_username ? { username: profileData.user.instagram_username } : null);
        setSettings(settingData.settings || null);
      } finally {
        setLoading(false);
      }
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
        <h1>Overview</h1>
        <p>Welcome! Here is how your account is doing today.</p>
      </div>

      {!connection && !loading && (
        <div className="panel">
          <div className="connect-card">
            <div className="connect-icon"><AtSign size={20} /></div>
            <div><h3 style={{ marginBottom: 4 }}>Add your Instagram username</h3><p style={{ margin: 0, fontSize: ".86rem" }}>Enter your username to display it on your dashboard.</p></div>
            <Link href="/dashboard/connect" className="btn btn-primary">Set it now</Link>
          </div>
        </div>
      )}

      <div className="grid-4">
        {loading ? (
          <>
            {[0, 1, 2, 3].map((index) => <div key={index} className="metric skeleton skeleton-metric" />)}
          </>
        ) : (
          <>
            <div className="metric"><span>Followers</span><strong>{latest?.followers?.toLocaleString() || "0"}</strong><small><TrendingUp size={13} /> {growth.toLocaleString()} today</small></div>
            <div className="metric"><span>Reach</span><strong>{latest?.reach?.toLocaleString() || "0"}</strong><small>last 7 sessions</small></div>
            <div className="metric"><span>Likes</span><strong>{latest?.likes?.toLocaleString() || "0"}</strong><small><TrendingUp size={13} /> {growth > 0 ? Math.round(growth / 4) : 0} today</small></div>
            <div className="metric"><span>Profile views</span><strong>{latest?.profile_views?.toLocaleString() || "0"}</strong><small><TrendingUp size={13} /> {growth > 0 ? Math.round(growth / 10) : 0} today</small></div>
          </>
        )}
      </div>

      <div className="grid-2">
        <div className="panel">
          <div className="panel-head"><h3>Follower growth</h3><span className="tag green">Last 7 days</span></div>
          {loading ? (
            <div className="skeleton skeleton-chart" />
          ) : snapshots.length ? (
            <>
              <div className="chart">
                {snapshots.map((item) => (
                  <div key={item.recorded_on} className="chart-bar" data-value={item.followers.toLocaleString()} style={{ height: `${Math.max(6, (item.followers / maxFollowers) * 100)}%` }}></div>
                ))}
              </div>
              <div className="chart-labels">{snapshots.map((item) => <span key={item.recorded_on}>{item.recorded_on.slice(5)}</span>)}</div>
            </>
          ) : <div className="empty-state">No stats yet. Connect Instagram to start tracking.</div>}
        </div>

        <div className="panel">
          <div className="panel-head"><h3>Growth status</h3><span className={`tag ${settings?.status === "active" ? "green" : "gray"}`}>{settings?.status === "active" ? "Active" : "Paused"}</span></div>
          {loading ? (
            <div className="skeleton-stack">
              <div className="skeleton skeleton-line" />
              <div className="skeleton skeleton-line short" />
              <div className="skeleton skeleton-line" />
            </div>
          ) : (
            <>
              <p style={{ fontSize: ".88rem" }}><strong>Niche:</strong> {settings?.niche || "Not set yet"}</p>
              <p style={{ fontSize: ".88rem" }}><strong>Daily limit:</strong> {settings?.daily_limit || 0}</p>
              <p style={{ fontSize: ".88rem" }}><strong>Username:</strong> @{connection?.username || "not set"}</p>
            </>
          )}
          <div className="action-row"><Link href="/dashboard/targeting" className="btn btn-outline btn-sm">Edit targeting</Link><Link href="/dashboard/analytics" className="btn btn-primary btn-sm">View analytics</Link></div>
          <p className="hint">Update your targeting settings to control how your account grows.</p>
        </div>
      </div>

      <div className="panel">
        <div className="panel-head"><h3>Recent activity</h3><Link href="/dashboard/analytics" className="tag">View all</Link></div>
        <table className="table">
          <thead><tr><th>Date</th><th>Followers</th><th>Following</th><th>Likes</th><th>Views</th></tr></thead>
          <tbody>
            {loading ? (
              [0, 1, 2].map((index) => <tr key={index}><td colSpan={5}><div className="skeleton skeleton-row" /></td></tr>)
            ) : (
              <>
                {[...snapshots].reverse().slice(0, 5).map((item) => (
                  <tr key={item.recorded_on}><td>{item.recorded_on}</td><td>{item.followers.toLocaleString()}</td><td>{item.following.toLocaleString()}</td><td>{item.likes.toLocaleString()}</td><td>{item.profile_views.toLocaleString()}</td></tr>
                ))}
                {!snapshots.length && <tr><td colSpan={5} className="empty-state">No data yet.</td></tr>}
              </>
            )}
          </tbody>
        </table>
      </div>
    </>
  );
}
