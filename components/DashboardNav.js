"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  AtSign, BarChart3, CreditCard, LayoutDashboard, Settings, Target,
} from "lucide-react";

const items = [
  ["/dashboard", LayoutDashboard, "Overview"],
  ["/dashboard/connect", AtSign, "Instagram account"],
  ["/dashboard/targeting", Target, "Targeting"],
  ["/dashboard/analytics", BarChart3, "Analytics"],
  ["/dashboard/billing", CreditCard, "Billing & plan"],
  ["/dashboard/settings", Settings, "Settings"],
];

export default function DashboardNav() {
  const pathname = usePathname();
  return (
    <nav>
      {items.map(([href, Icon, label]) => (
        <Link key={href} href={href} className={pathname === href ? "active" : ""}>
          <Icon size={17} />{label}
        </Link>
      ))}
    </nav>
  );
}
