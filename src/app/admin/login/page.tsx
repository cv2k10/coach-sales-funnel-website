"use client";

import { useActionState } from "react";
import { loginAction } from "../actions";

export default function AdminLogin() {
  const [state, action, pending] = useActionState(loginAction, undefined);
  return (
    <main className="grid min-h-screen place-items-center bg-gradient-to-br from-slate-950 via-indigo-950 to-violet-950 p-4">
      <form action={action} className="w-full max-w-sm rounded-3xl bg-white p-8 shadow-2xl">
        <span className="grid h-12 w-12 place-items-center rounded-2xl bg-gradient-to-br from-indigo-600 to-violet-600 text-xl font-black text-white">E</span>
        <h1 className="mt-5 text-2xl font-extrabold">Coach Dashboard</h1>
        <p className="mt-1 text-sm text-slate-500">Sign in to manage funnels, contacts & automations.</p>
        <input name="password" type="password" placeholder="Password" className="input mt-6" required autoFocus />
        {state?.error && <p className="mt-2 text-sm text-rose-600">{state.error}</p>}
        <button disabled={pending} className="btn-primary mt-4 w-full">{pending ? "Signing in…" : "Sign in"}</button>
        <p className="mt-4 text-center text-xs text-slate-400">Demo password: <code className="font-semibold text-slate-600">coach123</code> (set ADMIN_PASSWORD to change)</p>
      </form>
    </main>
  );
}
