 "use client";

import { createContext, useContext, useEffect, useMemo, useState } from "react";
import { seedUsers, seedVendors, seedRequests, seedPurchaseOrders } from "./mockData";
import { loginUser, getCurrentUser, logoutUser } from "../services/authService";
import { getToken, setToken } from "../services/api";

const KEY = "procurex_app_v1";

const initial = {
  user: null,
  role: "admin",
  users: seedUsers,
  credentials: {},
  vendors: seedVendors,
  requests: seedRequests,
  purchaseOrders: seedPurchaseOrders,
  rfqs: [],
  quotations: [],
  recommendations: {},
  settings: {
    organization: "Acme Corporation",
    email: "procurement@acme.com",
    industry: "Technology",
    fiscalYear: "January",
    address: "100 Market Street, San Francisco, CA",
    emailNotifications: true,
    approvalReminders: true,
    weeklyDigest: false,
  },
  departments: [
    "Engineering",
    "Operations",
    "Marketing",
    "Finance",
    "Administration",
    "Procurement",
  ],
  notifications: [
    {
      id: "n1",
      title: "Request needs your review",
      detail: "PR-2026-041 · Laptops for engineering team",
      time: "12 min ago",
      read: false,
    },
    {
      id: "n2",
      title: "Quotation received",
      detail: "Techno Supplies Ltd · RFQ-2026-023",
      time: "1 hour ago",
      read: false,
    },
    {
      id: "n3",
      title: "Purchase order dispatched",
      detail: "PO-2026-018 · Office Essentials Co.",
      time: "Yesterday",
      read: true,
    },
  ],
};

const StoreContext = createContext(null);

