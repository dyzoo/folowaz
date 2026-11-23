"use client";

import { useState } from "react";
import Link from "next/link";
import { ArrowRight, Menu, X } from "lucide-react";

const links = [
  ["Jinsi inavyofanya kazi", "/jinsi-inavyofanya-kazi"],
  ["Vipengele", "/vipengele"],
  ["Matokeo", "/matokeo"],
  ["Maoni", "/maoni"],
  ["Maswali", "/maswali"],
  ["Bei", "/bei"],
];

export default function Header() {
  const [open, setOpen] = useState(false);

  return (
    <header className="site-header" id="site-header">
      <div className="container header-inner">
        <Link href="/" className="brand" aria-label="Folowaz nyumbani">
          <span className="brand-mark">f</span>
          <span className="brand-name">Folowaz</span>
        </Link>
        <nav className={`main-nav ${open ? "open" : ""}`} aria-label="Menyu kuu">
          {links.map(([label, href]) => (
            <Link key={href} href={href} onClick={() => setOpen(false)}>{label}</Link>
          ))}
          <Link href="/signup" className="btn btn-primary btn-sm nav-cta" onClick={() => setOpen(false)}>
            Anza bure <ArrowRight size={15} />
          </Link>
        </nav>
        <button className="nav-toggle" onClick={() => setOpen(!open)} aria-label="Fungua menyu" aria-expanded={open}>
          {open ? <X size={22} /> : <Menu size={22} />}
        </button>
      </div>
    </header>
  );
}
