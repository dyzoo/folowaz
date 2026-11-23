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
  { icon: Target, title: "Ulengaji wa kiotomatiki", text: "Lenga hadhira yako kwa akili bandia ya hali ya juu na maarifa yanayotokana na data." },
  { icon: MapPin, title: "Ulengaji wa eneo", text: "Fikia watu sahihi mahali sahihi na ujenge uhusiano wa karibu na hadhira yako." },
  { icon: Wand2, title: "Uboreshaji wa wasifu", text: "Boresha wasifu wako wa Instagram kwa AI iliyoundwa mahususi kwa ajili yako." },
  { icon: Brain, title: "Maslahi na niche", text: "Fikia soko linalofaa na upate wafuasi wanaomuhimu sana chapa yako." },
  { icon: Users, title: "Vichujio vya umri na jinsia", text: "Dhibiti hadhira yako kwa kuchagua umri na jinsia wanayofaa." },
  { icon: Languages, title: "Ulengaji wa lugha", text: "Wafikie wafuasi kwa lugha yao, ili uwasiliane nao vizuri zaidi." },
  { icon: Flame, title: "Maktaba ya maudhui", text: "Mawazo na violezo vya maudhui yanayovuma kwa wakati halisi katika niche yako." },
  { icon: BarChart3, title: "Uchanganuzi na ripoti", text: "Fuata ukuaji wako na upakue ripoti za PDF za utendaji wako." },
  { icon: Rocket, title: "Folowaz Boost", text: "Ongeza kasi ya ukuaji kwa kutumia mifumo mahiri ya AI. Watumiaji wa majaribio waliona ongezeko la 275%." },
  { icon: Clock3, title: "Ukuaji wa wakati halisi", text: "Tazama akaunti yako ikikua hata unapolala, kwa kutumia teknolojia yetu ya kiotomatiki." },
  { icon: Handshake, title: "Rafiki kwa mashirika", text: "Punguzo la wingi na usimamizi rahisi wa akaunti nyingi za wateja." },
  { icon: Mail, title: "Msaada wa barua pepe", text: "Pata msaada wa haraka kutoka kwa timu yetu ya wataalamu, wakati wowote unapohitaji." },
];

const reviews = [
  { title: "Ni ofa nzuri sana!", text: "Nilikuwa na shaka mwanzoni, lakini Folowaz imebadilisha akaunti yangu. Nilipata zaidi ya wafuasi 10,000 halisi kwa miezi michache.", name: "Juma M.", role: "Mwanamuziki", initial: "J", color: "ra-1" },
  { title: "Kama nguvu ya juu!", text: "Nilipata zaidi ya wafuasi 4,000 halisi wa Instagram kwa wiki chache tu! Sasa ni jambo moja la chini la kunisumbua.", name: "Asha K.", role: "Mbunifu wa maudhui", initial: "A", color: "ra-2" },
  { title: "Inafanya kazi kweli", text: "Nimejaribu huduma nyingine za ukuaji, lakini Folowaz ni bora zaidi. Wameleta ukuaji halisi na thabiti. Ninapendekeza sana!", name: "Daniel O.", role: "Mmiliki wa biashara", initial: "D", color: "ra-3" },
  { title: "Unahitaji hii!", text: "Shukrani kwa Folowaz, niliongeza wafuasi wangu kwa zaidi ya 50% kwa miezi michache. Matokeo yanaongea yenyewe.", name: "Ngia W.", role: "Mkufunzi wa mazoezi", initial: "N", color: "ra-4" },
  { title: "AI ni mustakabali wake", text: "Nina mgahawa mdogo na nilikuwa nanagoma kwenye Instagram. Folowaz ni chaguo la wazi kwa mmiliki yeyote wa mgahawa anayetaka kukua.", name: "Peter K.", role: "Mmiliki wa mgahawa", initial: "P", color: "ra-5" },
  { title: "Wafuasi wangu wameongezeka maradufu", text: "Kwa miezi michache nimepata wafuasi halisi na wanaoshiriki wanaopenda sanaa yangu. Nimethibitishwa na nitawapendekeza kwa msanii yeyote.", name: "Sara A.", role: "Msanii", initial: "S", color: "ra-6" },
];

