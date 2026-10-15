import type { ReactNode } from "react";
import Link from "next/link";
import { requireAdmin } from "@/lib/admin-auth";
import { ensureSeed, processQueue } from "@/lib/automation";
import { logoutAction } from "../actions";
import { AdminNav } from "./nav";

export const dynamic = "force-dynamic";

export default async function DashLayout({ children }: { children: ReactNode }) {
  await requireAdmin();
  await ensureSeed();
  await processQueue(); // send any emails that became due
  return (
    <div className="min-h-screen bg-slate-50 lg:flex">
      <aside className="border-b border-slate-800 bg-slate-950 text-slate-300 lg:sticky lg:top-0 lg:h-screen lg:w-64 lg:shrink-0 lg:border-b-0">
        <div className="flex items-center justify-between px-5 py-4 lg:block lg:py-6">
          <Link href="/admin" className="flex items-center gap-2">
            <span className="grid h-9 w-9 place-items-center rounded-xl bg-gradient-to-br from-indigo-500 to-violet-600 font-black text-white">E</span>
            <span className="font-extrabold text-white">Funnel HQ</span>
          </Link>
          <form action={logoutAction} className="lg:hidden"><button className="text-xs text-slate-400">Log out</button></form>
        </div>
        <AdminNav />
        <div className="hidden px-5 pb-6 lg:absolute lg:bottom-0 lg:block lg:w-64">
          <Link href="/" target="_blank" className="block rounded-lg px-3 py-2 text-sm hover:bg-white/5">↗ View website</Link>
          <form action={logoutAction}><button className="w-full rounded-lg px-3 py-2 text-left text-sm hover:bg-white/5">⎋ Log out</button></form>
        </div>
      </aside>
      <main className="min-w-0 flex-1 p-4 sm:p-6 lg:p-8">{children}</main>
    </div>
  );
}
