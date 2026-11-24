 "use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { LogIn, AtSign, Lock } from "lucide-react";
import AuthLayout from "../../components/layout/AuthLayout";
import { useStore } from "../../lib/store";

function LoginForm({ vendorOnly = false }) {
  const { login } = useStore();
  const router = useRouter();
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);

  async function submit(e) {
    e.preventDefault();
    setError("");
    setBusy(true);
    try {
      await login({
        email: e.currentTarget.email.value,
        password: e.currentTarget.password.value,
        vendorOnly,
      });
      router.push(vendorOnly ? "/vendor/portal" : "/dashboard");
    } catch (err) {
      setError(err.message);
    } finally {
      setBusy(false);
    }
  }

  return (
    <form onSubmit={submit} className="flex flex-col gap-5" noValidate>
      {error && (
        <p role="alert" className="rounded-lg bg-rose-50 px-4 py-3 text-sm text-rose-700">
          {error}
        </p>
      )}
      <label className="flex flex-col gap-2 text-sm font-medium text-slate-800">
        Email
        <div className="relative">
          <AtSign className="absolute left-3 top-3 text-slate-400" size={18} />
          <input
            name="email"
            type="email"
            required
            autoComplete="email"
            placeholder="Enter your email address"
            className="h-11 w-full rounded-lg border border-slate-300 pl-10 pr-3 outline-none focus:border-[#1a73e8] focus:ring-2 focus:ring-blue-100"
          />
        </div>
      </label>
      <label className="flex flex-col gap-2 text-sm font-medium text-slate-800">
        Password
        <div className="relative">
          <Lock className="absolute left-3 top-3 text-slate-400" size={18} />
          <input
            name="password"
            type="password"
            required
            minLength="6"
            autoComplete="current-password"
            placeholder="Enter your password"
            className="h-11 w-full rounded-lg border border-slate-300 pl-10 pr-3 outline-none focus:border-[#1a73e8] focus:ring-2 focus:ring-blue-100"
          />
        </div>
      </label>
      <div className="flex items-center justify-between">
        <label className="flex items-center gap-2 text-sm text-slate-700">
          <input name="remember" type="checkbox" className="accent-[#1a73e8]" />
          Remember me
        </label>
        <Link href="/forgot-password" className="text-sm font-medium text-[#1a73e8] hover:underline">
          Forgot your password?
        </Link>
      </div>
      <button
        disabled={busy}
        className="h-11 rounded-lg bg-[#1a73e8] text-sm font-semibold text-white hover:bg-blue-700 disabled:opacity-60"
      >
        {busy ? "Signing in…" : "Sign in"}
      </button>
      <p className="text-center text-xs capitalize text-slate-400">
        Enter Email and Password to login
      </p>
      {!vendorOnly && (
        <div className="text-center text-sm text-slate-500">
          New to ProCureX?{" "}
          <Link href="/signup" className="font-medium text-[#1a73e8] hover:underline">
            Create an account
          </Link>
        </div>
      )}
    </form>
  );
}

export default function LoginPage({ vendorOnly = false }) {
  return (
    <AuthLayout
      icon={LogIn}
      title={vendorOnly ? "Vendor sign in" : "Welcome back"}
      subtitle={vendorOnly ? "Access your supplier workspace" : "Sign in to your vendor management account"}
    >
      <LoginForm vendorOnly={vendorOnly} />
    </AuthLayout>
  );
}