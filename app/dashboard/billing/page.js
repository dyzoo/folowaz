"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { CreditCard, Loader2, Smartphone } from "lucide-react";

const planCards = [
  { key: "basic", name: "Basic", price: 19000, limit: "wafuasi 1,000 / mwezi" },
  { key: "pro", name: "Pro", price: 39000, limit: "wafuasi 4,000+ / mwezi" },
  { key: "turbo", name: "Turbo", price: 79000, limit: "wafuasi 10,000+ / mwezi" },
];

const finalStatuses = ["failed", "cancelled", "expired"];

function formatAmount(amount) {
  return `TZS ${Number(amount || 0).toLocaleString("en-TZ")}`;
}

export default function BillingPage() {
  const [subscription, setSubscription] = useState(null);
  const [orders, setOrders] = useState([]);
  const [user, setUser] = useState(null);
  const [selectedPlan, setSelectedPlan] = useState(null);
  const [method, setMethod] = useState("mobile");
  const [phone, setPhone] = useState("");
  const [loading, setLoading] = useState(false);
  const [checkingReference, setCheckingReference] = useState("");
  const [notice, setNotice] = useState("");
  const [error, setError] = useState("");
  const pollTimer = useRef(null);

  const stopPolling = useCallback(() => {
    if (pollTimer.current) clearInterval(pollTimer.current);
    pollTimer.current = null;
  }, []);

  const loadBilling = useCallback(async () => {
    try {
      const response = await fetch("/api/billing");
      if (!response.ok) return;
      const data = await response.json();
      setUser(data.user || null);
      setSubscription(data.subscription || null);
      setOrders(data.orders || []);
    } catch {
      setOrders([]);
    }
  }, []);

  const checkReference = useCallback(async (reference) => {
    setError("");
    setCheckingReference(reference);
    try {
      const response = await fetch("/api/payments/status", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ reference }),
      });
      const data = await response.json();
      if (!response.ok) throw new Error(data.error || "Hali ya malipo haikuweza kusomwa.");

      if (data.orderStatus === "paid") {
        stopPolling();
        setNotice(`Malipo yamekamilika. Mpango wako ${data.reference || reference} umewashwa.`);
        await loadBilling();
      } else if (finalStatuses.includes(data.orderStatus)) {
        stopPolling();
        setError(`Malipo yalikuwa ${data.orderStatus}. Tafadhali jaribu tena.`);
        await loadBilling();
      } else {
        setNotice(`Malipo bado yanachakatwa. Reference: ${data.reference || reference}`);
      }
      return data;
    } catch (paymentError) {
      setError(paymentError.message);
      return null;
    } finally {
      setCheckingReference("");
    }
  }, [loadBilling, stopPolling]);

  function startPolling(reference) {
    stopPolling();
    let attempts = 0;
    pollTimer.current = setInterval(async () => {
      attempts += 1;
      const data = await checkReference(reference);
      if (!data || data.orderStatus === "paid" || finalStatuses.includes(data.orderStatus) || attempts >= 20) {
        stopPolling();
      }
    }, 4000);
  }

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const status = params.get("status");
    const reference = params.get("reference");

    if (status === "cancelled") queueMicrotask(() => setNotice("Malipo yalighairiwa."));
    if (status === "not_configured") queueMicrotask(() => setError("Malipo hayajasanidiwa kwenye server."));
    if (status === "invalid") queueMicrotask(() => setError("Mpango uliochaguliwa si sahihi."));
    if (reference) queueMicrotask(() => checkReference(reference));
    queueMicrotask(() => loadBilling());

    return stopPolling;
  }, [checkReference, loadBilling, stopPolling]);

  async function pay() {
    if (!selectedPlan || phone.trim().length < 9) return;
    setLoading(true);
    setNotice("");
    setError("");

    try {
      const response = await fetch("/api/payments/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ plan: selectedPlan.key, method, phone }),
      });
      const data = await response.json();
      if (!response.ok) throw new Error(data.error || "Ombi la malipo halikufanikiwa.");

      if (method === "card" && data.checkoutUrl) {
        window.location.assign(data.checkoutUrl);
        return;
      }

      setNotice(`Ombi la malipo limetumwa. Reference: ${data.reference}. Angalia simu yako ili kuthibitisha.`);
      startPolling(data.reference);
      await loadBilling();
    } catch (paymentError) {
      setError(paymentError.message);
    } finally {
      setLoading(false);
    }
  }

  return (
    <>
      <div className="content-head">
        <h1>Malipo na mpango</h1>
        <p>Chagua mpango, kisha ulipe kwa mobile money au kadi kupitia NORIPESA.</p>
      </div>
      {notice && <div className="auth-success">{notice}</div>}
      {error && <div className="auth-error">{error}</div>}
      <div className="panel">
        <div className="panel-head"><h3>Mpango wa sasa</h3><span className={`tag ${subscription?.status === "active" ? "green" : "gray"}`}>{subscription?.status || "Hakuna mpango"}</span></div>
        <p style={{ fontSize: ".9rem" }}>{subscription ? <>{subscription.plan.toUpperCase()} · {subscription.current_period_end ? `hadhi hadi ${new Date(subscription.current_period_end).toLocaleDateString("sw")}` : ""}</> : "Huna mpango unaofanya kazi. Chagua moja hapa chini."}</p>
      </div>
      <div className="grid-4">
        {planCards.map((plan) => (
          <div className={`metric ${selectedPlan?.key === plan.key ? "metric-selected" : ""}`} key={plan.key}>
            <span>{plan.name}</span><strong>{formatAmount(plan.price)}</strong><small>{plan.limit}</small>
            <div className="action-row">
              <button type="button" className="btn btn-primary btn-sm" onClick={() => setSelectedPlan(plan)}>
                {selectedPlan?.key === plan.key ? "Imechaguliwa" : "Chagua"}
              </button>
            </div>
          </div>
        ))}
      </div>

      {selectedPlan && (
        <div className="panel">
          <h3>Lipa kwa {selectedPlan.name} · {formatAmount(selectedPlan.price)}</h3>
          <div className="payment-methods">
            <button type="button" className={`payment-method ${method === "mobile" ? "selected" : ""}`} onClick={() => setMethod("mobile")}>
              <Smartphone size={22} />
              <span><strong>Mobile money</strong><small>M-Pesa, Mixx by Yas, Airtel Money</small></span>
            </button>
            <button type="button" className={`payment-method ${method === "card" ? "selected" : ""}`} onClick={() => setMethod("card")}>
              <CreditCard size={22} />
              <span><strong>Kadi</strong><small>Visa au Mastercard kupitia checkout salama</small></span>
            </button>
          </div>
          <div className="field">
            <label htmlFor="payment-phone">Namba ya simu</label>
            <input
              id="payment-phone"
              type="tel"
              value={phone}
              onChange={(event) => setPhone(event.target.value)}
              placeholder="07XX XXX XXX"
              autoComplete="tel"
            />
            <span className="hint">Jina: {user?.full_name || user?.email || "Mtumiaji"} · Barua pepe: {user?.email || "—"}</span>
          </div>
          <button type="button" className="btn btn-primary" onClick={pay} disabled={loading || phone.trim().length < 9}>
            {loading ? <><Loader2 size={18} className="spin" /> Inatuma ombi...</> : method === "card" ? "Endelea kwa kadi" : "Tuma ombi la malipo"}
          </button>
          {checkingReference && <span className="hint">Inakagua hali ya malipo...</span>}
        </div>
      )}

      <div className="panel">
        <h3>Historia ya maagizo</h3>
        <table className="table">
          <thead><tr><th>Tarehe</th><th>Mpango</th><th>Njia</th><th>Kiasi</th><th>Hali</th></tr></thead>
          <tbody>
            {orders.map((order) => (
              <tr key={order.id}>
                <td>{new Date(order.created_at).toLocaleDateString("sw")}</td>
                <td>{order.plan}</td>
                <td>{order.payment_method === "card" ? "Kadi" : "Mobile money"}</td>
                <td>{formatAmount(order.amount)}</td>
                <td><span className={`tag ${order.status === "paid" ? "green" : finalStatuses.includes(order.status) ? "red" : "gray"}`}>{order.status}</span></td>
              </tr>
            ))}
            {!orders.length && <tr><td colSpan={5} className="empty-state">Hakuna maagizo bado.</td></tr>}
          </tbody>
        </table>
      </div>
    </>
  );
}