const plans = [
  { name: "Basic", badge: "Mwanzo", desc: "Kwa wale wanaoanza tu.", price: "19", old: "$49", items: ["Hadi wafuasi 1,000 kwa mwezi", "Ulengaji wa msingi", "Uchanganuzi wa kila wiki", "Msaada wa barua pepe"], featured: false },
  { name: "Pro", badge: "Inayopendwa zaidi", desc: "Kwa ukuaji wa haraka na thabiti.", price: "39", old: "$69", items: ["Hadi wafuasi 4,000+ kwa mwezi", "Ulengaji wa AI wa hali ya juu", "Ripoti za kila siku na PDF", "Folowaz Boost", "Msaada wa kipaumbele"], featured: true },
  { name: "Turbo", badge: "Kwa biashara", desc: "Kwa chapa na mashirika.", price: "79", old: "$99", items: ["Hadi wafuasi 10,000+ kwa mwezi", "Akaunti nyingi na punguzo la wingi", "Meneja wa akaunti aliyejitolea", "Uchanganuzi wa kina", "Ukuhakikishiwa ukuaji"], featured: false },
];

const faqs = [
  { q: "Folowaz ni nini?", a: "Folowaz ni jukwaa la ukuaji wa mitandao ya kijamii linalokusaidia kuongeza hadhira na ushirikiano wa Instagram kwa kuvutia watu halisi wanaopenda akaunti yako. Tunatumia matangazo, mwingiliano mdogo, data ya niche na shughuli za watu halisi." },
  { q: "Folowaz inafanya kazi gani?", a: "Ni rahisi na haraka. Unganisha akaunti yako, chagua hadhira unayotaka, kisha rekebisha mipangilio kulingana na niche, eneo, jinsia, umri na zaidi. AI yetu hutambua akaunti na kukuletea wafuasi halisi wanaopenda maudhui yako." },
  { q: "Je, Folowaz ni salama?", a: "Ndiyo. Folowaz inatii sheria za Instagram na haitumii barua taka wala mbinu za kufuata-kwa-kufuata. Tunawavutia watu halisi bila kuweka akaunti yako hatarini. Data yako imesimbwa na kuhifadhiwa kwa usalama." },
  { q: "Nitapata wafuasi wangapi?", a: "Idadi inategemea niche, ubora wa maudhui na kiwango cha ushirikiano. Kwa wastani, wanachama wa mpango wa Pro hupata zaidi ya wafuasi 4,000 halisi kwa mwezi." },
  { q: "Sera ya kurudishiwa pesa ni gani?", a: "Tuna uhakika na huduma yetu. Ikiwa hutakuwa na ukuaji chanya baada ya siku 7 za usajili, tunarudisha pesa zote bila maswali. Timu yetu iko tayari kukusaidia wakati wowote." },
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
          <div className="pill pill-soft"><Star size={13} fill="currentColor" className="pill-star" /> 4.98/5, watumiaji 58,980+</div>
          <h1>Pata <span className="gradient-text">wafuasi halisi</span> wa Instagram kwa kutumia <span className="underlined">AI</span>.</h1>
          <p className="hero-lead">Weka jina lako la mtumiaji la Instagram uanze bure. Folowaz huwafikia watu wanaopenda kile unachoshiriki, bila boti, bila wafuasi bandia na bila nenosiri.</p>
          <form className="hero-form" onSubmit={submit}>
            <div className="input-wrap">
              <span className="at-sign">@</span>
              <input type="text" value={username} onChange={(event) => setUsername(event.target.value)} placeholder="jina-lako-la-instagram" aria-label="Jina la mtumiaji la Instagram" required autoComplete="off" />
            </div>
            <button type="submit" className="btn btn-primary btn-lg">Anza kukua bure <ArrowRight size={17} /></button>
          </form>
          <p className="form-note">Hakuna kadi ya mkopo inayohitajika. Ukuaji wa uhakika au kurudishiwa pesa</p>
          <div className="hero-social-proof">
            <div className="avatars" aria-hidden="true">
              <span className="avatar avatar-1">A</span><span className="avatar avatar-2">M</span><span className="avatar avatar-3">J</span><span className="avatar avatar-4">S</span>
            </div>
            <div className="proof-text"><strong>58K+</strong> wateja, <strong>4.98/5</strong> kwa wastani</div>
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
              <div><strong>bi_amichelle</strong><span>Mtayarishaji wa maudhui</span></div>
            </div>
            <div className="profile-stats">
              <div><strong>790</strong><span>Machapisho</span></div>
              <div><strong>{followers.toLocaleString("en-US")}</strong><span>Wafuasi</span></div>
              <div><strong>301</strong><span>Unafuata</span></div>
            </div>
            <div className="photo-grid">
              <i className="tile tile-1" /><i className="tile tile-2" /><i className="tile tile-3" />
              <i className="tile tile-4" /><i className="tile tile-5" /><i className="tile tile-6" />
            </div>
            <div className="phone-bottom"><Home size={15} /><Search size={15} /><Plus size={15} /><Music2 size={15} /><Circle size={15} /></div>
          </div>
          <div className="floating-card card-growth">
            <div className="card-icon green"><TrendingUp size={18} /></div>
            <div><small>Wafuasi wapya leo</small><strong>+1,284</strong></div>
          </div>
          <div className="floating-card card-rating">
            <div className="card-icon gold"><Star size={18} fill="currentColor" /></div>
            <div><small>Makadirio</small><strong>4.98 / 5</strong></div>
          </div>
          <div className="floating-card card-live"><span className="live-dot" /> Ukuaji unaendelea 24/7</div>
        </div>
      </div>
      <div className="container hero-bottom-stats">
        <div><strong>58K+</strong><span>Matumizi halisi</span></div>
        <div><strong>100%</strong><span>Ukuaji wa uhakika</span></div>
        <div><strong>24/7</strong><span>Msaada wa barua pepe</span></div>
        <div><strong>2016</strong><span>Tumefanya kazi tangu</span></div>
      </div>
    </section>
  );
}

