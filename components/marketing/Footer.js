import Link from "next/link";
import { AtSign, Camera, Play } from "lucide-react";

const columns = [
  ["Bidhaa", [["Vipengele", "/vipengele"], ["Bei", "/bei"], ["Matokeo", "/matokeo"], ["Maoni", "/maoni"]]],
  ["Kampuni", [["Kuhusu sisi", "/kuhusu"], ["Maswali", "/maswali"], ["Jinsi inavyofanya kazi", "/jinsi-inavyofanya-kazi"], ["Msaada", "/msaada"]]],
  ["Akaunti", [["Ingia", "/login"], ["Jisajili", "/signup"], ["Dashibodi", "/dashboard"]]],
];

export default function Footer() {
  return (
    <footer className="site-footer">
      <div className="container footer-grid">
        <div className="footer-brand">
          <Link href="/" className="brand"><span className="brand-mark">f</span><span className="brand-name">Folowaz</span></Link>
          <p>Jukwaa la ukuaji wa Instagram linalotumia AI kukuletea wafuasi halisi, wanaolengwa na wanaoshiriki.</p>
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
        <span>© 2026 Folowaz. Haki zote zimehifadhiwa.</span>
        <span>Lugha: <strong>Kiswahili</strong></span>
      </div>
    </footer>
  );
}
