import Link from "next/link";
import { redirect } from "next/navigation";
import { getSessionUser } from "@/lib/auth";
import { isDatabaseConfigured } from "@/lib/env";
import DashboardNav from "@/components/DashboardNav";
import LogoutButton from "@/components/LogoutButton";

export const dynamic = "force-dynamic";

export default async function DashboardLayout({ children }) {
  const user = isDatabaseConfigured ? await getSessionUser() : null;
  if (isDatabaseConfigured && !user) redirect("/login");

  const name = user?.full_name || user?.email?.split("@")[0] || "Mtumiaji";
  const email = user?.email || "user@folowaz.local";

  return (
    <div className="dashboard">
      <aside className="sidebar">
        <Link href="/" className="brand"><span className="brand-mark">f</span><span className="brand-name">Folowaz</span></Link>
        <DashboardNav />
        <div className="sidebar-bottom">
          <div className="sidebar-user">
            <span className="sidebar-avatar">{name.charAt(0).toUpperCase()}</span>
            <div><strong>{name}</strong><small>{email}</small></div>
          </div>
          <LogoutButton />
        </div>
      </aside>
      <div className="main">
        <header className="topbar">
          <h2>Jukwaa la Folowaz</h2>
          <div className="topbar-actions">
            <span className={`status-pill ${isDatabaseConfigured ? "" : "off"}`}>
              {isDatabaseConfigured ? "● Imeunganishwa" : "● Haijaunganishwa"}
            </span>
            <Link href="/">Angalia tovuti ↗</Link>
          </div>
        </header>
        <div className="content">{children}</div>
      </div>
    </div>
  );
}
