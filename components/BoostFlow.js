"use client";

import { useEffect, useRef, useState } from "react";
import {
  ArrowLeft, ArrowRight, Briefcase, Check, CheckCircle2, CreditCard, Globe,
  Loader2, Package, Phone, Play, ShieldCheck, Smartphone, Star, Users, X, Zap,
} from "lucide-react";
import {
  FacebookIcon, InstagramIcon, LinkedinIcon, TikTokIcon, XIcon, YouTubeIcon,
} from "@/components/BrandIcons";
import ScrollEffects from "@/components/marketing/ScrollEffects";

const platforms = [
  { id: "instagram", name: "Instagram", icon: InstagramIcon, color: "#ff0069" },
  { id: "tiktok", name: "TikTok", icon: TikTokIcon, color: "#010101" },
  { id: "youtube", name: "YouTube", icon: YouTubeIcon, color: "#ff0000" },
  { id: "x", name: "X", icon: XIcon, color: "#000000" },
  { id: "facebook", name: "Facebook", icon: FacebookIcon, color: "#0866ff" },
  { id: "linkedin", name: "LinkedIn", icon: LinkedinIcon, color: "#0a66c2" },
];

const packages = [
  { id: "boost5k", count: 5000, followers: "5K", amount: "TZS 5,000", badge: "Starter", perk: "Good for a quick test" },
  { id: "boost10k", count: 10000, followers: "10K", amount: "TZS 15,000", badge: "Most popular", perk: "Best balance of reach and price", featured: true },
  { id: "boost20k", count: 20000, followers: "20K", amount: "TZS 25,000", badge: "Best value", perk: "Maximum growth for campaigns" },
];

const steps = [
  { label: "Platform", icon: Smartphone },
  { label: "Account", icon: Users },
  { label: "Package", icon: Package },
  { label: "Payment", icon: Phone },
];

const cardClasses = ["card-coral", "card-violet", "card-pink"];
const statusMap = { success: "paid", failed: "failed", cancelled: "cancelled", expired: "expired" };
const finalStatuses = ["paid", "failed", "cancelled", "expired"];

function Progress({ step }) {
  const current = step === 0 ? 0 : step === 1 || step === 2 ? 1 : step === 3 ? 2 : 3;
  return (
    <div className="clone-progress" aria-label="Progress">
      {steps.map(({ label, icon: Icon }, index) => (
        <div
          key={label}
          className={`clone-step ${index < current ? "done" : ""} ${index === current ? "current" : ""}`}
          aria-current={index === current ? "step" : undefined}
        >
          <span className="clone-step-dot">{index < current ? <Check size={14} /> : <Icon size={14} />}</span>
          <span>{label}</span>
        </div>
      ))}
    </div>
  );
}

