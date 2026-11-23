"use client";

import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import {
  ArrowRight, ArrowUpRight, Star, TrendingUp, Zap, Heart, Signal, MapPin,
  Cake, Globe, UtensilsCrossed, Shirt, Dumbbell, Check, Clock3, ShieldCheck,
  Lightbulb, Target, Wand2, Brain, Users, Languages, Flame, BarChart3, Rocket,
  Handshake, Mail, PawPrint, Palette, Camera, Trophy, Gamepad2, Briefcase,
  Sparkles, ChevronLeft, ChevronRight, BadgeCheck, LockKeyhole,
  Search, Plus, Music2, Circle, Home,
} from "lucide-react";

const features = [
  { icon: Target, title: "Automated targeting", text: "Reach the right audience with advanced AI and data-driven insights." },
  { icon: MapPin, title: "Location targeting", text: "Reach the right people in the right places and build a closer connection with your audience." },
  { icon: Wand2, title: "Profile optimization", text: "Improve your Instagram profile with AI built just for you." },
  { icon: Brain, title: "Interests & niche", text: "Reach the right market and gain followers who matter most to your brand." },
  { icon: Users, title: "Age & gender filters", text: "Control your audience by choosing the age and gender that fit." },
  { icon: Languages, title: "Language targeting", text: "Reach followers in their own language so you can connect more effectively." },
  { icon: Flame, title: "Content library", text: "Trending content ideas and templates in real time for your niche." },
  { icon: BarChart3, title: "Analytics & reports", text: "Track your growth and download PDF performance reports." },
  { icon: Rocket, title: "Folowaz Boost", text: "Accelerate growth with smart AI systems. Beta users saw a 275% increase." },
  { icon: Clock3, title: "Real-time growth", text: "Watch your account grow even while you sleep with our automated technology." },
  { icon: Handshake, title: "Agency-friendly", text: "Bulk discounts and easy management of multiple client accounts." },
  { icon: Mail, title: "Email support", text: "Get fast help from our expert team whenever you need it." },
];

const reviews = [
  { title: "What a great deal!", text: "I was skeptical at first, but Folowaz changed my account. I gained over 10,000 real followers in a few months.", name: "Juma M.", role: "Musician", initial: "J", color: "ra-1" },
  { title: "Like a power boost!", text: "I gained over 4,000 real Instagram followers in just a few weeks! Now it's one less thing to worry about.", name: "Asha K.", role: "Content creator", initial: "A", color: "ra-2" },
  { title: "It really works", text: "I've tried other growth services, but Folowaz is better. They delivered real, steady growth. Highly recommended!", name: "Daniel O.", role: "Business owner", initial: "D", color: "ra-3" },
  { title: "You need this!", text: "Thanks to Folowaz, I grew my following by over 50% in a few months. The results speak for themselves.", name: "Ngia W.", role: "Fitness coach", initial: "N", color: "ra-4" },
  { title: "AI is the future", text: "I run a small restaurant and was struggling on Instagram. Folowaz is the obvious choice for any restaurant owner who wants to grow.", name: "Peter K.", role: "Restaurant owner", initial: "P", color: "ra-5" },
  { title: "My followers doubled", text: "In a few months I gained real, engaged followers who love my art. I'm verified and I'd recommend it to any artist.", name: "Sara A.", role: "Artist", initial: "S", color: "ra-6" },
];

const plans = [
  { name: "Basic", badge: "Starter", desc: "For those just getting started.", price: "19", old: "$49", items: ["Up to 1,000 followers / month", "Basic targeting", "Weekly analytics", "Email support"], featured: false },
  { name: "Pro", badge: "Most popular", desc: "For fast, steady growth.", price: "39", old: "$69", items: ["Up to 4,000+ followers / month", "Advanced AI targeting", "Daily PDF reports", "Folowaz Boost", "Priority support"], featured: true },
  { name: "Turbo", badge: "For business", desc: "For brands and agencies.", price: "79", old: "$99", items: ["Up to 10,000+ followers / month", "Multiple accounts and volume discounts", "Dedicated account manager", "In-depth analytics", "Guaranteed growth"], featured: false },
];