export function Logos() {
  const logos = ["PELOTON", "prime", "EREWHON", "KYLIE", "buzzfeed", "GYMSHARK", "dyson", "HOKA"];
  return (
    <section className="logos-section">
      <div className="container">
        <p className="logos-title">Wanaaminiwa na zaidi ya watumiaji 55,000+, mashirika na biashara</p>
        <div className="logo-row" aria-label="Chapa zinazotumia Folowaz">
          {logos.map((logo) => <span key={logo}>{logo}</span>)}
        </div>
      </div>
    </section>
  );
}

export function HowItWorks() {
  const tags = [{ icon: Shirt, label: "Mitindo" }, { icon: UtensilsCrossed, label: "Chakula" }, { icon: Dumbbell, label: "Mazoezi" }];
  const chips = [{ icon: MapPin, label: "Eneo" }, { icon: Cake, label: "Umri" }, { icon: Globe, label: "Lugha" }, { icon: Heart, label: "Maslahi" }];
  return (
    <section className="section" id="how-it-works">
      <div className="container">
        <div className="section-head center">
          <div className="pill pill-light">Njia rahisi zaidi</div>
          <h2>Kukua akaunti yako ya Instagram.<br /><span className="gradient-text">Njia yenye akili.</span></h2>
          <p>Bila boti. Bila barua taka. Bila hila. Watu halisi tu wanaovutiwa na kile unachofanya.</p>
        </div>
        <div className="steps-grid">
          <article className="step-card card-coral">
            <div className="step-label">HATUA YA 01</div>
            <h3>Wafuasi 100% halisi</h3>
            <p>Tumia mfumo wetu kuwafikia watu wanaofaa. Wafuasi wote ni halisi, wanaoshiriki na wanaopenda maudhui yako.</p>
            <div className="step-tags">{tags.map(({ icon: Icon, label }) => <span key={label}><Icon size={14} /> {label}</span>)}</div>
          </article>
          <article className="step-card card-violet">
            <div className="step-label">HATUA YA 02</div>
            <h3>Wanaoshiriki kikamilifu</h3>
            <p>Si idadi tu, ni ubora pia. Tunavutia watu wanaopenda kutoa maoni, kupenda na kutazama hadithi zako.</p>
            <div className="mini-profile">
              <span className="mini-avatar" />
              <div><strong>@bi_amichelle</strong><small>340,989 wafuasi</small></div>
              <span className="mini-up"><ArrowUpRight size={20} /></span>
            </div>
          </article>
          <article className="step-card card-pink">
            <div className="step-label">HATUA YA 03</div>
            <h3>AI yenye lengo mahususi</h3>
            <p>Acha AI yetu ivutie wafuasi kulingana na eneo, umri, jinsia, lugha, maslahi na vitambulisho, au iiruhusu ifanye kiotomatiki.</p>
            <div className="target-chips">{chips.map(({ icon: Icon, label }) => <span key={label}><Icon size={14} /> {label}</span>)}</div>
          </article>
        </div>
      </div>
    </section>
  );
}

