"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

const ITEMS = [
  ["/admin", "📊", "Overview"],
  ["/admin/funnels", "🧭", "Funnels"],
  ["/admin/contacts", "👥", "Contacts"],
  ["/admin/orders", "💳", "Orders"],
  ["/admin/automations", "⚡", "Automations"],
  ["/admin/emails", "✉️", "Email Queue"],
  ["/admin/bookings", "📅", "Call Bookings"],
  ["/admin/coupons", "🏷️", "Coupons"],
] as const;

export function AdminNav() {
  const path = usePathname();
  return (
    <nav className="flex gap-1 overflow-x-auto px-3 pb-3 lg:flex-col lg:pb-0">
      {ITEMS.map(([href, icon, label]) => {
        const active = href === "/admin" ? path === href : path.startsWith(href);
        return (
          <Link key={href} href={href} className={`flex shrink-0 items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition ${active ? "bg-white/10 text-white" : "hover:bg-white/5 hover:text-white"}`}>
            <span>{icon}</span>{label}
          </Link>
        );
      })}
    </nav>
  );
}
