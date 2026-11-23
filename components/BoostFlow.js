"use client";

import { useEffect, useRef, useState } from "react";
import {
  ArrowLeft, ArrowRight, AtSign, Briefcase, Camera, Check, CheckCircle2, CreditCard, Globe,
  Loader2, Music2, Package, Phone, Play, ShieldCheck, Smartphone, Star, Users, Zap,
} from "lucide-react";
import ScrollEffects from "@/components/marketing/ScrollEffects";

const platforms = [
  { id: "instagram", name: "Instagram", icon: Camera, color: "#e1306c" },
  { id: "tiktok", name: "TikTok", icon: Music2, color: "#111827" },
  { id: "youtube", name: "YouTube", icon: Play, color: "#ff0033" },
  { id: "x", name: "X", icon: AtSign, color: "#111827" },
  { id: "facebook", name: "Facebook", icon: Users, color: "#1877f2" },
  { id: "linkedin", name: "LinkedIn", icon: Briefcase, color: "#0a66c2" },
];

const packages = [
  { id: "starter", followers: "5K", amount: "TZS 5,000", label: "5,000 followers", badge: "Starter", perk: "Good for a quick test" },
  { id: "growth", followers: "10K", amount: "TZS 15,000", label: "10,000 followers", badge: "Most popular", perk: "Best balance of reach and price", featured: true },
  { id: "pro", followers: "20K", amount: "TZS 25,000", label: "20,000 followers", badge: "Best value", perk: "Maximum growth for campaigns" },
];

const steps = [
  { label: "Platform", icon: Smartphone },
  { label: "Account", icon: Users },
  { label: "Package", icon: Package },
  { label: "Payment", icon: Phone },
];