const faqs = [
  { q: "What is Folowaz?", a: "Folowaz is a social media growth platform that helps you grow your Instagram audience and engagement by attracting real people who like your account. We use promotion, light interaction, niche data, and real user activity." },
  { q: "How does Folowaz work?", a: "It's simple and fast. Connect your account, choose your audience, then adjust settings for niche, location, gender, age, and more. Our AI identifies accounts and brings you real followers who like your content." },
  { q: "Is Folowaz safe?", a: "Yes. Folowaz follows Instagram's rules and does not use spam or follow-for-follow tactics. We attract real people without putting your account at risk. Your data is encrypted and stored securely." },
  { q: "How many followers will I get?", a: "It depends on your niche, content quality, and engagement rate. On average, Pro members gain over 4,000 real followers a month." },
  { q: "What is the refund policy?", a: "We're confident in our service. If you don't see positive growth after 7 days of subscription, we refund you in full, no questions asked. Our team is ready to help at any time." },
];

function Stars({ count = 5, size = 14 }) {
  return (
    <span className="stars">
      {Array.from({ length: count }).map((_, index) => <Star key={index} size={size} fill="currentColor" />)}
    </span>
  );
}

export function Hero() {
  const router = useRouter();
  const [username, setUsername] = useState("");
  const [followers, setFollowers] = useState(0);

  useEffect(() => {
    let frame = 0;
    let start = 0;
    const target = 340989;
    const step = (timestamp) => {
      if (!start) start = timestamp;
      const progress = Math.min((timestamp - start) / 2200, 1);
      setFollowers(Math.floor((1 - Math.pow(1 - progress, 3)) * target));
      if (progress < 1) frame = requestAnimationFrame(step);
    };
    const timer = setTimeout(() => { frame = requestAnimationFrame(step); }, 700);
    return () => { clearTimeout(timer); cancelAnimationFrame(frame); };
  }, []);

  const submit = (event) => {
    event.preventDefault();
    const name = username.trim().replace(/^@/, "");
    if (name) router.push(`/signup?ig=${encodeURIComponent(name)}`);
  };

  return (
    <section className="hero section">
      <div className="hero-glow hero-glow-one" />
      <div className="hero-glow hero-glow-two" />
      <div className="container hero-grid">
        <div className="hero-copy">
          <div className="pill pill-soft"><Star size={13} fill="currentColor" className="pill-star" /> 4.98/5, 58,980+ users</div>
          <h1>Get real Instagram followers with <span className="gradient-text">AI</span>.</h1>
          <p className="hero-lead">Enter your Instagram username and start for free. Folowaz reaches people who like what you share, with no bots, no fake followers, and no password.</p>
          <form className="hero-form" onSubmit={submit}>
            <div className="input-wrap">
              <span className="at-sign">@</span>
              <input type="text" value={username} onChange={(event) => setUsername(event.target.value)} placeholder="your-instagram-name" aria-label="Instagram username" required autoComplete="off" />
            </div>
            <button type="submit" className="btn btn-primary btn-lg">Start growing free <ArrowRight size={17} /></button>
          </form>
          <p className="form-note">No credit card required. Guaranteed growth or your money back</p>
          <div className="hero-social-proof">
            <div className="avatars" aria-hidden="true">
              <span className="avatar avatar-1">A</span><span className="avatar avatar-2">M</span><span className="avatar avatar-3">J</span><span className="avatar avatar-4">S</span>
            </div>
            <div className="proof-text"><strong>58K+</strong> customers, <strong>4.98/5</strong> on average</div>
          </div>
        </div>

        <div className="hero-visual" aria-hidden="true">
          <div className="float float-arrow"><TrendingUp size={30} /></div>
          <div className="float float-heart"><Heart size={38} fill="currentColor" /></div>
          <div className="float float-star"><Star size={30} fill="currentColor" /></div>
          <div className="float float-bolt"><Zap size={30} fill="currentColor" /></div>
          <div className="phone">
            <div className="phone-top"><span>9:41</span><Signal size={14} /></div>
            <div className="profile-head">
              <div className="profile-avatar" />
              <div><strong>bi_amichelle</strong><span>Content creator</span></div>
            </div>
            <div className="profile-stats">
              <div><strong>790</strong><span>Posts</span></div>
              <div><strong>{followers.toLocaleString("en-US")}</strong><span>Followers</span></div>
              <div><strong>301</strong><span>Following</span></div>
            </div>
            <div className="photo-grid">
              <i className="tile tile-1" /><i className="tile tile-2" /><i className="tile tile-3" />
              <i className="tile tile-4" /><i className="tile tile-5" /><i className="tile tile-6" />
            </div>
            <div className="phone-bottom"><Home size={15} /><Search size={15} /><Plus size={15} /><Music2 size={15} /><Circle size={15} /></div>
          </div>
          <div className="floating-card card-growth">
            <div className="card-icon green"><TrendingUp size={18} /></div>
            <div><small>New followers today</small><strong>+1,284</strong></div>
          </div>
          <div className="floating-card card-rating">
            <div className="card-icon gold"><Star size={18} fill="currentColor" /></div>
            <div><small>Rating</small><strong>4.98 / 5</strong></div>
          </div>
          <div className="floating-card card-live"><span className="live-dot" /> Growth running 24/7</div>
        </div>
      </div>
      <div className="container hero-bottom-stats">
        <div><strong>58K+</strong><span>Real users</span></div>
        <div><strong>100%</strong><span>Guaranteed growth</span></div>
        <div><strong>24/7</strong><span>Email support</span></div>
        <div><strong>2016</strong><span>Operating since</span></div>
      </div>
    </section>
  );
}

