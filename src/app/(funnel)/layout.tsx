import type { ReactNode } from "react";
import { FunnelHeader } from "@/components/site";
import { TrackView } from "@/components/client";
import { COACH } from "@/lib/catalog";

export default function FunnelLayout({ children }: { children: ReactNode }) {
  return (
    <div className="flex min-h-screen flex-col bg-slate-50">
      <FunnelHeader />
      <main className="flex-1">{children}</main>
      <footer className="border-t border-slate-200 bg-white py-6 text-center text-xs text-slate-500">
        © {new Date().getFullYear()} {COACH.brand} · Privacy · Terms · Results not typical.
      </footer>
      <TrackView />
    </div>
  );
}
