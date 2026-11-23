"use client";

import { useEffect, useState } from "react";
import { isDatabaseConfigured } from "@/lib/env";

const planCards = [
  { key: "basic", name: "Basic", price: "$19", limit: "wafuasi 1,000 / mwezi" },
  { key: "pro", name: "Pro", price: "$39", limit: "wafuasi 4,000+ / mwezi" },
  { key: "turbo", name: "Turbo", price: "$79", limit: "wafuasi 10,000+ / mwezi" },
];

export default function BillingPage() {
  const [subscription, setSubscription] = useState(null);
  const [orders, setOrders] = useState([]);
  const [notice, setNotice] = useState("");

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const statusMessage = params.get("status") === "success"
      ? "Malipo yamekamilika. Mpango wako unasasishwa."
      : params.get("status") === "cancelled" ? "Malipo yalighairiwa." : "";
    if (statusMessage) queueMicrotask(() => setNotice(statusMessage));

    async function load() {
      if (!isDatabaseConfigured) return;
      const response = await fetch("/api/billing");
      const data = await response.json();
      setSubscription(data.subscription || null);
      setOrders(data.orders || []);
    }
    load();
  }, []);

  return (
    <>
      <div className="content-head"><h1>Malipo na mpango</h1><p>Chagua mpango unaofaa. Malipo yanachakatwa na Stripe.</p></div>
      {notice && <div className="auth-success">{notice}</div>}
      <div className="panel">
        <div className="panel-head"><h3>Mpango wa sasa</h3><span className={`tag ${subscription?.status === "active" ? "green" : "gray"}`}>{subscription?.status || "Hakuna mpango"}</span></div>
        <p style={{ fontSize: ".9rem" }}>{subscription ? <>{subscription.plan.toUpperCase()} · {subscription.current_period_end ? `hadhi hadi ${new Date(subscription.current_period_end).toLocaleDateString("sw")}` : ""}</> : "Huna mpango unaofanya kazi. Chagua moja hapa chini."}</p>
      </div>
      <div className="grid-4">
        {planCards.map((plan) => (
          <div className="metric" key={plan.key}>
            <span>{plan.name}</span><strong>{plan.price}</strong><small>{plan.limit}</small>
            <div className="action-row"><a className="btn btn-primary btn-sm" href={`/api/stripe/checkout?plan=${plan.key}`}>Chagua</a></div>
          </div>
        ))}
      </div>
      <div className="panel">
        <h3>Historia ya maagizo</h3>
        <table className="table">
          <thead><tr><th>Tarehe</th><th>Mpango</th><th>Kiasi</th><th>Hali</th></tr></thead>
          <tbody>
            {orders.map((order) => <tr key={order.id}><td>{new Date(order.created_at).toLocaleDateString("sw")}</td><td>{order.plan}</td><td>${(order.amount / 100).toFixed(2)}</td><td><span className={`tag ${order.status === "paid" ? "green" : "gray"}`}>{order.status}</span></td></tr>)}
            {!orders.length && <tr><td colSpan={4} className="empty-state">Hakuna maagizo bado.</td></tr>}
          </tbody>
        </table>
      </div>
    </>
  );
}