export function Logos() {
  const logos = ["PELOTON", "prime", "EREWHON", "KYLIE", "buzzfeed", "GYMSHARK", "dyson", "HOKA"];
  return (
    <section className="logos-section">
      <div className="container">
        <p className="logos-title">Trusted by 55,000+ users, agencies, and businesses</p>
        <div className="logo-row" aria-label="Brands using Folowaz">
          {logos.map((logo) => <span key={logo}>{logo}</span>)}
        </div>
      </div>
    </section>
  );
}

export function HowItWorks() {
  const tags = [{ icon: Shirt, label: "Fashion" }, { icon: UtensilsCrossed, label: "Food" }, { icon: Dumbbell, label: "Fitness" }];
  const chips = [{ icon: MapPin, label: "Location" }, { icon: Cake, label: "Age" }, { icon: Globe, label: "Language" }, { icon: Heart, label: "Interests" }];
  return (
    <section className="section" id="how-it-works">
      <div className="container">
        <div className="section-head center">
          <div className="pill pill-light">The easiest way</div>
          <h2>Grow your Instagram account.<br /><span className="gradient-text">The smart way.</span></h2>
          <p>No bots. No spam. No gimmicks. Just real people interested in what you do.</p>
        </div>
        <div className="steps-grid">
          <article className="step-card card-coral">
            <div className="step-label">STEP 01</div>
            <h3>100% real followers</h3>
            <p>Use our system to reach the right people. All followers are real, engaged, and interested in your content.</p>
            <div className="step-tags">{tags.map(({ icon: Icon, label }) => <span key={label}><Icon size={14} /> {label}</span>)}</div>
          </article>
          <article className="step-card card-violet">
            <div className="step-label">STEP 02</div>
            <h3>Highly engaged</h3>
            <p>It&apos;s not just numbers, quality matters too. We attract people who like commenting, liking, and viewing your stories.</p>
            <div className="mini-profile">
              <span className="mini-avatar" />
              <div><strong>@bi_amichelle</strong><small>340,989 followers</small></div>
              <span className="mini-up"><ArrowUpRight size={20} /></span>
            </div>
          </article>
          <article className="step-card card-pink">
            <div className="step-label">STEP 03</div>
            <h3>Purpose-built AI</h3>
            <p>Let our AI attract followers based on location, age, gender, language, interests, and hashtags, or let it run automatically.</p>
            <div className="target-chips">{chips.map(({ icon: Icon, label }) => <span key={label}><Icon size={14} /> {label}</span>)}</div>
          </article>
        </div>
      </div>
    </section>
  );
}

