"use client";

import { useEffect, useState } from "react";
import { Download } from "lucide-react";
import { isDatabaseConfigured } from "@/lib/env";
import { demoSnapshots } from "@/lib/demo-data";

export default function AnalyticsPage() {
  const [rows, setRows] = useState([]);

  useEffect(() => {
    async function load() {
      if (!isDatabaseConfigured) { setRows(demoSnapshots); return; }
      const response = await fetch("/api/analytics");
      const data = await response.json();
      setRows(data.snapshots || []);
    }
    load();
  }, []);

  const max = Math.max(...rows.map((row) => row.followers), 1);
  const totalReach = rows.reduce((sum, row) => sum + (row.reach || 0), 0);
  const totalLikes = rows.reduce((sum, row) => sum + (row.likes || 0), 0);

  function exportCsv() {
    const header = "Tarehe,Wafuasi,Unafuata,Kupendwa,Maoni,Reach,Profile views";
    const body = rows.map((row) => [row.recorded_on, row.followers, row.following, row.likes, row.comments, row.reach, row.profile_views].join(","));
    const blob = new Blob([[header, ...body].join("\n")], { type: "text/csv;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = "folowaz-uchanganuzi.csv";
    link.click();
    URL.revokeObjectURL(url);
  }

  return (
    <>
      <div className="panel-head content-head">
        <div><h1>Uchanganuzi</h1><p>Fuatilia ukuaji wako na upakue ripoti ya data.</p></div>
        <button className="btn btn-outline btn-sm" onClick={exportCsv}><Download size={15} /> Pakua CSV</button>
      </div>
      <div className="grid-4">
        <div className="metric"><span>Jumla ya kufikia</span><strong>{totalReach.toLocaleString()}</strong></div>
        <div className="metric"><span>Jumla ya kupendwa</span><strong>{totalLikes.toLocaleString()}</strong></div>
        <div className="metric"><span>Wafuasi (sasa)</span><strong>{rows.at(-1)?.followers?.toLocaleString() || "0"}</strong></div>
        <div className="metric"><span>Siku zilizofuatiliwa</span><strong>{rows.length}</strong></div>
      </div>
      <div className="panel">
        <div className="panel-head"><h3>Mwenendo wa wafuasi</h3><span className="tag green">Hadi siku 30</span></div>
        {rows.length ? (
          <>
            <div className="chart">{rows.map((row) => <div key={row.recorded_on} className="chart-bar" data-value={row.followers.toLocaleString()} style={{ height: `${Math.max(6, (row.followers / max) * 100)}%` }}></div>)}</div>
            <div className="chart-labels">{rows.map((row) => <span key={row.recorded_on}>{row.recorded_on.slice(5)}</span>)}</div>
          </>
        ) : <div className="empty-state">Hakuna data bado. Unganisha akaunti yako ya Instagram ili kuanza.</div>}
      </div>
      <div className="panel">
        <h3>Ripoti ya kina</h3>
        <table className="table">
          <thead><tr><th>Tarehe</th><th>Wafuasi</th><th>Unafuata</th><th>Kupendwa</th><th>Maoni</th><th>Reach</th><th>Maoni ya wasifu</th></tr></thead>
          <tbody>
            {[...rows].reverse().map((row) => <tr key={row.recorded_on}><td>{row.recorded_on}</td><td>{row.followers.toLocaleString()}</td><td>{row.following.toLocaleString()}</td><td>{row.likes.toLocaleString()}</td><td>{row.comments.toLocaleString()}</td><td>{row.reach.toLocaleString()}</td><td>{row.profile_views.toLocaleString()}</td></tr>)}
            {!rows.length && <tr><td colSpan={7} className="empty-state">Hakuna data bado.</td></tr>}
          </tbody>
        </table>
      </div>
    </>
  );
}