export function Results() {
  const niches = [
    { icon: Globe, label: "Kusafiri" }, { icon: Dumbbell, label: "Mazoezi" }, { icon: UtensilsCrossed, label: "Chakula" },
    { icon: Shirt, label: "Mitindo" }, { icon: Sparkles, label: "Urembo" }, { icon: PawPrint, label: "Wanyama" },
    { icon: Palette, label: "Sanaa" }, { icon: Camera, label: "Upigaji picha" }, { icon: Music2, label: "Muziki" },
    { icon: Trophy, label: "Michezo" }, { icon: Gamepad2, label: "Michezo ya video" }, { icon: Briefcase, label: "Biashara" },
  ];
  const checks = ["Mifumo ya AI iliyojengewa uzoefu wa miaka 5+", "Muundo wa ukuaji unaofuata sheria za Instagram", "Ripoti za kina na uchanganuzi wa moja kwa moja"];
  return (
    <section className="section section-tint" id="results">
      <div className="container results-grid">
        <div className="results-copy">
          <div className="pill pill-light">Matokeo yetu</div>
          <h2>Ukuaji unaoonekana,<br />usio wa kubahatisha.</h2>
          <p>Tangu mwaka 2016, Folowaz imewasaidia zaidi ya watumiaji 100,000 wa Instagram kupata wafuasi halisi mara 10 haraka. Hakuna boti, hakuna barua taka, ukuaji salama na wa kuaminika.</p>
          <ul className="check-list">
            {checks.map((item) => <li key={item}><span className="check-icon"><Check size={13} /></span>{item}</li>)}
          </ul>
          <Link href="/signup" className="btn btn-dark">Anza bure <ArrowRight size={16} /></Link>
        </div>
        <div className="results-visual">
          <div className="result-card before">
            <span className="result-tag">KABLA</span>
            <div className="result-profile"><span className="result-avatar" /><strong>@jessicaolie</strong></div>
            <div className="result-number">12,480</div>
            <span className="result-caption">wafuasi</span>
          </div>
          <div className="result-arrow"><ArrowRight size={22} /></div>
          <div className="result-card after">
            <span className="result-tag">BAADA YA MIEZI 3</span>
            <div className="result-profile"><span className="result-avatar" /><strong>@jessicaolie</strong></div>
            <div className="result-number">214,908</div>
            <span className="result-caption">wafuasi halisi</span>
            <div className="result-badge"><TrendingUp size={14} /> +1,620%</div>
          </div>
        </div>
      </div>
      <div className="container niche-row" aria-label="Maeneo tunayofanya kazi">
        {niches.map(({ icon: Icon, label }) => <span key={label}><Icon size={15} /> {label}</span>)}
      </div>
    </section>
  );
}