export function Results() {
  const niches = [
    { icon: Globe, label: "Travel" }, { icon: Dumbbell, label: "Fitness" }, { icon: UtensilsCrossed, label: "Food" },
    { icon: Shirt, label: "Fashion" }, { icon: Sparkles, label: "Beauty" }, { icon: PawPrint, label: "Pets" },
    { icon: Palette, label: "Art" }, { icon: Camera, label: "Photography" }, { icon: Music2, label: "Music" },
    { icon: Trophy, label: "Sports" }, { icon: Gamepad2, label: "Video games" }, { icon: Briefcase, label: "Business" },
  ];
  const checks = ["AI systems built on 5+ years of experience", "Growth model that follows Instagram's rules", "Detailed reports and live analytics"];
  return (
    <section className="section section-tint" id="results">
      <div className="container results-grid">
        <div className="results-copy">
          <div className="pill pill-light">Our results</div>
          <h2>Visible growth,<br />not guesswork.</h2>
          <p>Since 2016, Folowaz has helped over 100,000 Instagram users get real followers 10x faster. No bots, no spam, safe and reliable growth.</p>
          <ul className="check-list">
            {checks.map((item) => <li key={item}><span className="check-icon"><Check size={13} /></span>{item}</li>)}
          </ul>
          <Link href="/signup" className="btn btn-dark">Start free <ArrowRight size={16} /></Link>
        </div>
        <div className="results-visual">
          <div className="result-card before">
            <span className="result-tag">BEFORE</span>
            <div className="result-profile"><span className="result-avatar" /><strong>@jessicaolie</strong></div>
            <div className="result-number">12,480</div>
            <span className="result-caption">followers</span>
          </div>
          <div className="result-arrow"><ArrowRight size={22} /></div>
          <div className="result-card after">
            <span className="result-tag">AFTER 3 MONTHS</span>
            <div className="result-profile"><span className="result-avatar" /><strong>@jessicaolie</strong></div>
            <div className="result-number">214,908</div>
            <span className="result-caption">real followers</span>
            <div className="result-badge"><TrendingUp size={14} /> +1,620%</div>
          </div>
        </div>
      </div>
      <div className="container niche-row" aria-label="Regions we serve">
        {niches.map(({ icon: Icon, label }) => <span key={label}><Icon size={15} /> {label}</span>)}
      </div>
    </section>
  );
}