export function StoreProvider({ children }) {
  const [state, setState] = useState(initial);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    async function initSession() {
      try {
        const saved = localStorage.getItem(KEY);
        if (saved) {
          setState((prev) => ({ ...prev, ...JSON.parse(saved) }));
        }

        if (getToken()) {
          const backendUser = await getCurrentUser();
          if (backendUser) {
            setState((s) => ({
              ...s,
              user: backendUser,
              role: backendUser.role || s.role,
            }));
          }
        }
      } catch {
        setToken(null);
        setState((s) => ({ ...s, user: null }));
      } finally {
        setReady(true);
      }
    }

    initSession();
  }, []);

  useEffect(() => {
    if (ready) {
      try {
        localStorage.setItem(KEY, JSON.stringify(state));
      } catch {}
    }
  }, [state, ready]);

  const actions = useMemo(
    () => ({
      setRole: (role) =>
        setState((s) => ({
          ...s,
          role,
          user: s.user ? { ...s.user, role } : s.user,
        })),

      login: async ({ email, password, vendorOnly }) => {
        const { user } = await loginUser({ email, password });

        if (!user || (user.status && user.status !== "Active")) {
          await logoutUser();
          throw new Error("We couldn’t find an active account with those details.");
        }

        if (vendorOnly && user.role !== "vendor") {
          await logoutUser();
          throw new Error("Please use a Vendor account to sign in here.");
        }

        setState((s) => ({
          ...s,
          user,
          role: user.role || s.role,
        }));

        return user;
      },

      signup: async (data) => {
        const normalized = data.email.trim().toLowerCase();
        if (state.users.some((u) => u.email.toLowerCase() === normalized)) {
          throw new Error("An account with this email already exists.");
        }

        const bytes = await crypto.subtle.digest(
          "SHA-256",
          new TextEncoder().encode(data.password)
        );
        const passwordHash = Array.from(new Uint8Array(bytes), (b) =>
          b.toString(16).padStart(2, "0")
        ).join("");

        const user = {
          id: `u${Date.now()}`,
          name: data.name.trim(),
          email: normalized,
          role: "employee",
          department: data.department,
          status: "Active",
        };

        setState((s) => ({
          ...s,
          users: [user, ...s.users],
          credentials: { ...s.credentials, [normalized]: passwordHash },
          user,
          role: user.role,
        }));

        return user;
      },

      logout: async () => {
        await logoutUser();
        setState((s) => ({ ...s, user: null }));
      },

      addUser: (user) =>
        setState((s) => ({
          ...s,
          users: [{ ...user, id: `u${Date.now()}`, status: "Active" }, ...s.users],
        })),

      updateUser: (id, patch) =>
        setState((s) => ({
          ...s,
          users: s.users.map((u) => (u.id === id ? { ...u, ...patch } : u)),
        })),

      deleteUser: (id) =>
        setState((s) => ({
          ...s,
          users: s.users.filter((u) => u.id !== id),
        })),

      addVendor: (vendor) =>
        setState((s) => ({
          ...s,
          vendors: [
            { ...vendor, id: `v${Date.now()}`, rating: 0, spend: 0, delivery: 0, status: "Active" },
            ...s.vendors,
          ],
        })),

      updateVendor: (id, patch) =>
        setState((s) => ({
          ...s,
          vendors: s.vendors.map((v) => (v.id === id ? { ...v, ...patch } : v)),
        })),

      deleteVendor: (id) =>
        setState((s) => ({
          ...s,
          vendors: s.vendors.filter((v) => v.id !== id),
        })),

      addRFQ: (rfq) =>
        setState((s) => ({
          ...s,
          rfqs: [
            {
              ...rfq,
              id: `RFQ-2026-${String(25 + s.rfqs.length).padStart(3, "0")}`,
              status: "Open",
              createdAt: new Date().toISOString().slice(0, 10),
            },
            ...s.rfqs,
          ],
        })),

      updateRFQ: (id, patch) =>
        setState((s) => ({
          ...s,
          rfqs: s.rfqs.map((r) => (r.id === id ? { ...r, ...patch } : r)),
        })),

      addQuotation: (quote) =>
        setState((s) => ({
          ...s,
          quotations: [
            {
              ...quote,
              id: `QT-${Date.now()}`,
              submittedAt: new Date().toISOString().slice(0, 10),
            },
            ...s.quotations,
          ],
        })),

      updateQuotation: (id, patch) =>
        setState((s) => ({
          ...s,
          quotations: s.quotations.map((q) => (q.id === id ? { ...q, ...patch } : q)),
        })),

      saveRecommendation: (key, value) =>
        setState((s) => ({
          ...s,
          recommendations: { ...s.recommendations, [key]: value },
        })),

      updateSettings: (patch) =>
        setState((s) => ({
          ...s,
          settings: { ...s.settings, ...patch },
        })),

      addDepartment: (name) =>
        setState((s) =>
          s.departments.includes(name) ? s : { ...s, departments: [...s.departments, name] }
        ),

      removeDepartment: (name) =>
        setState((s) => ({
          ...s,
          departments: s.departments.filter((x) => x !== name),
        })),

      addRequest: (request) =>
        setState((s) => ({
          ...s,
          requests: [
            {
              ...request,
              id: `PR-2026-${String(42 + s.requests.length).padStart(3, "0")}`,
              date: new Date().toISOString().slice(0, 10),
            },
            ...s.requests,
          ],
        })),

      updateRequest: (id, patch) =>
        setState((s) => ({
          ...s,
          requests: s.requests.map((r) => (r.id === id ? { ...r, ...patch } : r)),
        })),

      addPO: (po) =>
        setState((s) => ({
          ...s,
          purchaseOrders: [
            {
              ...po,
              id: `PO-2026-${String(19 + s.purchaseOrders.length).padStart(3, "0")}`,
              date: new Date().toISOString().slice(0, 10),
            },
            ...s.purchaseOrders,
          ],
        })),

      updatePO: (id, patch) =>
        setState((s) => ({
          ...s,
          purchaseOrders: s.purchaseOrders.map((p) => (p.id === id ? { ...p, ...patch } : p)),
        })),

      markRead: (id) =>
        setState((s) => ({
          ...s,
          notifications: s.notifications.map((n) => (n.id === id ? { ...n, read: true } : n)),
        })),

      markAllRead: () =>
        setState((s) => ({
          ...s,
          notifications: s.notifications.map((n) => ({ ...n, read: true })),
        })),

      addNotification: (n) =>
        setState((s) => ({
          ...s,
          notifications: [
            { id: `n${Date.now()}`, time: "Just now", read: false, ...n },
            ...s.notifications,
          ],
        })),
    }),
    [state.users, state.credentials]
  );

  return (
    <StoreContext.Provider value={{ ...state, ...actions, ready }}>
      {children}
    </StoreContext.Provider>
  );
}

export function useStore() {
  const value = useContext(StoreContext);
  if (!value) throw new Error("useStore must be used inside StoreProvider");
  return value;
}

export const roles = [
  "admin",
  "employee",
  "department_manager",
  "procurement_officer",
  "finance_manager",
  "director",
  "vendor",
];

export const roleLabels = {
  admin: "Administrator",
  employee: "Employee",
  department_manager: "Department Manager",
  procurement_officer: "Procurement Officer",
  finance_manager: "Finance Manager",
  director: "Director",
  vendor: "Vendor",
};