export function Why() {
  const items = [
    { icon: Clock3, cls: "icon-violet", title: "Ukuaji wa kiotomatiki 24/7", text: "Furahia ukuaji na ushirikiano wa Instagram saa zote bila kuinua kidole. Mfumo wetu hufanya kazi kwa ajili yako mchana na usiku.", cta: "Anza bure", href: "/signup" },
    { icon: ShieldCheck, cls: "icon-pink", title: "Salama na imara", text: "Folowaz inafuata sheria za Instagram. Tangu 2016 tumewasaidia watu kupata mamilioni ya wafuasi kwa njia halisi, bila hatari ya akaunti kufungwa.", cta: "Anza bure", href: "/signup" },
    { icon: Lightbulb, cls: "icon-gold", title: "Okoa muda na pesa", text: "Folowaz inachukua nafasi ya timu nzima ya uuzaji wa mitandao. Weka mkazo kwenye biashara yako, sisi tujenge wafuasi wako.", cta: "Wasiliana nasi", href: "/msaada" },
  ];
  return (
    <section className="section" id="why">
      <div className="container">
        <div className="section-head center">
          <div className="pill pill-light">Kwa nini Folowaz?</div>
          <h2>Timu yako ya mitandao ya kijamii,<br />kwa <span className="gradient-text">90% chini ya gharama</span>.</h2>
          <p>Tunachanganya akili bandia, mamilioni ya mifumo ya ukuaji iliyothibitishwa, na uzoefu wa watu halisi kukuletea ukuaji wa kizazi kipya.</p>
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
        <button className="carousel-btn" onClick={() => go(-1)} aria-label="Vipengele vilivyotangulia"><ChevronLeft size={19} /></button>
        <span>{String(index + 1).padStart(2, "0")} / {String(items.length).padStart(2, "0")}</span>
        <button className="carousel-btn" onClick={() => go(1)} aria-label="Vipengele vinavyofuata"><ChevronRight size={19} /></button>
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
          <div className="pill pill-dark">Vipengele vya AI</div>
          <h2>Vimejaa vipengele vya AI<br />vya kukua <span className="gradient-text">haraka na kwa urahisi</span>.</h2>
          <p>Fungua uwezo wa matokeo ya haraka kwa ukuaji unaoendeshwa na AI na kusaidiwa na watu halisi.</p>
        </div>
        <Carousel
          items={features}
          renderItem={({ icon: Icon, title, text }, position) => (
            <article className="feature-card">
              <div className="feature-num">{String(position + 1).padStart(2, "0")} / 12</div>
              <div className="feature-emoji"><Icon size={26} /></div>
              <h3>{title}</h3>
              <p>{text}</p>
              <Link href="/signup">Anza bure <ArrowRight size={14} /></Link>
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
          <div className="pill pill-light">Maswali yanayoulizwa mara kwa mara</div>
          <h2>Una swali?<br />Tuna majibu.</h2>
          <p>Folowaz hukusaidia kupata wafuasi, kupendwa na maoni zaidi kwa njia ya haraka na salama.</p>
          <Link href="/signup" className="btn btn-primary">Anza bure <ArrowRight size={16} /></Link>
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
          <div className="pill pill-light">Bei na mipango</div>
          <h2>Wafuasi halisi, wanaofika<br /><span className="gradient-text">mara moja.</span></h2>
          <p>Imefanyiwa uaminifu na watumiaji 50,000+. Chagua mpango unaokufaa na uanze leo.</p>
        </div>
        <div className="pricing-grid">
          {plans.map((plan) => (
            <article className={`price-card ${plan.featured ? "featured" : ""}`} key={plan.name}>
              <div className="price-badge">{plan.badge}</div>
              <h3>{plan.name}</h3>
              <p className="price-desc">{plan.desc}</p>
              <div className="price"><span>$</span>{plan.price}<small>/mwezi</small></div>
              <p className="price-old">Badala ya {plan.old}</p>
              <ul>{plan.items.map((item) => <li key={item}><Check size={14} /> {item}</li>)}</ul>
              <Link href="/signup" className={`btn ${plan.featured ? "btn-primary" : "btn-outline"}`}>Chagua {plan.name} <ArrowRight size={15} /></Link>
            </article>
          ))}
        </div>
        <p className="pricing-note"><BadgeCheck size={15} /> Ukuaji wa uhakika au pesa zako zinarejeshwa. Hakuna kadi ya mkopo inayohitajika kuanza</p>
      </div>
    </section>
  );
}

export function Reviews() {
  return (
    <section className="section" id="reviews">
      <div className="container">
        <div className="section-head center">
          <div className="pill pill-light">Maoni halisi</div>
          <h2>Wanaaminiwa na zaidi ya wateja<br />55,000+ duniani kote.</h2>
          <p>Usichukue neno letu tu, angalia wateja wetu wanachosema.</p>
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
        <div className="reviews-rating"><strong>4.98</strong> / 5, kutoka maoni 58k</div>
      </div>
    </section>
  );
}

export function Guarantee() {
  const chips = ["100% ukuaji wa uhakika", "Msaada wa 24/7", "Hakuna boti wala wafuasi bandia"];
  return (
    <section className="section guarantee-section">
      <div className="container">
        <div className="guarantee-card">
          <div className="guarantee-orb"><Heart size={100} strokeWidth={1.3} fill="rgba(255,255,255,.25)" /></div>
          <div className="guarantee-content">
            <div className="pill pill-light"><LockKeyhole size={13} /> Ahadi yetu</div>
            <h2>Ukuaji wa uhakika<br />au pesa zako zinarejeshwa.</h2>
            <p>Tuna uhakika na kile tunachofanya. Ikiwa hutapata ukuaji chanya, tunarudisha pesa zote. Hakuna hila, hakuna masharti.</p>
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
        <h2>Anza ukuaji wako wa Instagram leo.<br /><span className="gradient-text">Pata wafuasi halisi, wanaoshiriki.</span></h2>
        <p>Acha kusisitizika na akaunti yako, mbinu zetu zimejaribiwa na kuleta matokeo ya haraka na ya uhakika.</p>
        <div className="final-rating"><Stars size={16} /> <span>4.98 / 5, kutoka maoni 58k</span></div>
        <div className="final-buttons">
          <Link href="/signup" className="btn btn-primary btn-lg">Anza bure <ArrowRight size={17} /></Link>
          <Link href="/bei" className="btn btn-outline btn-lg">Angalia bei <ArrowRight size={17} /></Link>
        </div>
      </div>
    </section>
  );
}
