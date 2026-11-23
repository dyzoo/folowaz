"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  AtSign, BarChart3, CreditCard, LayoutDashboard, Settings, Target,
} from "lucide-react";

const items = [
  ["/dashboard", LayoutDashboard, "Muhtasari"],
  ["/dashboard/connect", AtSign, "Akaunti ya Instagram"],
  ["/dashboard/targeting", Target, "Ulengaji"],
  ["/dashboard/analytics", BarChart3, "Uchanganuzi"],
  ["/dashboard/billing", CreditCard, "Malipo na mpango"],
  ["/dashboard/settings", Settings, "Mipangilio"],
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
