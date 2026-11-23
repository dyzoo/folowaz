"use client";

import { useEffect, useState } from "react";
import { Download, Loader2 } from "lucide-react";

export default function AnalyticsPage() {
  const [rows, setRows] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function load() {
      try {
        const response = await fetch("/api/analytics");
        const data = await response.json();
        setRows(data.snapshots || []);
      } finally {
        setLoading(false);
      }
    }
    load();
  }, []);

  const max = Math.max(...rows.map((row) => row.followers), 1);
  const totalReach = rows.reduce((sum, row) => sum + (row.reach || 0), 0);
  const totalLikes = rows.reduce((sum, row) => sum + (row.likes || 0), 0);

  function exportCsv() {
    const header = "Date,Followers,Following,Likes,Views,Reach,Profile views";
    const body = rows.map((row) => [row.recorded_on, row.followers, row.following, row.likes, row.comments, row.reach, row.profile_views].join(","));
    const blob = new Blob([[header, ...body].join("\n")], { type: "text/csv;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = "folowaz-analytics.csv";
    link.click();
    URL.revokeObjectURL(url);
  }

  return (
    <>
      <div className="panel-head content-head">
        <div><h1>Analytics</h1><p>Track your growth and download your data report.</p></div>
        <button className="btn btn-outline btn-sm" onClick={exportCsv} disabled={loading || !rows.length}><Download size={15} /> Download CSV</button>
      </div>
      <div className="grid-4">
        {loading ? (
          <>
            {[0, 1, 2, 3].map((index) => <div key={index} className="metric skeleton skeleton-metric" />)}
          </>
        ) : (
          <>
            <div className="metric"><span>Total reach</span><strong>{totalReach.toLocaleString()}</strong></div>
            <div className="metric"><span>Total likes</span><strong>{totalLikes.toLocaleString()}</strong></div>
            <div className="metric"><span>Followers (current)</span><strong>{rows.at(-1)?.followers?.toLocaleString() || "0"}</strong></div>
            <div className="metric"><span>Days tracked</span><strong>{rows.length}</strong></div>
          </>
        )}
      </div>
      <div className="panel">
        <div className="panel-head"><h3>Follower trend</h3><span className="tag green">Up to 30 days</span></div>
        {loading ? (
          <div className="skeleton skeleton-chart" />
        ) : rows.length ? (
          <>
            <div className="chart">{rows.map((row) => <div key={row.recorded_on} className="chart-bar" data-value={row.followers.toLocaleString()} style={{ height: `${Math.max(6, (row.followers / max) * 100)}%` }}></div>)}</div>
            <div className="chart-labels">{rows.map((row) => <span key={row.recorded_on}>{row.recorded_on.slice(5)}</span>)}</div>
          </>
        ) : <div className="empty-state">No data yet. Connect your Instagram account to get started.</div>}
      </div>
      <div className="panel">
        <h3>Detailed report</h3>
        <table className="table">
          <thead><tr><th>Date</th><th>Followers</th><th>Following</th><th>Likes</th><th>Views</th><th>Reach</th><th>Profile views</th></tr></thead>
          <tbody>
            {loading ? (
              [0, 1, 2, 3].map((index) => <tr key={index}><td colSpan={7}><div className="skeleton skeleton-row" /></td></tr>)
            ) : (
              <>
                {[...rows].reverse().map((row) => <tr key={row.recorded_on}><td>{row.recorded_on}</td><td>{row.followers.toLocaleString()}</td><td>{row.following.toLocaleString()}</td><td>{row.likes.toLocaleString()}</td><td>{row.comments.toLocaleString()}</td><td>{row.reach.toLocaleString()}</td><td>{row.profile_views.toLocaleString()}</td></tr>)}
                {!rows.length && <tr><td colSpan={7} className="empty-state">No data yet.</td></tr>}
              </>
            )}
          </tbody>
        </table>
      </div>
      {loading && <span className="hint"><Loader2 size={13} className="spin" /> Loading analytics...</span>}
    </>
  );
}
