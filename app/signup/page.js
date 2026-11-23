"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { UserPlus } from "lucide-react";
import AuthLayout from "../../components/layout/AuthLayout";
import { useStore } from "../../lib/store";
export default function SignupPage() {
  const { signup } = useStore();
  const router = useRouter();
  const [error, setError] = useState("");
  async function submit(e) {
    e.preventDefault();
    setError("");
    const data = new FormData(e.currentTarget);
    if (data.get("password") !== data.get("confirm")) {
      setError("Passwords do not match.");
      return;
    }
    try {
      await signup({
        name: data.get("name"),
        email: data.get("email"),
        password: data.get("password"),
        role: "employee",
        department: data.get("department"),
      });
      router.push("/dashboard");
    } catch (err) {
      setError(err.message);
    }
  }
  return (
    <AuthLayout
      icon={UserPlus}
      title="Create your account"
      subtitle="Get started with the ProCureX procurement workspace"
    >
      <form onSubmit={submit} className="flex flex-col gap-4">
        <label className="grid gap-2 text-sm font-medium">
          Full name
          <input
            name="name"
            required
            minLength="2"
            placeholder="Your name"
            className="h-11 rounded-lg border border-slate-300 px-3 outline-none focus:border-[#1a73e8]"
          />
        </label>
        <label className="grid gap-2 text-sm font-medium">
          Work email
          <input
            name="email"
            type="email"
            required
            placeholder="you@company.com"
            className="h-11 rounded-lg border border-slate-300 px-3 outline-none focus:border-[#1a73e8]"
          />
        </label>
        <label className="grid gap-2 text-sm font-medium">
          Department
          <select
            name="department"
            className="h-11 rounded-lg border border-slate-300 bg-white px-3"
          >
            <option>Engineering</option>
            <option>Operations</option>
            <option>Marketing</option>
            <option>Finance</option>
            <option>Administration</option>
          </select>
        </label>
        <label className="grid gap-2 text-sm font-medium">
          Password
          <input
            name="password"
            type="password"
            required
            minLength="8"
            placeholder="At least 8 characters"
            className="h-11 rounded-lg border border-slate-300 px-3 outline-none focus:border-[#1a73e8]"
          />
        </label>
        <label className="grid gap-2 text-sm font-medium">
          Confirm password
          <input
            name="confirm"
            type="password"
            required
            minLength="8"
            placeholder="Re-enter your password"
            className="h-11 rounded-lg border border-slate-300 px-3 outline-none focus:border-[#1a73e8]"
          />
        </label>
        {error && (
          <p role="alert" className="text-sm text-rose-600">
            {error}
          </p>
        )}
        <button className="h-11 rounded-lg bg-[#1a73e8] font-semibold text-white hover:bg-blue-700">
          Create account
        </button>
        <p className="text-center text-sm text-slate-500">
          Already registered?{" "}
          <Link href="/login" className="font-medium text-[#1a73e8]">
            Sign in
          </Link>
        </p>
      </form>
    </AuthLayout>
  );
}
