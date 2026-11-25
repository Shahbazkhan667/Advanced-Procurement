 "use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { ArrowRight, Eye, EyeOff, UserPlus } from "lucide-react";
import { useStore } from "../../lib/store";

export default function SignupPage() {
  const router = useRouter();
  const store = useStore();

  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [role, setRole] = useState("employee");
  const [department, setDepartment] = useState("Engineering");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
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

    if (password.length < 8) {
      setError("Password must be at least 8 characters.");
      return;
    }
    if (password !== confirmPassword) {
      setError("Passwords do not match.");
      return;
    }

    setSubmitting(true);
    try {
      const fn = store.signup || store.register;
      const res = await fn?.({
        name: fullName.trim(),
        email: email.trim(),
        phone: phone.trim(),
        role,
        department,
        password,
      });
      if (res && res.ok === false) {
        setError(res.message || "Could not create account.");
        setSubmitting(false);
        return;
      }
      router.replace("/dashboard");
    } catch (err) {
      setError(err?.message || "Unable to create account. Please try again.");
      setSubmitting(false);
    }
  };

  return (
    <div className="flex min-h-screen bg-[#f3f5f8] text-slate-900">
      {/* Dark Left Rail */}
      <aside className="hidden w-60 shrink-0 flex-col justify-between border-r border-slate-800/90 bg-[#111827] p-5 text-slate-300 md:flex">
        <div>
          <div className="flex items-center gap-2.5 border-b border-slate-800/80 pb-4">
            <span className="grid size-8 place-items-center rounded-xl bg-[#1a73e8] text-sm font-bold text-white">
              P
            </span>
            <span className="text-base font-semibold tracking-tight text-white">ProCureX</span>
          </div>

          <p className="mt-6 px-2 text-[10px] font-semibold uppercase tracking-[0.13em] text-slate-500">
            Authentication
          </p>
          <nav className="mt-2 space-y-1 text-sm">
            <Link
              href="/login"
              className="flex items-center gap-2.5 rounded-xl px-2.5 py-2 text-slate-400 transition hover:bg-white/[0.06] hover:text-slate-100"
            >
              Sign In (Internal)
            </Link>
            <Link
              href="/vendor-login"
              className="flex items-center gap-2.5 rounded-xl px-2.5 py-2 text-slate-400 transition hover:bg-white/[0.06] hover:text-slate-100"
            >
              Vendor Sign In
            </Link>
          </nav>
        </div>

        <div className="grid size-9 place-items-center rounded-full bg-white/10 text-xs font-semibold text-slate-200">
          N
        </div>
      </aside>

      {/* Main Content Area */}
      <main className="flex flex-1 flex-col items-center justify-center bg-[#f3f5f8] px-4 py-10">
        <div className="mb-3 flex flex-col items-center text-center">
          <div className="grid size-11 place-items-center rounded-full bg-[#1a73e8] text-white shadow-xs">
            <UserPlus size={20} />
          </div>
          <h1 className="mt-3 text-3xl font-semibold tracking-tight text-slate-900">
            Create your account
          </h1>
          <p className="mt-1 text-sm text-slate-500">
            Get started with the ProCureX procurement workspace
          </p>
        </div>

        <section className="mt-4 w-full max-w-md rounded-2xl border border-slate-200/80 bg-white p-6 shadow-xs">
          {error && (
            <div
              role="alert"
              className="mb-4 rounded-xl border border-rose-200 bg-rose-50 px-3.5 py-2.5 text-xs font-medium text-rose-700"
            >
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <label className="flex flex-col gap-1.5 text-xs font-semibold text-slate-800">
              Full name
              <input
                type="text"
                required
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                placeholder="Your full name"
                className="h-10 w-full rounded-xl border border-slate-200 bg-[#f3f5f8]/70 px-3.5 text-sm font-normal text-slate-900 outline-none transition focus:border-[#1a73e8] focus:bg-white focus:ring-4 focus:ring-blue-100"
              />
            </label>

            <label className="flex flex-col gap-1.5 text-xs font-semibold text-slate-800">
              Work email
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="you@company.com"
                className="h-10 w-full rounded-xl border border-slate-200 bg-[#f3f5f8]/70 px-3.5 text-sm font-normal text-slate-900 outline-none transition focus:border-[#1a73e8] focus:bg-white focus:ring-4 focus:ring-blue-100"
              />
            </label>

            <label className="flex flex-col gap-1.5 text-xs font-semibold text-slate-800">
              Phone number
              <input
                type="tel"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                placeholder="+92 300 0000000"
                className="h-10 w-full rounded-xl border border-slate-200 bg-[#f3f5f8]/70 px-3.5 text-sm font-normal text-slate-900 outline-none transition focus:border-[#1a73e8] focus:bg-white focus:ring-4 focus:ring-blue-100"
              />
            </label>

            <div className="grid grid-cols-2 gap-3">
              <label className="flex flex-col gap-1.5 text-xs font-semibold text-slate-800">
                Account type
                <select
                  value={role}
                  onChange={(e) => setRole(e.target.value)}
                  className="h-10 w-full rounded-xl border border-slate-200 bg-[#f3f5f8]/70 px-3 text-sm font-normal text-slate-900 outline-none transition focus:border-[#1a73e8] focus:bg-white focus:ring-4 focus:ring-blue-100"
                >
                  <option value="employee">Employee</option>
                  <option value="department_manager">Department Manager</option>
                  <option value="procurement_officer">Procurement Officer</option>
                  <option value="finance_manager">Finance Manager</option>
                  <option value="vendor">Vendor</option>
                </select>
              </label>

              <label className="flex flex-col gap-1.5 text-xs font-semibold text-slate-800">
                Department
                <select
                  value={department}
                  onChange={(e) => setDepartment(e.target.value)}
                  className="h-10 w-full rounded-xl border border-slate-200 bg-[#f3f5f8]/70 px-3 text-sm font-normal text-slate-900 outline-none transition focus:border-[#1a73e8] focus:bg-white focus:ring-4 focus:ring-blue-100"
                >
                  <option>Engineering</option>
                  <option>Operations</option>
                  <option>Marketing</option>
                  <option>Finance</option>
                  <option>Administration</option>
                </select>
              </label>
            </div>

            <label className="flex flex-col gap-1.5 text-xs font-semibold text-slate-800">
              Password
              <div className="relative">
                <input
                  type={showPassword ? "text" : "password"}
                  required
                  minLength={8}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="At least 8 characters"
                  className="h-10 w-full rounded-xl border border-slate-200 bg-[#f3f5f8]/70 pl-3.5 pr-10 text-sm font-normal text-slate-900 outline-none transition focus:border-[#1a73e8] focus:bg-white focus:ring-4 focus:ring-blue-100"
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

            <label className="flex flex-col gap-1.5 text-xs font-semibold text-slate-800">
              Confirm password
              <input
                type={showPassword ? "text" : "password"}
                required
                minLength={8}
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                placeholder="Re-enter your password"
                className="h-10 w-full rounded-xl border border-slate-200 bg-[#f3f5f8]/70 px-3.5 text-sm font-normal text-slate-900 outline-none transition focus:border-[#1a73e8] focus:bg-white focus:ring-4 focus:ring-blue-100"
              />
            </label>

            <button
              type="submit"
              disabled={submitting}
              className="mt-1 inline-flex h-10 w-full cursor-pointer items-center justify-center gap-2 rounded-xl bg-[#1a73e8] px-4 text-sm font-semibold text-white transition hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-60"
            >
              <span>{submitting ? "Creating account…" : "Create account"}</span>
              {!submitting && <ArrowRight size={16} />}
            </button>
          </form>

          <p className="mt-4 text-center text-xs text-slate-500">
            Already registered?{" "}
            <Link href="/login" className="font-semibold text-[#1a73e8] hover:underline">
              Sign in
            </Link>
          </p>
        </section>
      </main>
    </div>
  );
}