"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { ArrowRight, Eye, EyeOff, Lock, Mail, ShieldCheck, Sparkles } from "lucide-react";
import { useStore } from "../../lib/store";

export default function LoginPage() {
  const router = useRouter();
  const store = useStore();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [remember, setRemember] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    if (store.ready && store.user) {
      router.replace("/dashboard");
    }
  }, [store.ready, store.user, router]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (submitting) return;
    setError("");
    setSubmitting(true);

    try {
      const res = await store.login?.({ email: email.trim(), password, remember });
      if (res && res.ok === false) {
        setError(res.message || "Invalid email or password.");
        setSubmitting(false);
        return;
      }
      router.replace("/dashboard");
    } catch (err) {
      setError(err?.message || "Unable to sign in. Please check your credentials.");
      setSubmitting(false);
    }
  };

  return (
    <div className="flex min-h-screen flex-col justify-between bg-[#f3f5f8] text-slate-900">
      <header className="flex h-16 items-center justify-between border-b border-slate-200/80 bg-white/95 px-4 backdrop-blur sm:px-8">
        <Link href="/login" className="flex items-center gap-2.5">
          <span className="grid size-8 place-items-center rounded-xl bg-[#1a73e8] text-[17px] font-bold text-white shadow-2xs">
            P
          </span>
          <span className="text-base font-semibold tracking-tight text-slate-900">
            pro<span className="text-[#1a73e8]">cure</span>x
          </span>
          <span className="hidden rounded-md bg-[#111827] px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wider text-slate-200 sm:inline-block">
            Workspace
          </span>
        </Link>

        <div className="flex items-center gap-3 text-xs sm:text-sm">
          <span className="hidden text-slate-500 sm:inline">New to ProCureX?</span>
          <Link
            href="/signup"
            className="inline-flex h-9 items-center gap-1.5 rounded-xl border border-slate-200 bg-white px-3.5 text-xs font-semibold text-slate-700 shadow-2xs transition hover:border-slate-300 hover:bg-slate-50"
          >
            Create account
          </Link>
        </div>
      </header>

      <main className="mx-auto flex w-full max-w-5xl flex-1 items-center px-4 py-8 sm:px-6">
        <div className="grid w-full items-stretch gap-6 lg:min-h-[560px] lg:grid-cols-2">
          {/* Left Dark Panel */}
          <div className="hidden flex-col justify-between rounded-2xl border border-slate-800/90 bg-[#111827] p-8 text-slate-200 shadow-sm lg:flex">
            <div>
              <div className="inline-flex items-center gap-2 rounded-full bg-white/10 px-3 py-1 text-xs font-medium text-blue-300">
                <Sparkles size={14} className="text-blue-400" />
                PKR Spend & Supplier Control
              </div>

              <h1 className="mt-6 text-3xl font-semibold leading-tight tracking-tight text-white">
                Procurement workflows, approvals, and spend in one place.
              </h1>

              <p className="mt-3 text-sm leading-6 text-slate-400">
                Sign in to manage purchase requests, compare supplier quotes, track purchase orders,
                and monitor department budgets across your organization.
              </p>
            </div>

            <div className="mt-8 space-y-3 border-t border-slate-800/80 pt-6 text-xs text-slate-300">
              <div className="flex items-center gap-3 rounded-xl bg-white/[0.04] p-3">
                <span className="grid size-8 shrink-0 place-items-center rounded-lg bg-[#1a73e8]/20 text-blue-300">
                  <ShieldCheck size={16} />
                </span>
                <div>
                  <p className="font-semibold text-white">Role-based workspace access</p>
                  <p className="text-slate-400">
                    Tailored views for employees, managers, finance, and vendors.
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Right Form Card */}
          <section className="flex w-full flex-col justify-between rounded-2xl border border-slate-200/80 bg-white p-6 shadow-xs sm:p-8">
            <div>
              <div className="mb-6">
                <p className="text-xs font-semibold uppercase tracking-wider text-[#1a73e8]">
                  Sign in
                </p>
                <h2 className="mt-1 text-2xl font-semibold tracking-tight text-slate-900">
                  Welcome back
                </h2>
                <p className="mt-1 text-sm text-slate-500">
                  Enter your work credentials to access your ProCureX workspace.
                </p>
              </div>

              {error && (
                <div
                  role="alert"
                  className="mb-4 rounded-xl border border-rose-200 bg-rose-50 px-3.5 py-2.5 text-xs font-medium text-rose-700"
                >
                  {error}
                </div>
              )}

              <form onSubmit={handleSubmit} className="space-y-4">
                <label className="flex flex-col gap-1.5 text-xs font-semibold text-slate-700">
                  Work email
                  <div className="relative">
                    <Mail
                      size={16}
                      className="pointer-events-none absolute left-3.5 top-3 text-slate-400"
                    />
                    <input
                      type="email"
                      required
                      autoComplete="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="name@company.com"
                      className="h-10 w-full rounded-xl border border-slate-200 bg-[#f3f5f8]/70 pl-10 pr-3.5 text-sm font-normal text-slate-900 outline-none transition focus:border-[#1a73e8] focus:bg-white focus:ring-4 focus:ring-blue-100"
                    />
                  </div>
                </label>

                <label className="flex flex-col gap-1.5 text-xs font-semibold text-slate-700">
                  Password
                  <div className="relative">
                    <Lock
                      size={16}
                      className="pointer-events-none absolute left-3.5 top-3 text-slate-400"
                    />
                    <input
                      type={showPassword ? "text" : "password"}
                      required
                      autoComplete="current-password"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      placeholder="Enter your password"
                      className="h-10 w-full rounded-xl border border-slate-200 bg-[#f3f5f8]/70 pl-10 pr-10 text-sm font-normal text-slate-900 outline-none transition focus:border-[#1a73e8] focus:bg-white focus:ring-4 focus:ring-blue-100"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword((prev) => !prev)}
                      aria-label={showPassword ? "Hide password" : "Show password"}
                      className="absolute right-2.5 top-2 cursor-pointer rounded-lg p-1 text-slate-400 transition hover:bg-slate-100 hover:text-slate-700"
                    >
                      {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                    </button>
                  </div>
                </label>

                <div className="flex items-center justify-between pt-0.5 text-xs">
                  <label className="flex cursor-pointer items-center gap-2 font-medium text-slate-600">
                    <input
                      type="checkbox"
                      checked={remember}
                      onChange={(e) => setRemember(e.target.checked)}
                      className="size-4 cursor-pointer rounded accent-[#1a73e8]"
                    />
                    Remember this device
                  </label>

                  <Link
                    href="/forgot-password"
                    className="font-semibold text-[#1a73e8] hover:underline"
                  >
                    Forgot password?
                  </Link>
                </div>

                <button
                  type="submit"
                  disabled={submitting}
                  className="mt-2 inline-flex h-10 w-full cursor-pointer items-center justify-center gap-2 rounded-xl bg-[#1a73e8] px-4 text-sm font-semibold text-white shadow-xs transition hover:bg-blue-700 active:scale-[0.99] disabled:cursor-not-allowed disabled:opacity-60"
                >
                  <span>{submitting ? "Signing in…" : "Sign in"}</span>
                  {!submitting && <ArrowRight size={16} />}
                </button>
              </form>
            </div>

            <div className="mt-6 flex flex-wrap items-center justify-between gap-2 border-t border-slate-100 pt-5 text-xs text-slate-500">
              <span>
                Supplier account?{" "}
                <Link href="/vendor-login" className="font-semibold text-[#1a73e8] hover:underline">
                  Vendor sign in
                </Link>
              </span>
              <span>
                Need an account?{" "}
                <Link href="/signup" className="font-semibold text-[#1a73e8] hover:underline">
                  Create account
                </Link>
              </span>
            </div>
          </section>
        </div>
      </main>

      <footer className="border-t border-slate-200/80 px-5 py-3 text-center text-[11px] text-slate-400 sm:px-8">
        © 2026 ProCureX, Inc. · All rights reserved
      </footer>
    </div>
  );
}