const cardClasses = ["card-coral", "card-violet", "card-pink"];

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
  const [username, setUsername] = useState("");
  const [selectedPackage, setSelectedPackage] = useState(null);
  const [phone, setPhone] = useState("");
  const [paymentMethod, setPaymentMethod] = useState("mobile");
  const [cardName, setCardName] = useState("");
  const [cardEmail, setCardEmail] = useState("");
  const [checking, setChecking] = useState(false);
  const [processing, setProcessing] = useState(false);
  const [reference, setReference] = useState("");
  const timer = useRef(null);
  const flowRef = useRef(null);
  const PlatformIcon = platform?.icon;

  useEffect(() => () => clearTimeout(timer.current), []);

  useEffect(() => {
    if (step > 0) flowRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
  }, [step]);

  const checkAccount = (event) => {
    event.preventDefault();
    if (!username.trim()) return;
    setChecking(true);
    timer.current = setTimeout(() => {
      setChecking(false);
      setStep(2);
    }, 1600);
  };

  const submitPayment = (event) => {
    event.preventDefault();
    if (phone.trim().length < 9) return;
    if (paymentMethod === "card" && (!cardName.trim() || !cardEmail.includes("@"))) return;
    setProcessing(true);
    timer.current = setTimeout(() => {
      setReference(`NR-${Date.now().toString().slice(-6)}`);
      setProcessing(false);
      setStep(5);
    }, 1700);
  };

  const reset = () => {
    setStep(0);
    setPlatform(null);
    setUsername("");
    setSelectedPackage(null);
    setPhone("");
    setPaymentMethod("mobile");
    setCardName("");
    setCardEmail("");
    setReference("");
  };

  const back = () => {
    if (step === 1) setStep(0);
    else if (step === 2 || step === 3) setStep(1);
    else if (step === 4) setStep(3);
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
                          onClick={() => { setPlatform({ id, name, color }); setStep(1); }}
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
                      <div className="input-wrap clone-input">
                        <span className="at-sign">@</span>
                        <input
                          type="text"
                          value={username}
                          onChange={(event) => setUsername(event.target.value.replace(/^@/, ""))}
                          placeholder="your-username"
                          aria-label="Username"
                          required
                          autoFocus
                        />
                      </div>
                      <button type="submit" className="btn btn-primary btn-lg" disabled={checking}>
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
                        <p>We found <strong>@{username}</strong> on {platform?.name}. This account can be boosted with one of the packages below.</p>
                        <div className="clone-success-chips">
                          <span><Check size={14} /> Public profile detected</span>
                          <span><Check size={14} /> Eligible for growth</span>
                          <span><Check size={14} /> Secure checkout ready</span>
                        </div>
                      </div>
                    </div>
                    <button type="button" className="btn btn-primary btn-lg clone-full-btn" onClick={() => setStep(3)}>
                      Choose a package <ArrowRight size={17} />
                    </button>
                  </>
                )}

                {step === 3 && (
                  <>
                    <button type="button" className="back-link" onClick={back}><ArrowLeft size={15} /> Back to account</button>
                    <div className="boost-card-head">
                      <span className="step-kicker">Step 3 of 4</span>
                      <h2>Choose your followers package</h2>
                      <p>Select how many followers you want for <strong>@{username}</strong> on {platform?.name}.</p>
                    </div>
                    <div className="pricing-grid clone-packages">
                      {packages.map((item) => (
                        <button
                          type="button"
                          key={item.id}
                          className={`price-card clone-price ${item.featured ? "featured" : ""} ${selectedPackage?.id === item.id ? "selected" : ""}`}
                          onClick={() => setSelectedPackage(item)}
                        >
                          <span className="price-badge">{item.badge}</span>
                          <div className="clone-count">{item.followers}</div>
                          <h3>{item.label}</h3>
                          <p className="price-desc">{item.perk}</p>
                          <div className="clone-amount">{item.amount}</div>
                          <span className="clone-select">
                            {selectedPackage?.id === item.id ? <><Check size={15} /> Selected</> : <>Select package <ArrowRight size={15} /></>}
                          </span>
                        </button>
                      ))}
                    </div>
                    <button type="button" className="btn btn-primary btn-lg clone-full-btn" disabled={!selectedPackage} onClick={() => setStep(4)}>
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
                      <p>Mobile money sends a prompt to your phone. Card payment opens a secure NORIPESA checkout.</p>
                    </div>
                    <div className="panel clone-order">
                      <div><span>Platform</span><strong>{platform?.name}</strong></div>
                      <div><span>Username</span><strong>@{username}</strong></div>
                      <div><span>Package</span><strong>{selectedPackage?.label}</strong></div>
                      <div className="clone-order-total"><span>Amount</span><strong>{selectedPackage?.amount}</strong></div>
                    </div>
                    <div className="payment-methods">
                      <button type="button" className={`payment-method ${paymentMethod === "mobile" ? "selected" : ""}`} onClick={() => setPaymentMethod("mobile")}>
                        <Smartphone size={22} />
                        <span><strong>Mobile money</strong><small>M-Pesa, Mixx by Yas, Airtel Money</small></span>
                      </button>
                      <button type="button" className={`payment-method ${paymentMethod === "card" ? "selected" : ""}`} onClick={() => setPaymentMethod("card")}>
                        <CreditCard size={22} />
                        <span><strong>Kadi</strong><small>Visa / Mastercard, 3-D Secure</small></span>
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
                          autoFocus
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
                              placeholder="Jina kamili"
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
                              placeholder="jina@mfano.co.tz"
                              required
                            />
                          </div>
                        </>
                      )}
                      <button type="submit" className="btn btn-primary btn-lg clone-full-btn" disabled={processing || phone.trim().length < 9}>
                        {processing ? <><Loader2 size={18} className="spin" /> Preparing payment...</> : paymentMethod === "card" ? "Continue to card checkout" : "Send mobile money prompt"}
                      </button>
                      {processing && (
                        <div className="clone-loading" aria-live="polite">
                          <Loader2 size={26} className="spin" />
                          <div>
                            <strong>Securing your request</strong>
                            <span>Preparing a safe checkout with NORIPESA...</span>
                            <div className="clone-progress-bar"><span /></div>
                          </div>
                        </div>
                      )}
                    </form>
                  </>
                )}

                {step === 5 && (
                  <div className="guarantee-card clone-success clone-done" aria-live="polite">
                    <div className="guarantee-orb"><CheckCircle2 size={68} strokeWidth={1.5} /></div>
                    <div className="guarantee-content">
                      <div className="pill clone-success-pill"><Check size={14} /> Request ready</div>
                      <h2>Payment request prepared</h2>
                      <p>Your {selectedPackage?.label} boost for <strong>@{username}</strong> on {platform?.name} is ready via <strong>{paymentMethod === "card" ? "Visa / Mastercard" : "mobile money"}</strong>. Reference: <strong>{reference}</strong>.</p>
                      <div className="clone-success-chips">
                        <span><Check size={14} /> Account checked</span>
                        <span><Check size={14} /> Package selected</span>
                        <span><Check size={14} /> {paymentMethod === "card" ? "Card checkout ready" : "Mobile prompt ready"}</span>
                      </div>
                      <button type="button" className="btn btn-primary btn-lg clone-done-btn" onClick={reset}>
                        Start another request <ArrowRight size={17} />
                      </button>
                    </div>
                  </div>
                )}
              </section>
            </div>

            <p className="clone-disclaimer"><ShieldCheck size={14} /> Secure checkout powered by NORIPESA. We never ask for your password.</p>
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