export function Why() {
  const items = [
    { icon: Clock3, cls: "icon-violet", title: "Automated 24/7 growth", text: "Enjoy Instagram growth and engagement around the clock without lifting a finger. Our system works for you day and night.", cta: "Start free", href: "/signup" },
    { icon: ShieldCheck, cls: "icon-pink", title: "Safe and reliable", text: "Folowaz follows Instagram's rules. Since 2016 we've helped people gain millions of followers the right way, with no risk of account suspension.", cta: "Start free", href: "/signup" },
    { icon: Lightbulb, cls: "icon-gold", title: "Save time and money", text: "Folowaz replaces an entire social media team. Focus on your business while we build your following.", cta: "Contact us", href: "/msaada" },
  ];
  return (
    <section className="section" id="why">
      <div className="container">
        <div className="section-head center">
          <div className="pill pill-light">Why Folowaz?</div>
          <h2>Your social media team,<br />at <span className="gradient-text">90% lower cost</span>.</h2>
          <p>We combine artificial intelligence, proven growth systems, and real human experience to bring you next-generation growth.</p>
        </div>
        <div className="why-grid">
          {items.map(({ icon: Icon, cls, title, text, cta, href }) => (
            <article className="why-card" key={title}>
              <div className={`why-icon ${cls}`}><Icon size={26} /></div>
              <h3>{title}</h3>
              <p>{text}</p>
              <Link href={href}>{cta} <ArrowRight size={14} /></Link>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}

function Carousel({ items, renderItem, className = "carousel" }) {
  const [index, setIndex] = useState(0);
  const [perView, setPerView] = useState(3);
  const [offset, setOffset] = useState(0);
  const trackRef = useRef(null);

  useEffect(() => {
    const update = () => setPerView(window.innerWidth <= 720 ? 1 : window.innerWidth <= 980 ? 2 : 3);
    update();
    window.addEventListener("resize", update);
    return () => window.removeEventListener("resize", update);
  }, []);

  useEffect(() => {
    const track = trackRef.current;
    if (!track || !track.children.length) return;
    const gap = parseFloat(getComputedStyle(track).columnGap) || 0;
    setOffset((track.children[0].getBoundingClientRect().width + gap) * index);
  }, [index, perView]);

  const max = Math.max(0, items.length - perView);
  const go = (direction) => setIndex((current) => direction > 0 ? (current >= max ? 0 : current + 1) : Math.max(0, current - 1));

  return (
    <div className={className}>
      <div className="carousel-viewport">
        <div className="carousel-track" ref={trackRef} style={{ transform: `translateX(-${offset}px)` }}>
          {items.map((item, position) => <div className="slide" key={position}>{renderItem(item, position)}</div>)}
        </div>
      </div>
      <div className="carousel-controls">
        <button className="carousel-btn" onClick={() => go(-1)} aria-label="Previous items"><ChevronLeft size={19} /></button>
        <span>{String(index + 1).padStart(2, "0")} / {String(items.length).padStart(2, "0")}</span>
        <button className="carousel-btn" onClick={() => go(1)} aria-label="Next items"><ChevronRight size={19} /></button>
      </div>
    </div>
  );
}

export function Features() {
  return (
    <section className="section section-dark" id="features">
      <div className="hero-glow hero-glow-three" />
      <div className="container">
        <div className="section-head center light">
          <div className="pill pill-dark">AI features</div>
          <h2>Packed with AI features to help you grow <span className="gradient-text">quickly and easily</span>.</h2>
          <p>Unlock the power of fast results with AI-driven growth supported by real people.</p>
        </div>
        <Carousel
          items={features}
          renderItem={({ icon: Icon, title, text }, position) => (
            <article className="feature-card">
              <div className="feature-num">{String(position + 1).padStart(2, "0")} / 12</div>
              <div className="feature-emoji"><Icon size={26} /></div>
              <h3>{title}</h3>
              <p>{text}</p>
              <Link href="/signup">Start free <ArrowRight size={14} /></Link>
            </article>
          )}
        />
      </div>
    </section>
  );
}

export function Faq() {
  const [openIndex, setOpenIndex] = useState(0);
  return (
    <section className="section" id="faq">
      <div className="container faq-grid">
        <div className="faq-intro">
          <div className="pill pill-light">Frequently asked questions</div>
          <h2>Have a question?<br />We have answers.</h2>
          <p>Folowaz helps you gain more followers, likes, and comments quickly and safely.</p>
          <Link href="/signup" className="btn btn-primary">Start free <ArrowRight size={16} /></Link>
        </div>
        <div className="accordion">
          {faqs.map(({ q, a }, position) => (
            <div className={`accordion-item ${openIndex === position ? "open" : ""}`} key={q}>
              <button className="accordion-header" aria-expanded={openIndex === position} onClick={() => setOpenIndex(openIndex === position ? -1 : position)}>
                <span><small>Q · {String(position + 1).padStart(2, "0")}</small> {q}</span>
                <span className="accordion-icon">{openIndex === position ? "−" : "+"}</span>
              </button>
              <div className="accordion-panel"><p>{a}</p></div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

export function Pricing() {
  return (
    <section className="section section-tint" id="pricing">
      <div className="container">
        <div className="section-head center">
          <div className="pill pill-light">Pricing & plans</div>
          <h2>Real followers, delivered<br /><span className="gradient-text">instantly.</span></h2>
          <p>Trusted by 50,000+ users. Choose the plan that fits you and start today.</p>
        </div>
        <div className="pricing-grid">
          {plans.map((plan) => (
            <article className={`price-card ${plan.featured ? "featured" : ""}`} key={plan.name}>
              <div className="price-badge">{plan.badge}</div>
              <h3>{plan.name}</h3>
              <p className="price-desc">{plan.desc}</p>
              <div className="price"><span>$</span>{plan.price}<small>/month</small></div>
              <p className="price-old">Instead of {plan.old}</p>
              <ul>{plan.items.map((item) => <li key={item}><Check size={14} /> {item}</li>)}</ul>
              <Link href="/signup" className={`btn ${plan.featured ? "btn-primary" : "btn-outline"}`}>Choose {plan.name} <ArrowRight size={15} /></Link>
            </article>
          ))}
        </div>
        <p className="pricing-note"><BadgeCheck size={15} /> Guaranteed growth or your money back. No credit card required to get started</p>
      </div>
    </section>
  );
}

export function Reviews() {
  return (
    <section className="section" id="reviews">
      <div className="container">
        <div className="section-head center">
          <div className="pill pill-light">Real reviews</div>
          <h2>Trusted by over 55,000 customers<br />worldwide.</h2>
          <p>Don&apos;t just take our word for it, see what our customers say.</p>
        </div>
        <Carousel
          className="carousel reviews-carousel"
          items={reviews}
          renderItem={(review) => (
            <article className="review-card">
              <div className="review-stars"><Stars size={14} /></div>
              <h3>{review.title}</h3>
              <p>{review.text}</p>
              <div className="reviewer">
                <span className={`review-avatar ${review.color}`}>{review.initial}</span>
                <div><strong>{review.name}</strong><small>{review.role}</small></div>
              </div>
            </article>
          )}
        />
        <div className="reviews-rating"><strong>4.98</strong> / 5, from 58k reviews</div>
      </div>
    </section>
  );
}

export function Guarantee() {
  const chips = ["100% guaranteed growth", "24/7 support", "No bots or fake followers"];
  return (
    <section className="section guarantee-section">
      <div className="container">
        <div className="guarantee-card">
          <div className="guarantee-orb"><Heart size={100} strokeWidth={1.3} fill="rgba(255,255,255,.25)" /></div>
          <div className="guarantee-content">
            <div className="pill pill-light"><LockKeyhole size={13} /> Our promise</div>
            <h2>Guaranteed growth<br />or your money back.</h2>
            <p>We&apos;re confident in what we do. If you don&apos;t see positive growth, we refund you in full. No tricks, no conditions.</p>
            <div className="guarantee-chips">{chips.map((chip) => <span key={chip}><Check size={14} /> {chip}</span>)}</div>
          </div>
        </div>
      </div>
    </section>
  );
}

export function FinalCta() {
  return (
    <section className="section final-cta">
      <div className="container final-cta-inner">
        <h2>Start your Instagram growth today.<br /><span className="gradient-text">Get real, engaged followers.</span></h2>
        <p>Stop stressing over your account. Our methods are tested and deliver fast, reliable results.</p>
        <div className="final-rating"><Stars size={16} /> <span>4.98 / 5, from 58k reviews</span></div>
        <div className="final-buttons">
          <Link href="/signup" className="btn btn-primary btn-lg">Start free <ArrowRight size={17} /></Link>
          <Link href="/bei" className="btn btn-outline btn-lg">View pricing <ArrowRight size={17} /></Link>
        </div>
      </div>
    </section>
  );
}
