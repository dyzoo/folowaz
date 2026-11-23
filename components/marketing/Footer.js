import Link from "next/link";
import { AtSign, Camera, Play } from "lucide-react";

const columns = [
  ["Product", [["Features", "/vipengele"], ["Pricing", "/bei"], ["Results", "/matokeo"], ["Reviews", "/maoni"]]],
  ["Company", [["About us", "/kuhusu"], ["FAQ", "/maswali"], ["How it works", "/jinsi-inavyofanya-kazi"], ["Support", "/msaada"]]],
  ["Account", [["Sign in", "/login"], ["Sign up", "/signup"], ["Dashboard", "/dashboard"]]],
];

export default function Footer() {
  return (
    <footer className="site-footer">
      <div className="container footer-grid">
        <div className="footer-brand">
          <Link href="/" className="brand"><span className="brand-mark">f</span><span className="brand-name">Folowaz</span></Link>
          <p>An AI-powered Instagram growth platform that brings you real, targeted, and engaged followers.</p>
          <div className="footer-social">
            <Link href="/" aria-label="X"><AtSign size={16} /></Link>
            <Link href="/" aria-label="YouTube"><Play size={16} /></Link>
            <Link href="/" aria-label="Instagram"><Camera size={16} /></Link>
          </div>
        </div>
        {columns.map(([title, links]) => (
          <div key={title}>
            <h4>{title}</h4>
            {links.map(([label, href]) => <Link href={href} key={label}>{label}</Link>)}
          </div>
        ))}
      </div>
      <div className="container footer-bottom">
        <span>© 2026 Folowaz. All rights reserved.</span>
        <span>Language: <strong>English</strong></span>
      </div>
    </footer>
  );
}
