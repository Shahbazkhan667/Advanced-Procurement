"use client";
import { useState } from "react";
import Link from "next/link";
import { Mail } from "lucide-react";
import AuthLayout from "../../components/layout/AuthLayout";
export default function ForgotPasswordPage() {
  const [sent, setSent] = useState(false);
  function submit(e) {
    e.preventDefault();
    setSent(true);
  }
  return (
    <AuthLayout
      icon={Mail}
      title="Reset your password"
      subtitle="Password reset email is not connected in this local demo"
    >
      <form onSubmit={submit} className="flex flex-col gap-5">
        {sent ? (
          <div
            role="status"
            className="rounded-lg bg-emerald-50 p-4 text-sm text-emerald-800"
          >
            This demo recorded your request locally, but no email was sent.
            Please contact your workspace administrator.
          </div>
        ) : (
          <>
            <label className="grid gap-2 text-sm font-medium">
              Email address
              <input
                name="email"
                type="email"
                required
                className="h-11 rounded-lg border border-slate-300 px-3 outline-none focus:border-[#1a73e8]"
                placeholder="you@company.com"
              />
            </label>
            <button className="h-11 rounded-lg bg-[#1a73e8] font-semibold text-white hover:bg-blue-700">
              Send reset link
            </button>
          </>
        )}
        <Link
          href="/login"
          className="text-center text-sm font-medium text-[#1a73e8]"
        >
          Back to sign in
        </Link>
      </form>
    </AuthLayout>
  );
}