export default function BoostFlow() {
  const [step, setStep] = useState(0);
  const [platform, setPlatform] = useState(null);
  const [facebookAudience, setFacebookAudience] = useState("");
  const [youtubeGoal, setYoutubeGoal] = useState("");
  const [username, setUsername] = useState("");
  const [selectedPackage, setSelectedPackage] = useState(null);
  const [phone, setPhone] = useState("");
  const [paymentMethod, setPaymentMethod] = useState("mobile");
  const [cardName, setCardName] = useState("");
  const [cardEmail, setCardEmail] = useState("");
  const [checking, setChecking] = useState(false);
  const [processing, setProcessing] = useState(false);
  const [reference, setReference] = useState("");
  const [paymentMessage, setPaymentMessage] = useState("");
  const [paymentStatus, setPaymentStatus] = useState("pending");
  const [paymentError, setPaymentError] = useState("");
  const [checkTimedOut, setCheckTimedOut] = useState(false);
  const timer = useRef(null);
  const pollTimer = useRef(null);
  const flowRef = useRef(null);
  const ctaRef = useRef(null);
  const PlatformIcon = platform?.icon;
  const failed = finalStatuses.includes(paymentStatus) && paymentStatus !== "paid";
  const deliveryUnit =
    platform?.id === "facebook"
      ? facebookAudience === "followers" ? "followers" : "friends"
      : platform?.id === "youtube"
        ? youtubeGoal || "subscribers"
        : "followers";
  const deliveryDetail =
    platform?.id === "facebook"
      ? facebookAudience === "followers" ? "Followers (page / professional)" : "Friends (personal account)"
      : platform?.id === "youtube"
        ? youtubeGoal === "views" ? "Views" : "Subscribers"
        : "Followers";
  const audienceReady =
    (platform?.id !== "facebook" || Boolean(facebookAudience)) &&
    (platform?.id !== "youtube" || Boolean(youtubeGoal));
  const packageLabel = (item) => `${item.count.toLocaleString()} ${deliveryUnit}`;

  useEffect(() => () => {
    clearTimeout(timer.current);
    clearInterval(pollTimer.current);
  }, []);

  useEffect(() => {
    if (step === 0) return;
    const timeout = setTimeout(() => {
      (ctaRef.current || flowRef.current)?.scrollIntoView({ behavior: "smooth", block: "center" });
    }, 140);
    return () => clearTimeout(timeout);
  }, [step]);

  const checkAccount = (event) => {
    event.preventDefault();
    if (!username.trim() || !audienceReady) return;
    setChecking(true);
    timer.current = setTimeout(() => {
      setChecking(false);
      setStep(2);
    }, 1600);
  };

  const stopPolling = () => {
    clearInterval(pollTimer.current);
    pollTimer.current = null;
  };

  const checkPaymentStatus = async (ref) => {
    try {
      const response = await fetch("/api/payments/status", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ reference: ref }),
      });
      const data = await response.json();
      if (!response.ok) return null;
      const status = data.orderStatus || statusMap[data.paymentStatus];
      if (status) setPaymentStatus(status);
      if (data.message) setPaymentMessage(data.message);
      return data;
    } catch {
      return null;
    }
  };

  const startPolling = (ref) => {
    stopPolling();
    let attempts = 0;
    pollTimer.current = setInterval(async () => {
      attempts += 1;
      const data = await checkPaymentStatus(ref);
      const status = data?.orderStatus || statusMap[data?.paymentStatus];
      if (attempts >= 20) setCheckTimedOut(true);
      if (!data || finalStatuses.includes(status) || attempts >= 20) stopPolling();
    }, 4000);
  };

  async function submitPayment(event) {
    event.preventDefault();
    if (phone.trim().length < 9) return;
    if (paymentMethod === "card" && (!cardName.trim() || !cardEmail.includes("@"))) return;
    setProcessing(true);
    setPaymentError("");
    setPaymentMessage("");
    setPaymentStatus("pending");
    setCheckTimedOut(false);

    try {
      const response = await fetch("/api/payments/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          plan: selectedPackage?.id,
          method: paymentMethod,
          phone,
          fullName: paymentMethod === "card" ? cardName : "",
          email: paymentMethod === "card" ? cardEmail : "",
        }),
      });
      const data = await response.json();
      if (!response.ok && response.status !== 202) {
        const error = new Error(data.error || "The payment request failed.");
        error.retryAfterSeconds = data.retryAfterSeconds;
        throw error;
      }

      const nextStatus = data.orderStatus || statusMap[data.providerStatus] || "pending";
      const nextReference = data.reference || "";
      setReference(nextReference);
      setPaymentMessage(data.message || (response.status === 202 ? data.error : "") || "");
      setPaymentStatus(nextStatus);

      if (paymentMethod === "card") {
        if (!data.checkoutUrl) throw new Error(data.error || "No payment link was returned.");
        window.location.assign(data.checkoutUrl);
        return;
      }

      setStep(5);
      if (!finalStatuses.includes(nextStatus) && nextReference) startPolling(nextReference);
    } catch (error) {
      const retry = error.retryAfterSeconds ? ` Please try again after ${error.retryAfterSeconds} seconds.` : "";
      setPaymentError(`${error.message || "Network error. Please try again."}${retry}`);
    } finally {
      setProcessing(false);
    }
  }

  const reset = () => {
    stopPolling();
    setStep(0);
    setPlatform(null);
    setFacebookAudience("");
    setYoutubeGoal("");
    setUsername("");
    setSelectedPackage(null);
    setPhone("");
    setPaymentMethod("mobile");
    setCardName("");
    setCardEmail("");
    setReference("");
    setPaymentMessage("");
    setPaymentStatus("pending");
    setPaymentError("");
    setCheckTimedOut(false);
  };

  const back = () => {
    if (step === 1) setStep(0);
    else if (step === 2 || step === 3) setStep(1);
    else if (step === 4) setStep(3);
  };

  const selectPlatform = (item) => {
    setPlatform(item);
    setFacebookAudience("");
    setYoutubeGoal("");
    setStep(1);
  };

  const selectPackage = (item) => {
    setSelectedPackage(item);
    requestAnimationFrame(() => ctaRef.current?.scrollIntoView({ behavior: "smooth", block: "center" }));
  };

  return (
    <div className="clone-page">
      <ScrollEffects />
      <div className="announcement clone-announcement">
        <div className="announcement-inner">
          <Star size={15} fill="currentColor" className="announcement-star" />
          <strong>Free eligibility check:</strong>
          <span>No account needed. See if your profile qualifies instantly.</span>
          <span className="announcement-link">All networks supported <ArrowRight size={13} /></span>
        </div>
      </div>

      <header className="site-header">
        <div className="container header-inner">
          <div className="brand">
            <span className="brand-mark">f</span>
            <span className="brand-name">Folowaz</span>
          </div>
          <div className="clone-header-right">
            <span className="clone-header-chip"><Globe size={14} /> 6 networks</span>
            <span className="pill pill-light clone-mode"><span className="live-dot" /> Live checker</span>
          </div>
        </div>
      </header>

      <main>
        <section className="hero clone-hero section">
          <div className="hero-glow hero-glow-one" />
          <div className="hero-glow hero-glow-two" />
          <div className="container">
            <div className="section-head center clone-intro">
              <div className="pill pill-soft"><Star size={13} fill="currentColor" className="pill-star" /> 4.98/5 · 58,000+ checks</div>
              <h1>Boost any social account with <span className="gradient-text">smart growth</span>.</h1>
              <p>Choose your network, check your username, pick a package, then pay with mobile money or card. No sign in or sign up needed.</p>
              <div className="clone-trust">
                <span><ShieldCheck size={14} /> No password needed</span>
                <span><Zap size={14} /> Instant results</span>
                <span><Globe size={14} /> All networks</span>
              </div>
            </div>

            <Progress step={step} />

            <div className="clone-flow-wrap" ref={flowRef}>
              <section className="clone-flow" key={step}>
                {step === 0 && (
                  <>
                    <div className="boost-card-head">
                      <span className="step-kicker">Step 1 of 4</span>
                      <h2>Choose your social media</h2>
                      <p>We support all major platforms. Select one to continue.</p>
                    </div>
                    <div className="clone-platform-grid">
                      {platforms.map(({ id, name, icon: Icon, color }, index) => (
                        <button
                          type="button"
                          key={id}
                          className={`step-card clone-platform ${cardClasses[index % cardClasses.length]}`}
                          onClick={() => selectPlatform({ id, name, icon: Icon, color })}
                        >
                          <div className="step-label">PLATFORM {String(index + 1).padStart(2, "0")}</div>
                          <span className="clone-platform-icon" style={{ background: color }}><Icon size={26} /></span>
                          <strong>{name}</strong>
                          <span className="clone-select">Select <ArrowRight size={15} /></span>
                        </button>
                      ))}
                    </div>
                  </>
                )}

                {step === 1 && (
                  <>
                    <button type="button" className="back-link" onClick={back}><ArrowLeft size={15} /> Change platform</button>
                    <div className="boost-card-head">
                      <span className="step-kicker">Step 2 of 4</span>
                      <h2>Enter your username</h2>
                      <p>We will check if your {platform?.name} account is eligible for boosting.</p>
                    </div>
                    <form className="clone-form" onSubmit={checkAccount}>
                      <div className="pill pill-light clone-account-pill">
                        <span className="clone-platform-icon small" style={{ background: platform?.color }}>
                          {PlatformIcon && <PlatformIcon size={17} />}
                        </span>
                        {platform?.name}
                      </div>

                      {platform?.id === "facebook" && (
                        <div className="audience-options">
                          <div className="audience-head">
                            <strong>What do you want to grow?</strong>
                            <p>Personal accounts receive friends. Pages and professional accounts receive followers.</p>
                          </div>
                          <div className="audience-grid">
                            <button type="button" className={`audience-card ${facebookAudience === "friends" ? "selected" : ""}`} onClick={() => setFacebookAudience("friends")}>
                              <Users size={20} />
                              <span><strong>Personal account</strong><small>You will receive friends</small></span>
                              {facebookAudience === "friends" && <Check size={16} className="audience-check" />}
                            </button>
                            <button type="button" className={`audience-card ${facebookAudience === "followers" ? "selected" : ""}`} onClick={() => setFacebookAudience("followers")}>
                              <Briefcase size={20} />
                              <span><strong>Page / professional</strong><small>You will receive followers</small></span>
                              {facebookAudience === "followers" && <Check size={16} className="audience-check" />}
                            </button>
                          </div>
                        </div>
                      )}

                      {platform?.id === "youtube" && (
                        <div className="audience-options">
                          <div className="audience-head">
                            <strong>Choose what you want to grow</strong>
                            <p>Select one option to continue with your YouTube boost.</p>
                          </div>
                          <div className="audience-grid">
                            <button type="button" className={`audience-card ${youtubeGoal === "subscribers" ? "selected" : ""}`} onClick={() => setYoutubeGoal("subscribers")}>
                              <Users size={20} />
                              <span><strong>Subscribers</strong><small>Grow your channel audience</small></span>
                              {youtubeGoal === "subscribers" && <Check size={16} className="audience-check" />}
                            </button>
                            <button type="button" className={`audience-card ${youtubeGoal === "views" ? "selected" : ""}`} onClick={() => setYoutubeGoal("views")}>
                              <Play size={20} />
                              <span><strong>Views</strong><small>Get more views on your videos</small></span>
                              {youtubeGoal === "views" && <Check size={16} className="audience-check" />}
                            </button>
                          </div>
                        </div>
                      )}

                      <div className="input-wrap clone-input">
                        <span className="at-sign">@</span>
                        <input
                          type="text"
                          value={username}
                          onChange={(event) => setUsername(event.target.value.replace(/^@/, ""))}
                          placeholder="your-username"
                           aria-label="Username"
                           required
                         />
                      </div>
                      {!audienceReady && <span className="audience-hint">Select an option above to continue.</span>}
                      <button type="submit" className="btn btn-primary btn-lg" disabled={checking || !audienceReady} ref={ctaRef}>
                        {checking ? <><Loader2 size={18} className="spin" /> Checking account...</> : <>Check account <ArrowRight size={17} /></>}
                      </button>
                    </form>
                    {checking && (
                      <div className="clone-loading" aria-live="polite">
                        <Loader2 size={26} className="spin" />
                        <div>
                          <strong>Looking up @{username || "account"}</strong>
                          <span>Connecting to {platform?.name} and reviewing account details...</span>
                          <div className="clone-progress-bar"><span /></div>
                        </div>
                      </div>
                    )}
                  </>
                )}

                {step === 2 && (
                  <>
                    <button type="button" className="back-link" onClick={back}><ArrowLeft size={15} /> Check another account</button>
                    <div className="guarantee-card clone-success" aria-live="polite">
                      <div className="guarantee-orb"><CheckCircle2 size={64} strokeWidth={1.5} /></div>
                      <div className="guarantee-content">
                        <div className="pill clone-success-pill"><Check size={14} /> Check complete</div>
                        <h2>Account is eligible for boosting</h2>
                        <p>We found <strong>@{username}</strong> on {platform?.name}. You can receive {deliveryDetail.toLowerCase()} with one of the packages below.</p>
                        <div className="clone-success-chips">
                          <span><Check size={14} /> Public profile detected</span>
                          <span><Check size={14} /> Eligible for growth</span>
                          <span><Check size={14} /> Secure checkout ready</span>
                        </div>
                      </div>
                    </div>
                    <button type="button" className="btn btn-primary btn-lg clone-full-btn" onClick={() => setStep(3)} ref={ctaRef}>
                      Choose a package <ArrowRight size={17} />
                    </button>
                  </>
                )}

                {step === 3 && (
                  <>
                    <button type="button" className="back-link" onClick={back}><ArrowLeft size={15} /> Back to account</button>
                    <div className="boost-card-head">
                      <span className="step-kicker">Step 3 of 4</span>
                      <h2>Choose your {deliveryUnit} package</h2>
                      <p>Select how many {deliveryUnit} you want for <strong>@{username}</strong> on {platform?.name}.</p>
                    </div>
                    <div className="pricing-grid clone-packages">
                      {packages.map((item) => (
                        <button
                          type="button"
                          key={item.id}
                          className={`price-card clone-price ${item.featured ? "featured" : ""} ${selectedPackage?.id === item.id ? "selected" : ""}`}
                          onClick={() => selectPackage(item)}
                        >
                          <span className="price-badge">{item.badge}</span>
                          <div className="clone-count">{item.followers}</div>
                          <h3>{packageLabel(item)}</h3>
                          <p className="price-desc">{item.perk}</p>
                          <div className="clone-amount">{item.amount}</div>
                          <span className="clone-select">
                            {selectedPackage?.id === item.id ? <><Check size={15} /> Selected</> : <>Select package <ArrowRight size={15} /></>}
                          </span>
                        </button>
                      ))}
                    </div>
                    <button type="button" className="btn btn-primary btn-lg clone-full-btn" disabled={!selectedPackage} onClick={() => setStep(4)} ref={ctaRef}>
                      Continue to payment <ArrowRight size={17} />
                    </button>
                  </>
                )}

                {step === 4 && (
                  <>
                    <button type="button" className="back-link" onClick={back}><ArrowLeft size={15} /> Change package</button>
                    <div className="boost-card-head">
                      <span className="step-kicker">Step 4 of 4</span>
                      <h2>Choose how to pay</h2>
                      <p>Mobile money sends a USSD prompt to your phone. Card payment opens a secure checkout.</p>
                    </div>
                    <div className="panel clone-order">
                      <div><span>Platform</span><strong>{platform?.name}</strong></div>
                      <div><span>Username</span><strong>@{username}</strong></div>
                      <div><span>Delivery</span><strong>{deliveryDetail}</strong></div>
                      <div><span>Package</span><strong>{selectedPackage ? packageLabel(selectedPackage) : ""}</strong></div>
                      <div className="clone-order-total"><span>Amount</span><strong>{selectedPackage?.amount}</strong></div>
                    </div>
                    <div className="payment-methods">
                      <button type="button" className={`payment-method ${paymentMethod === "mobile" ? "selected" : ""}`} onClick={() => setPaymentMethod("mobile")}>
                        <Smartphone size={22} />
                        <span><strong>Mobile money</strong><small>M-Pesa, Mixx by Yas, Airtel Money</small></span>
                      </button>
                      <button type="button" className={`payment-method ${paymentMethod === "card" ? "selected" : ""}`} onClick={() => setPaymentMethod("card")}>
                        <CreditCard size={22} />
                        <span><strong>Card</strong><small>Visa / Mastercard, 3-D Secure</small></span>
                      </button>
                    </div>
                    <form className="clone-form" onSubmit={submitPayment}>
                      <label htmlFor="phone">Phone number for payment</label>
                      <div className="input-wrap clone-input">
                        <Phone size={18} className="clone-input-icon" />
                        <input
                          id="phone"
                          type="tel"
                          value={phone}
                          onChange={(event) => setPhone(event.target.value)}
                          placeholder="+255 7XX XXX XXX"
                          required
                        />
                      </div>
                      {paymentMethod === "card" && (
                        <>
                          <label htmlFor="card-name">Name on card</label>
                          <div className="input-wrap clone-input">
                            <input
                              id="card-name"
                              type="text"
                              value={cardName}
                              onChange={(event) => setCardName(event.target.value)}
                              placeholder="Full name"
                              required
                            />
                          </div>
                          <label htmlFor="card-email">Email for receipt</label>
                          <div className="input-wrap clone-input">
                            <input
                              id="card-email"
                              type="email"
                              value={cardEmail}
                              onChange={(event) => setCardEmail(event.target.value)}
                              placeholder="you@example.com"
                              required
                            />
                          </div>
                        </>
                      )}
                      {paymentError && <div className="auth-error" role="alert">{paymentError}</div>}
                      <button type="submit" className="btn btn-primary btn-lg clone-full-btn" disabled={processing || phone.trim().length < 9} ref={ctaRef}>
                        {processing ? <><Loader2 size={18} className="spin" /> Preparing payment...</> : paymentMethod === "card" ? "Continue to card checkout" : "Send mobile money prompt"}
                      </button>
                      {processing && (
                        <div className="clone-loading" aria-live="polite">
                          <Loader2 size={26} className="spin" />
                          <div>
                            <strong>Securing your request</strong>
                            <span>Preparing a secure checkout for you...</span>
                            <div className="clone-progress-bar"><span /></div>
                          </div>
                        </div>
                      )}
                    </form>
                  </>
                )}

                {step === 5 && (
                  <div className={`guarantee-card clone-success clone-done ${paymentStatus === "paid" ? "is-paid" : ""} ${failed ? "is-failed" : ""}`} aria-live="polite">
                    <div className="guarantee-orb">
                      {paymentStatus === "paid" ? <CheckCircle2 size={68} strokeWidth={1.5} /> : failed ? <X size={68} strokeWidth={1.5} /> : <Loader2 size={68} className="spin" strokeWidth={1.5} />}
                    </div>
                    <div className="guarantee-content">
                      <div className="pill clone-success-pill">
                        {paymentStatus === "paid" ? <><Check size={14} /> Payment confirmed</> : failed ? <><X size={14} /> Payment not completed</> : <><Loader2 size={14} className="spin" /> Awaiting confirmation</>}
                      </div>
                      <h2>{paymentStatus === "paid" ? "Your boost is confirmed" : failed ? "Payment needs attention" : "Check your phone to confirm"}</h2>
                      <p>
                        {paymentStatus === "paid"
                          ? <>Your {selectedPackage ? packageLabel(selectedPackage) : ""} boost for <strong>@{username}</strong> on {platform?.name} is confirmed. Reference: <strong>{reference}</strong>.</>
                          : failed
                            ? <>The payment was {paymentStatus}. Reference: <strong>{reference}</strong>. Please start a new request to try again.</>
                            : <>We sent a payment prompt to <strong>{phone}</strong>. Open it on your phone and confirm with your PIN to complete your {selectedPackage ? packageLabel(selectedPackage) : ""} boost.</>}
                      </p>
                      {paymentMessage && (
                        <div className="clone-prompt-note">
                          <strong>Payment instructions</strong>
                          <span>{paymentMessage}</span>
                        </div>
                      )}
                      {!finalStatuses.includes(paymentStatus) && (
                        <span className="hint clone-status-hint">
                          {checkTimedOut
                            ? "Confirm the prompt on your phone, or start a new request."
                            : <><Loader2 size={13} className="spin" /> Checking payment status automatically...</>}
                        </span>
                      )}
                      <div className="clone-success-chips">
                        <span><Check size={14} /> Account checked</span>
                        <span><Check size={14} /> Package selected</span>
                        <span><Check size={14} /> Reference: {reference || "pending"}</span>
                      </div>
                      <button type="button" className="btn btn-primary btn-lg clone-done-btn" onClick={reset} ref={ctaRef}>
                        {paymentStatus === "paid" ? "Start another request" : "Make another request"} <ArrowRight size={17} />
                      </button>
                    </div>
                  </div>
                )}
              </section>
            </div>

            <p className="clone-disclaimer"><ShieldCheck size={14} /> Secure checkout. We never ask for your password.</p>
          </div>
        </section>
      </main>

      <footer className="site-footer clone-footer">
        <div className="container footer-bottom">
          <span>© 2026 Folowaz. All rights reserved.</span>
          <span>Grow with confidence, one check at a time.</span>
        </div>
      </footer>
    </div>
  );
}
