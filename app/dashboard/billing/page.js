"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { Loader2, Smartphone } from "lucide-react";

const planCards = [
  { key: "basic", name: "Basic", price: 19000, limit: "1,000 followers / month" },
  { key: "pro", name: "Pro", price: 39000, limit: "4,000+ followers / month" },
  { key: "turbo", name: "Turbo", price: 79000, limit: "10,000+ followers / month" },
];

const finalStatuses = ["failed", "cancelled", "expired", "refunded"];

function formatAmount(amount) {
  return `TZS ${Number(amount || 0).toLocaleString("en-TZ")}`;
}

export default function BillingPage() {
  const [subscription, setSubscription] = useState(null);
  const [orders, setOrders] = useState([]);
  const [user, setUser] = useState(null);
  const [selectedPlan, setSelectedPlan] = useState(null);
  const [phone, setPhone] = useState("");
  const [loading, setLoading] = useState(false);
  const [initialLoading, setInitialLoading] = useState(true);
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
    } finally {
      setInitialLoading(false);
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
      if (!response.ok) throw new Error(data.error || "Payment status could not be read.");

      if (data.orderStatus === "paid") {
        stopPolling();
        setNotice(`Payment confirmed. Plan ${data.reference || reference} is now active.`);
        await loadBilling();
      } else if (finalStatuses.includes(data.orderStatus)) {
        stopPolling();
        setError(`Payment was ${data.orderStatus}. Please try again.`);
        await loadBilling();
      } else {
        setNotice(`Payment is still processing. Reference: ${data.reference || reference}`);
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

    if (status === "cancelled") queueMicrotask(() => setNotice("Payment was cancelled."));
    if (status === "not_configured") queueMicrotask(() => setError("Payments are not configured on the server."));
    if (status === "invalid") queueMicrotask(() => setError("The selected plan is invalid."));
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
        body: JSON.stringify({ plan: selectedPlan.key, method: "mobile", phone }),
      });
      const data = await response.json();
      if (!response.ok) throw new Error(data.error || "The payment request failed.");

      setNotice(`Payment request sent. Reference: ${data.reference}. ${data.message || "Check your phone to confirm."}`);
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
        <h1>Billing & plan</h1>
        <p>Choose a plan, then pay securely with mobile money.</p>
      </div>
      {notice && <div className="auth-success">{notice}</div>}
      {error && <div className="auth-error">{error}</div>}
      <div className="panel">
        <div className="panel-head"><h3>Current plan</h3><span className={`tag ${subscription?.status === "active" ? "green" : "gray"}`}>{subscription?.status || "No plan"}</span></div>
        {initialLoading ? (
          <div className="skeleton-stack">
            <div className="skeleton skeleton-line tall" />
            <div className="skeleton skeleton-line short" />
          </div>
        ) : (
          <p style={{ fontSize: ".9rem" }}>{subscription ? <>{subscription.plan.toUpperCase()} · {subscription.current_period_end ? `valid until ${new Date(subscription.current_period_end).toLocaleDateString("en-TZ")}` : ""}</> : "You do not have an active plan. Choose one below."}</p>
        )}
      </div>
      <div className="grid-4">
        {planCards.map((plan) => (
          <div className={`metric ${selectedPlan?.key === plan.key ? "metric-selected" : ""}`} key={plan.key}>
            <span>{plan.name}</span><strong>{formatAmount(plan.price)}</strong><small>{plan.limit}</small>
            <div className="action-row">
              <button type="button" className="btn btn-primary btn-sm" onClick={() => setSelectedPlan(plan)}>
                {selectedPlan?.key === plan.key ? "Selected" : "Select"}
              </button>
            </div>
          </div>
        ))}
      </div>

      {selectedPlan && (
        <div className="panel">
          <h3>Pay for {selectedPlan.name} · {formatAmount(selectedPlan.price)}</h3>
          <div className="payment-methods">
            <div className="payment-method selected">
              <Smartphone size={22} />
              <span><strong>Mobile money</strong><small>M-Pesa, Mixx by Yas, Airtel Money, Halopesa</small></span>
            </div>
          </div>
          <div className="field">
            <label htmlFor="payment-phone">Phone number</label>
            <input
              id="payment-phone"
              type="tel"
              value={phone}
              onChange={(event) => setPhone(event.target.value)}
              placeholder="07XX XXX XXX"
              autoComplete="tel"
            />
            <span className="hint">Name: {user?.full_name || user?.email || "User"} · Email: {user?.email || "—"}</span>
          </div>
          <button type="button" className="btn btn-primary" onClick={pay} disabled={loading || phone.trim().length < 9}>
            {loading ? <><Loader2 size={18} className="spin" /> Sending request...</> : "Send payment request"}
          </button>
          {checkingReference && <span className="hint"><Loader2 size={13} className="spin" /> Checking payment status...</span>}
        </div>
      )}

      <div className="panel">
        <h3>Order history</h3>
        <table className="table">
          <thead><tr><th>Date</th><th>Plan</th><th>Method</th><th>Amount</th><th>Status</th></tr></thead>
          <tbody>
            {initialLoading ? (
              [0, 1, 2].map((index) => <tr key={index}><td colSpan={5}><div className="skeleton skeleton-row" /></td></tr>)
            ) : (
              <>
                {orders.map((order) => (
                  <tr key={order.id}>
                    <td>{new Date(order.created_at).toLocaleDateString("en-TZ")}</td>
                    <td>{order.plan}</td>
                    <td>Mobile money</td>
                    <td>{formatAmount(order.amount)}</td>
                    <td><span className={`tag ${order.status === "paid" ? "green" : finalStatuses.includes(order.status) ? "red" : "gray"}`}>{order.status}</span></td>
                  </tr>
                ))}
                {!orders.length && <tr><td colSpan={5} className="empty-state">No orders yet.</td></tr>}
              </>
            )}
          </tbody>
        </table>
      </div>
    </>
  );
}
