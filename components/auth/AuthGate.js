 "use client";

import { useEffect } from "react";
import { usePathname, useRouter } from "next/navigation";
import { useStore } from "../../lib/store";
import AppShell from "../dashboard/AppShell";

const PUBLIC_PATHS = ["/login", "/signup", "/vendor-login", "/forgot-password"];

export default function AuthGate({ children }) {
  const pathname = usePathname();
  const router = useRouter();
  const { user, ready } = useStore();
  const isPublic = PUBLIC_PATHS.includes(pathname);

  useEffect(() => {
    if (!ready) return;

    // Never bounce guests away from /login, /signup, /vendor-login, or /forgot-password
    if (!user && !isPublic) {
      router.replace("/login");
    }
  }, [ready, user, isPublic, router]);

  if (!ready) {
    return (
      <div className="grid min-h-screen place-items-center bg-[#f4f7fb] text-sm text-slate-500">
        Loading your workspace…
      </div>
    );
  }

  // Render auth pages (/login, /signup, etc.) directly without AppShell or /login redirect
  if (isPublic) {
    return <>{children}</>;
  }

  if (!user) return null;

  return (
    <>
      <AppShell />
      {children}
    </>
  );
}