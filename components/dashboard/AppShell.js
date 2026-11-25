 "use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useEffect, useMemo, useState } from "react";
import { useStore } from "../../lib/store";
import {
  Activity,
  AlertCircle,
  ArrowDownToLine,
  ArrowLeftRight,
  ArrowUpRight,
  BarChart3,
  Bell,
  Boxes,
  Building2,
  Check,
  ChevronDown,
  ChevronRight,
  ClipboardCheck,
  ClipboardList,
  Clock3,
  FileBarChart,
  FileCheck2,
  FileClock,
  FileText,
  Filter,
  FolderKanban,
  Globe2,
  Inbox,
  LayoutDashboard,
  LifeBuoy,
  LogOut,
  Menu,
  MoreHorizontal,
  Package,
  Plus,
  Receipt,
  Search,
  Settings,
  ShieldCheck,
  ShoppingCart,
  Sparkles,
  UserRound,
  Users,
  Wallet,
  X,
} from "lucide-react";
import {
  Area,
  AreaChart,
  Bar,
  BarChart,
  CartesianGrid,
  Legend,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import { roleLabels, spendTrend } from "../../lib/mockData";

const PUBLIC_AUTH_PATHS = ["/login", "/signup", "/vendor-login", "/forgot-password"];

const sections = [
  {
    title: "Workspace",
    items: [
      { key: "dashboard", label: "Dashboard", icon: LayoutDashboard },
      { key: "purchase-requests", label: "Purchase requests", icon: ClipboardList, badge: "4" },
      { key: "approvals", label: "Approvals", icon: ClipboardCheck, badge: "3" },
    ],
  },
  {
    title: "Sourcing",
    items: [
      { key: "vendors", label: "Vendors", icon: Building2 },
      { key: "quotations", label: "Quotations", icon: FileClock },
      { key: "comparison", label: "Quote comparison", icon: ArrowLeftRight },
      { key: "vendor-portal", label: "Vendor portal", icon: Globe2 },
      { key: "rfqs", label: "Requests for quote", icon: FileText },
      { key: "purchase-orders", label: "Purchase orders", icon: ShoppingCart },
      { key: "contracts", label: "Contracts", icon: FileCheck2 },
    ],
  },
  {
    title: "Operations",
    items: [
      { key: "catalog", label: "Catalog", icon: Boxes },
      { key: "invoices", label: "Invoices", icon: Receipt },
      { key: "receiving", label: "Receiving", icon: Package },
      { key: "budgets", label: "Budgets", icon: Wallet },
    ],
  },
  {
    title: "Insights & admin",
    items: [
      { key: "analytics", label: "Analytics", icon: BarChart3 },
      { key: "reports", label: "Reports", icon: FileBarChart },
      { key: "users", label: "Users & roles", icon: Users },
      { key: "settings", label: "Settings", icon: Settings },
    ],
  },
];

const pageTitles = {
  dashboard: "Dashboard",
  "purchase-requests": "Purchase requests",
  approvals: "Approvals",
  vendors: "Vendors",
  rfqs: "Requests for quote",
  "purchase-orders": "Purchase orders",
  contracts: "Contracts",
  catalog: "Catalog",
  invoices: "Invoices",
  receiving: "Receiving",
  budgets: "Budgets",
  analytics: "Analytics",
  reports: "Reports",
  quotations: "Quotations",
  comparison: "Quote comparison",
  "vendor-portal": "Vendor portal",
  users: "Users & roles",
  settings: "Settings",
  notifications: "Notifications",
  help: "Help center",
};

const fmt = (n) =>
  new Intl.NumberFormat("en-PK", {
    style: "currency",
    currency: "PKR",
    maximumFractionDigits: 0,
  }).format(Number(n) || 0);

function Status({ value }) {
  const lower = String(value || "").toLowerCase();
  const cls =
    lower.includes("pend") || lower.includes("hold") || lower.includes("risk")
      ? "bg-amber-50 text-amber-700 ring-1 ring-amber-200/80"
      : lower.includes("approv") ||
          lower.includes("active") ||
          lower.includes("complet") ||
          lower.includes("paid") ||
          lower.includes("track") ||
          lower.includes("in stock")
        ? "bg-emerald-50 text-emerald-700 ring-1 ring-emerald-200/80"
        : lower.includes("reject") || lower.includes("overdue") || lower.includes("low")
          ? "bg-rose-50 text-rose-700 ring-1 ring-rose-200/80"
          : "bg-blue-50 text-[#1a73e8] ring-1 ring-blue-200/80";

  return (
    <span className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-0.5 text-xs font-medium ${cls}`}>
      <span className="size-1.5 rounded-full bg-current" />
      {value}
    </span>
  );
}

function IconButton({ children, label, onClick }) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-label={label}
      className="grid size-9 cursor-pointer place-items-center rounded-xl text-slate-500 transition hover:bg-slate-100 hover:text-slate-900 active:scale-95"
    >
      {children}
    </button>
  );
}

function PageHeader({ title, eyebrow, description, action }) {
  return (
    <div className="mb-6 flex flex-wrap items-end justify-between gap-4">
      <div>
        <div className="mb-1 text-xs font-semibold uppercase tracking-wider text-[#1a73e8]">
          {eyebrow || "Procurement Workspace"}
        </div>
        <h1 className="text-2xl font-semibold tracking-tight text-slate-900 sm:text-[28px]">
          {title}
        </h1>
        {description && <p className="mt-1 text-sm text-slate-500">{description}</p>}
      </div>
      {action}
    </div>
  );
}

function Button({ children, onClick, variant = "primary", icon: Icon, type = "button" }) {
  const styles =
    variant === "primary"
      ? "bg-[#1a73e8] text-white shadow-xs hover:bg-blue-700 active:scale-[0.99]"
      : variant === "outline"
        ? "border border-slate-200/90 bg-white text-slate-700 shadow-2xs hover:border-slate-300 hover:bg-slate-50 active:scale-[0.99]"
        : "text-slate-600 hover:bg-slate-100";

  return (
    <button
      type={type}
      onClick={onClick}
      className={`inline-flex h-10 cursor-pointer items-center gap-2 rounded-xl px-4 text-sm font-medium transition ${styles}`}
    >
      {Icon && <Icon size={16} />}
      {children}
    </button>
  );
}

function MetricCard({ label, value, change, icon: Icon, detail, onClick }) {
  return (
    <article
      onClick={onClick}
      className={`group rounded-2xl border border-slate-200/80 bg-white p-5 shadow-2xs transition duration-200 hover:-translate-y-0.5 hover:border-blue-200 hover:shadow-md ${
        onClick ? "cursor-pointer" : ""
      }`}
    >
      <div className="flex items-start justify-between gap-3">
        <span className="text-sm font-medium text-slate-500 transition group-hover:text-slate-700">
          {label}
        </span>
        <span className="grid size-10 place-items-center rounded-xl bg-blue-50 text-[#1a73e8] transition group-hover:bg-[#1a73e8] group-hover:text-white">
          <Icon size={18} />
        </span>
      </div>
      <div className="mt-3.5 flex flex-wrap items-baseline gap-2">
        <strong className="text-2xl font-semibold tracking-tight text-slate-900 sm:text-[26px]">
          {value}
        </strong>
        {change && (
          <span className="inline-flex items-center gap-0.5 rounded-full bg-emerald-50 px-2 py-0.5 text-xs font-semibold text-emerald-700">
            <ArrowUpRight size={13} />
            {change}
          </span>
        )}
      </div>
      <p className="mt-1.5 text-xs text-slate-500">{detail}</p>
    </article>
  );
}

function Table({ columns, rows, empty = "No records found", onRow }) {
  return (
    <div className="overflow-x-auto">
      <table className="w-full text-left text-sm">
        <thead>
          <tr className="border-b border-slate-100 bg-slate-50/80 text-[11px] font-semibold uppercase tracking-wider text-slate-400">
            {columns.map((c) => (
              <th key={c.key} className="whitespace-nowrap px-4 py-3 font-semibold">
                {c.label}
              </th>
            ))}
          </tr>
        </thead>
        <tbody className="divide-y divide-slate-100">
          {rows.length ? (
            rows.map((row, i) => (
              <tr
                key={row.id || i}
                onClick={() => onRow?.(row)}
                className={`transition ${
                  onRow ? "cursor-pointer hover:bg-blue-50/40" : "hover:bg-slate-50/70"
                }`}
              >
                {columns.map((c) => (
                  <td key={c.key} className="whitespace-nowrap px-4 py-3.5 text-slate-700">
                    {c.render ? c.render(row[c.key], row) : row[c.key] ?? "—"}
                  </td>
                ))}
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan={Math.max(columns.length, 1)} className="py-12 text-center text-sm text-slate-400">
                {empty}
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
}

function Surface({ children, className = "" }) {
  return (
    <section
      className={`rounded-2xl border border-slate-200/80 bg-white shadow-2xs transition hover:border-slate-200 ${className}`}
    >
      {children}
    </section>
  );
}

function SectionTitle({ title, sub, action }) {
  return (
    <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-100 px-5 py-4">
      <div>
        <h2 className="text-sm font-semibold text-slate-900">{title}</h2>
        {sub && <p className="mt-0.5 text-xs text-slate-500">{sub}</p>}
      </div>
      {action}
    </div>
  );
}

function SearchBar({ value, onChange, placeholder = "Search records…" }) {
  return (
    <label className="relative block">
      <Search className="pointer-events-none absolute left-3 top-2.5 text-slate-400" size={16} />
      <input
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        className="h-9 w-full min-w-48 rounded-xl border border-slate-200 bg-[#f3f5f8] pl-9 pr-3 text-sm text-slate-800 outline-none transition focus:border-[#1a73e8] focus:bg-white focus:ring-4 focus:ring-blue-100"
      />
    </label>
  );
}

function Modal({ title, onClose, children }) {
  return (
    <div
      className="fixed inset-0 z-50 grid place-items-center bg-slate-950/50 p-4 backdrop-blur-[2px]"
      onMouseDown={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <section
        role="dialog"
        aria-modal="true"
        aria-labelledby="modal-title"
        className="w-full max-w-lg overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-2xl"
      >
        <header className="flex items-center justify-between border-b border-slate-100 px-6 py-4">
          <h2 id="modal-title" className="font-semibold text-slate-900">
            {title}
          </h2>
          <IconButton label="Close dialog" onClick={onClose}>
            <X size={18} />
          </IconButton>
        </header>
        {children}
      </section>
    </div>
  );
}

const fieldLabelCls = "flex flex-col gap-1.5 text-xs font-semibold text-slate-700";
const fieldInputCls =
  "h-10 w-full rounded-xl border border-slate-200 bg-[#f3f5f8]/70 px-3 text-sm font-normal text-slate-900 outline-none transition focus:border-[#1a73e8] focus:bg-white focus:ring-4 focus:ring-blue-100";
const fieldAreaCls =
  "w-full rounded-xl border border-slate-200 bg-[#f3f5f8]/70 p-3 text-sm font-normal text-slate-900 outline-none transition focus:border-[#1a73e8] focus:bg-white focus:ring-4 focus:ring-blue-100";

function FormModal({ type, onClose, onSave, vendors = [], defaultRequester = "Ayesha Khan" }) {
  const isRequest = type === "request";
  return (
    <Modal title={isRequest ? "New purchase request" : "Add vendor"} onClose={onClose}>
      <form
        className="flex flex-col gap-4 p-6"
        onSubmit={(e) => {
          e.preventDefault();
          const f = new FormData(e.currentTarget);
          onSave(
            isRequest
              ? {
                  title: f.get("title"),
                  department: f.get("department"),
                  requester: defaultRequester,
                  amount: Number(f.get("amount")),
                  status: "Draft",
                  items: [{ name: f.get("title"), qty: 1, price: Number(f.get("amount")) }],
                }
              : {
                  name: f.get("name"),
                  category: f.get("category"),
                  contact: f.get("email"),
                  phone: f.get("phone"),
                  ntn: f.get("ntn"),
                }
          );
          onClose();
        }}
      >
        {isRequest ? (
          <>
            <label className={fieldLabelCls}>
              Request title
              <input
                name="title"
                required
                placeholder="e.g. Laptops for product team"
                className={fieldInputCls}
              />
            </label>
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <label className={fieldLabelCls}>
                Department
                <select name="department" className={fieldInputCls}>
                  <option>Engineering</option>
                  <option>Operations</option>
                  <option>Marketing</option>
                  <option>Finance</option>
                  <option>Administration</option>
                </select>
              </label>
              <label className={fieldLabelCls}>
                Estimated amount (PKR)
                <input
                  name="amount"
                  type="number"
                  min="1"
                  required
                  placeholder="0"
                  className={fieldInputCls}
                />
              </label>
            </div>
            <label className={fieldLabelCls}>
              Preferred vendor
              <select name="vendor" className={fieldInputCls}>
                <option value="">No preference</option>
                {vendors.map((v) => (
                  <option key={v.id}>{v.name}</option>
                ))}
              </select>
            </label>
            <label className={fieldLabelCls}>
              Business justification
              <textarea
                name="justification"
                rows="3"
                placeholder="Describe the business need"
                className={`${fieldAreaCls} resize-none`}
              />
            </label>
          </>
        ) : (
          <>
            <label className={fieldLabelCls}>
              Company name
              <input name="name" required placeholder="Vendor legal name" className={fieldInputCls} />
            </label>
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <label className={fieldLabelCls}>
                Category
                <select name="category" className={fieldInputCls}>
                  <option>IT Equipment</option>
                  <option>Office Supplies</option>
                  <option>Logistics</option>
                  <option>Furniture</option>
                  <option>Professional Services</option>
                </select>
              </label>
              <label className={fieldLabelCls}>
                NTN / Tax ID
                <input name="ntn" required placeholder="Tax registration" className={fieldInputCls} />
              </label>
            </div>
            <label className={fieldLabelCls}>
              Contact email
              <input
                name="email"
                type="email"
                required
                placeholder="contact@company.com"
                className={fieldInputCls}
              />
            </label>
            <label className={fieldLabelCls}>
              Phone number
              <input
                name="phone"
                type="tel"
                placeholder="+92 300 0000000"
                className={fieldInputCls}
              />
            </label>
          </>
        )}
        <footer className="mt-2 flex justify-end gap-2">
          <Button variant="outline" onClick={onClose}>
            Cancel
          </Button>
          <button
            type="submit"
            className="inline-flex h-10 cursor-pointer items-center gap-2 rounded-xl bg-[#1a73e8] px-4 text-sm font-medium text-white transition hover:bg-blue-700"
          >
            <Check size={15} />
            {isRequest ? "Save request" : "Add vendor"}
          </button>
        </footer>
      </form>
    </Modal>
  );
}

function EmptyState({ text }) {
  return <p className="px-5 py-10 text-center text-sm text-slate-400">{text}</p>;
}

const sumAmount = (rows) => rows.reduce((t, r) => t + (Number(r.amount) || 0), 0);
const isClosed = (st) => ["completed", "rejected", "cancelled"].includes(String(st || "").toLowerCase());

function EmployeeDashboard({ store, openModal }) {
  const me = store.user?.name;
  const mine = store.requests.filter((r) => r.requester === me);
  const open = mine.filter((r) => !isClosed(r.status));
  const approved = mine.filter((r) => String(r.status).toLowerCase().includes("approv"));
  const drafts = mine.filter((r) => String(r.status).toLowerCase() === "draft");

  return (
    <>
      <PageHeader
        title={`Good morning, ${(me || "there").split(" ")[0]}`}
        description="Track the purchase requests you have submitted."
        action={
          <Button icon={Plus} onClick={() => openModal("request")}>
            New request
          </Button>
        }
      />
      <div className="mb-6 grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <MetricCard
          label="My request value"
          value={fmt(sumAmount(mine))}
          detail="Across your requests"
          icon={Wallet}
        />
        <MetricCard
          label="My open requests"
          value={String(open.length).padStart(2, "0")}
          detail="Still in progress"
          icon={ClipboardList}
        />
        <MetricCard
          label="Approved"
          value={String(approved.length).padStart(2, "0")}
          detail="Approved requests"
          icon={Check}
        />
        <MetricCard
          label="Drafts"
          value={String(drafts.length).padStart(2, "0")}
          detail="Not yet submitted"
          icon={FileText}
        />
      </div>
      <Surface>
        <SectionTitle
          title="My requests"
          sub="Requests you created"
          action={
            <Link href="/purchase-requests" className="text-xs font-semibold text-[#1a73e8] hover:underline">
              View all
            </Link>
          }
        />
        <Table
          empty="You haven’t created any purchase requests yet."
          columns={[
            { key: "id", label: "Request ID", render: (v) => <span className="font-semibold text-[#1a73e8]">{v}</span> },
            { key: "title", label: "Request" },
            { key: "department", label: "Department" },
            { key: "amount", label: "Amount", render: (v) => fmt(v) },
            { key: "status", label: "Status", render: (v) => <Status value={v} /> },
          ]}
          rows={mine.slice(0, 5)}
        />
      </Surface>
    </>
  );
}

function VendorDashboard({ store }) {
  const me = store.user?.name;
  const quotes = store.quotations.filter((q) => q.vendor === me);
  const invites = store.rfqs.filter((r) => r.vendors?.includes(me));
  const orders = store.purchaseOrders.filter((p) => p.vendor === me);
  const active = orders.filter((p) => !isClosed(p.status));

  return (
    <>
      <PageHeader
        eyebrow="Vendor workspace"
        title={`Welcome, ${me || "Vendor"}`}
        description="Your quotations and purchase orders."
      />
      <div className="mb-6 grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <MetricCard
          label="Your quotations"
          value={String(quotes.length).padStart(2, "0")}
          detail="Quotes submitted to date"
          icon={FileClock}
        />
        <MetricCard
          label="Open invitations"
          value={String(invites.length).padStart(2, "0")}
          detail="Supplier opportunities"
          icon={Inbox}
        />
        <MetricCard
          label="Active purchase orders"
          value={String(active.length).padStart(2, "0")}
          detail="Across your supplier account"
          icon={ShoppingCart}
        />
        <MetricCard
          label="Order value"
          value={fmt(sumAmount(orders))}
          detail="Your purchase orders"
          icon={Wallet}
        />
      </div>
      <div className="grid gap-4 xl:grid-cols-2">
        <Surface>
          <SectionTitle
            title="My purchase orders"
            sub="Orders issued to you"
            action={
              <Link href="/purchase-orders" className="text-xs font-semibold text-[#1a73e8] hover:underline">
                View all
              </Link>
            }
          />
          <Table
            empty="No purchase orders have been issued to you yet."
            columns={[
              { key: "id", label: "Order ID", render: (v) => <span className="font-semibold text-[#1a73e8]">{v}</span> },
              { key: "date", label: "Order date" },
              { key: "amount", label: "Amount", render: (v) => fmt(v) },
              { key: "status", label: "Status", render: (v) => <Status value={v} /> },
            ]}
            rows={orders.slice(0, 5)}
          />
        </Surface>
        <Surface>
          <SectionTitle
            title="My quotations"
            sub="Responses you submitted"
            action={
              <Link href="/quotations" className="text-xs font-semibold text-[#1a73e8] hover:underline">
                View all
              </Link>
            }
          />
          <Table
            empty="You haven’t submitted any quotations yet."
            columns={[
              { key: "rfqId", label: "RFQ" },
              { key: "amount", label: "Amount", render: (v) => fmt(v) },
              { key: "submittedAt", label: "Submitted" },
              { key: "status", label: "Status", render: (v) => <Status value={v} /> },
            ]}
            rows={quotes.slice(0, 5)}
          />
        </Surface>
      </div>
    </>
  );
}

function CompanyDashboard({ store, openModal }) {
  const [period, setPeriod] = useState("6m");
  const pending = store.requests.filter((r) => String(r.status).toLowerCase().includes("pending")).length;
  const recent = store.requests.slice(0, 4);
  const chartData = period === "3m" ? spendTrend.slice(-3) : spendTrend;

  return (
    <>
      <PageHeader
        title={`Good morning, ${(store.user?.name || "Ayesha Khan").split(" ")[0]}`}
        description={`Here’s what’s happening across your ${
          roleLabels[store.role]?.toLowerCase() || "procurement"
        } workspace today.`}
        action={
          <Button icon={Plus} onClick={() => openModal("request")}>
            New request
          </Button>
        }
      />

      <div className="mb-6 grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <MetricCard
          label="Total spend · YTD"
          value="PKR 14.28M"
          change="12.8%"
          detail="Year to date"
          icon={Wallet}
        />
        <MetricCard
          label="Open requests"
          value={String(store.requests.filter((r) => !["Completed", "Rejected"].includes(r.status)).length).padStart(2, "0")}
          detail="Across your organization"
          icon={ClipboardList}
        />
        <MetricCard
          label="Pending approvals"
          value={String(pending + 2).padStart(2, "0")}
          detail="Needs your attention"
          icon={Clock3}
        />
        <MetricCard
          label="Active vendors"
          value={String(store.vendors.filter((v) => v.status === "Active").length).padStart(2, "0")}
          change="8.2%"
          detail="Across 6 categories"
          icon={Building2}
        />
      </div>

      <div className="mb-6 grid gap-4 xl:grid-cols-[1.65fr_1fr]">
        <Surface>
          <SectionTitle
            title="Spend overview"
            sub="Monthly spend against planned budget · PKR millions"
            action={
              <button
                type="button"
                onClick={() => setPeriod((p) => (p === "6m" ? "3m" : "6m"))}
                className="flex cursor-pointer items-center gap-1 rounded-xl border border-slate-200 bg-[#f3f5f8] px-3 py-1.5 text-xs font-medium text-slate-700 transition hover:bg-slate-200/70"
              >
                {period === "6m" ? "Last 6 months" : "Last 3 months"}
                <ChevronDown size={13} />
              </button>
            }
          />
          <div className="h-[270px] px-3 pb-2 pt-5">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={chartData} margin={{ left: 0, right: 8, top: 4, bottom: 0 }}>
                <defs>
                  <linearGradient id="spendFill" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#1a73e8" stopOpacity={0.22} />
                    <stop offset="95%" stopColor="#1a73e8" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid vertical={false} stroke="#edf0f5" />
                <XAxis
                  dataKey="month"
                  tickLine={false}
                  axisLine={false}
                  tick={{ fill: "#8792a2", fontSize: 11 }}
                  dy={10}
                />
                <YAxis
                  tickLine={false}
                  axisLine={false}
                  tick={{ fill: "#8792a2", fontSize: 11 }}
                  tickFormatter={(v) => `PKR ${v}m`}
                  width={68}
                />
                <Tooltip
                  formatter={(v) => [`PKR ${v}m`]}
                  contentStyle={{ borderRadius: 12, border: "1px solid #e9edf3", fontSize: 12 }}
                />
                <Area
                  type="monotone"
                  dataKey="budget"
                  name="Budget"
                  stroke="#cbd5e1"
                  strokeDasharray="4 4"
                  fill="transparent"
                  strokeWidth={2}
                />
                <Area
                  type="monotone"
                  dataKey="spend"
                  name="Actual spend"
                  stroke="#1a73e8"
                  fill="url(#spendFill)"
                  strokeWidth={2.5}
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
          <div className="flex gap-5 border-t border-slate-100 px-5 py-3 text-xs text-slate-500">
            <span className="flex items-center gap-2">
              <i className="h-2 w-2 rounded-full bg-[#1a73e8]" />
              Actual spend
            </span>
            <span className="flex items-center gap-2">
              <i className="h-2 w-2 rounded-full bg-slate-300" />
              Budget
            </span>
          </div>
        </Surface>

        <Surface>
          <SectionTitle
            title="Action required"
            sub="Your queue, prioritized"
            action={
              <Link href="/approvals" className="text-xs font-semibold text-[#1a73e8] hover:underline">
                View all
              </Link>
            }
          />
          <div className="divide-y divide-slate-100">
            {[
              {
                icon: ClipboardCheck,
                title: "Purchase approvals",
                text: `${pending + 2} requests waiting`,
                tone: "bg-amber-50 text-amber-700",
                href: "/approvals",
              },
              {
                icon: FileText,
                title: "Quotes to review",
                text: "2 sourcing events closing soon",
                tone: "bg-blue-50 text-blue-700",
                href: "/rfqs",
              },
              {
                icon: AlertCircle,
                title: "Invoices due",
                text: "3 payments due this week",
                tone: "bg-rose-50 text-rose-700",
                href: "/invoices",
              },
            ].map(({ icon: ItemIcon, title, text, tone, href }) => (
              <Link
                key={title}
                href={href}
                className="group flex items-center gap-3 px-5 py-4 transition hover:bg-slate-50"
              >
                <span className={`grid size-9 shrink-0 place-items-center rounded-xl ${tone}`}>
                  <ItemIcon size={17} />
                </span>
                <span className="min-w-0 flex-1">
                  <strong className="block text-sm font-medium text-slate-800 group-hover:text-[#1a73e8]">
                    {title}
                  </strong>
                  <span className="mt-0.5 block text-xs text-slate-500">{text}</span>
                </span>
                <ChevronRight
                  className="text-slate-400 transition group-hover:translate-x-0.5 group-hover:text-slate-700"
                  size={17}
                />
              </Link>
            ))}
          </div>
          <div className="mx-5 mb-5 mt-3 rounded-xl border border-blue-100 bg-[#f7faff] p-3.5">
            <div className="flex items-center gap-2 text-xs font-semibold text-slate-800">
              <Sparkles size={15} className="text-[#1a73e8]" />
              Procurement insight
            </div>
            <p className="mt-1.5 text-xs leading-5 text-slate-600">
              Consolidating IT purchases with your top 2 vendors could save{" "}
              <b className="text-slate-800">PKR 184,000</b> this quarter.
            </p>
            <Link
              href="/analytics"
              className="mt-2 inline-flex items-center gap-1 text-xs font-semibold text-[#1a73e8] hover:underline"
            >
              Explore savings <ArrowUpRight size={12} />
            </Link>
          </div>
        </Surface>
      </div>

      <div className="grid gap-4 xl:grid-cols-[1.65fr_1fr]">
        <Surface>
          <SectionTitle
            title="Recent requests"
            sub="Latest activity across your organization"
            action={
              <Link href="/purchase-requests" className="text-xs font-semibold text-[#1a73e8] hover:underline">
                View all
              </Link>
            }
          />
          <Table
            empty="No purchase requests yet."
            columns={[
              { key: "id", label: "Request ID", render: (v) => <span className="font-semibold text-[#1a73e8]">{v}</span> },
              { key: "title", label: "Request" },
              { key: "department", label: "Department" },
              { key: "amount", label: "Amount", render: (v) => fmt(v) },
              { key: "status", label: "Status", render: (v) => <Status value={v} /> },
            ]}
            rows={recent}
          />
        </Surface>

        <Surface>
          <SectionTitle
            title="Top vendors"
            sub="By spend this financial year"
            action={
              <Link href="/vendors" className="text-xs font-semibold text-[#1a73e8] hover:underline">
                All vendors
              </Link>
            }
          />
          <div className="divide-y divide-slate-100">
            {store.vendors.length === 0 && (
              <p className="px-5 py-10 text-center text-sm text-slate-400">No vendors added yet.</p>
            )}
            {store.vendors.slice(0, 4).map((v) => (
              <div key={v.id} className="flex items-center gap-3 px-5 py-3.5 transition hover:bg-slate-50/70">
                <div className="grid size-9 place-items-center rounded-xl bg-blue-50 text-xs font-semibold text-[#1a73e8]">
                  {v.name
                    .split(" ")
                    .map((w) => w[0])
                    .slice(0, 2)
                    .join("")}
                </div>
                <div className="min-w-0 flex-1">
                  <p className="truncate text-sm font-medium text-slate-800">{v.name}</p>
                  <p className="text-xs text-slate-500">{v.category}</p>
                </div>
                <strong className="text-sm font-semibold text-slate-800">{fmt(v.spend)}</strong>
              </div>
            ))}
          </div>
        </Surface>
      </div>
    </>
  );
}

function Dashboard(props) {
  const role = props.store.role;
  if (role === "employee") return <EmployeeDashboard {...props} />;
  if (role === "vendor") return <VendorDashboard {...props} />;
  return <CompanyDashboard {...props} />;
}

function RecordsPage({ kind, store, openModal, search, setSearch }) {
  let rows = [];
  let columns = [];
  const title = pageTitles[kind] || "Workspace";
  const me = store.user?.name;
  const requestRows =
    store.role === "employee"
      ? store.requests.filter((r) => r.requester === me)
      : store.role === "vendor"
        ? []
        : store.requests;

  if (kind === "purchase-requests" || kind === "approvals") {
    rows =
      kind === "approvals"
        ? requestRows.filter((r) => String(r.status).toLowerCase().includes("pending"))
        : requestRows;
    columns = [
      { key: "id", label: "Request ID", render: (v) => <span className="font-semibold text-[#1a73e8]">{v}</span> },
      { key: "title", label: "Request" },
      { key: "requester", label: "Requested by" },
      { key: "department", label: "Department" },
      { key: "date", label: "Submitted" },
      { key: "amount", label: "Est. amount", render: (v) => fmt(v) },
      { key: "status", label: "Status", render: (v) => <Status value={v} /> },
    ];
  }

  if (kind === "vendors") {
    rows = store.vendors;
    columns = [
      {
        key: "name",
        label: "Vendor",
        render: (v, r) => (
          <div className="flex items-center gap-3">
            <span className="grid size-8 place-items-center rounded-xl bg-blue-50 text-xs font-semibold text-blue-700">
              {v
                .split(" ")
                .map((x) => x[0])
                .slice(0, 2)
                .join("")}
            </span>
            <span>
              <b className="block font-medium text-slate-800">{v}</b>
              <small className="text-slate-500">{r.contact}</small>
            </span>
          </div>
        ),
      },
      { key: "category", label: "Category" },
      { key: "rating", label: "Rating", render: (v) => (v ? `★ ${Number(v).toFixed(1)}` : "New") },
      { key: "spend", label: "YTD spend", render: (v) => fmt(v) },
      { key: "delivery", label: "On time", render: (v) => (v ? `${v}%` : "—") },
      { key: "status", label: "Status", render: (v) => <Status value={v} /> },
    ];
  }

  if (kind === "purchase-orders") {
    rows =
      store.role === "vendor"
        ? store.purchaseOrders.filter((p) => p.vendor === me)
        : store.role === "employee"
          ? store.purchaseOrders.filter((p) => requestRows.some((r) => r.id === p.requestId))
          : store.purchaseOrders;
    columns = [
      { key: "id", label: "Order ID", render: (v) => <span className="font-semibold text-[#1a73e8]">{v}</span> },
      { key: "requestId", label: "Request" },
      { key: "vendor", label: "Vendor" },
      { key: "date", label: "Order date" },
      { key: "amount", label: "Amount", render: (v) => fmt(v) },
      { key: "status", label: "Status", render: (v) => <Status value={v} /> },
    ];
  }

  if (kind === "users") {
    rows = store.users;
    columns = [
      {
        key: "name",
        label: "Name",
        render: (v) => (
          <div className="flex items-center gap-3">
            <span className="grid size-8 place-items-center rounded-full bg-violet-50 text-xs font-semibold text-violet-700">
              {v
                .split(" ")
                .map((x) => x[0])
                .slice(0, 2)
                .join("")}
            </span>
            <span className="font-medium text-slate-800">{v}</span>
          </div>
        ),
      },
      { key: "email", label: "Email" },
      { key: "role", label: "Role", render: (v) => roleLabels[v] || v },
      { key: "department", label: "Department" },
      { key: "status", label: "Status", render: (v) => <Status value={v} /> },
    ];
  }

  if (kind === "rfqs") {
    rows = [
      { id: "RFQ-2026-024", title: "Laptops — engineering refresh", vendor: "5 invited", due: "Nov 28, 2026", amount: "PKR 1.5M", status: "Open" },
      { id: "RFQ-2026-023", title: "Office supply contract", vendor: "3 invited", due: "Nov 25, 2026", amount: "PKR 185K", status: "Open" },
      { id: "RFQ-2026-022", title: "Cloud services renewal", vendor: "4 invited", due: "Nov 20, 2026", amount: "PKR 920K", status: "Evaluation" },
      { id: "RFQ-2026-021", title: "Conference room furniture", vendor: "3 invited", due: "Nov 15, 2026", amount: "PKR 640K", status: "Awarded" },
    ];
    columns = [
      { key: "id", label: "RFQ ID" },
      { key: "title", label: "Sourcing event" },
      { key: "vendor", label: "Suppliers" },
      { key: "due", label: "Due date" },
      { key: "amount", label: "Est. value" },
      { key: "status", label: "Status", render: (v) => <Status value={v} /> },
    ];
  }

  if (kind === "contracts") {
    rows = [
      { id: "CTR-2026-014", title: "IT equipment master agreement", vendor: "Techno Supplies Ltd", owner: "Procurement", expiry: "Dec 31, 2026", amount: "PKR 4.2M", status: "Active" },
      { id: "CTR-2026-013", title: "Office supplies framework", vendor: "Office Essentials Co.", owner: "Operations", expiry: "Jan 15, 2027", amount: "PKR 1.8M", status: "Active" },
      { id: "CTR-2026-012", title: "Cloud infrastructure", vendor: "Vertex Technologies", owner: "Engineering", expiry: "Dec 04, 2026", amount: "PKR 3.1M", status: "Expiring soon" },
    ];
    columns = [
      { key: "id", label: "Contract ID" },
      { key: "title", label: "Contract" },
      { key: "vendor", label: "Vendor" },
      { key: "owner", label: "Owner" },
      { key: "expiry", label: "Expiry date" },
      { key: "amount", label: "Value" },
      { key: "status", label: "Status", render: (v) => <Status value={v} /> },
    ];
  }

  if (kind === "catalog") {
    rows = [
      { id: "SKU-1042", name: "Business laptop — 14 inch", category: "IT Equipment", vendor: "Techno Supplies Ltd", price: "PKR 185,000", stock: "In stock" },
      { id: "SKU-1038", name: "Ergonomic task chair", category: "Furniture", vendor: "Pak Furniture Works", price: "PKR 40,000", stock: "In stock" },
      { id: "SKU-1021", name: "A4 paper — carton", category: "Office Supplies", vendor: "Office Essentials Co.", price: "PKR 8,500", stock: "Low stock" },
      { id: "SKU-1016", name: "USB-C docking station", category: "IT Equipment", vendor: "Vertex Technologies", price: "PKR 32,000", stock: "In stock" },
    ];
    columns = [
      { key: "id", label: "SKU" },
      { key: "name", label: "Item" },
      { key: "category", label: "Category" },
      { key: "vendor", label: "Preferred vendor" },
      { key: "price", label: "Unit price" },
      { key: "stock", label: "Availability", render: (v) => <Status value={v} /> },
    ];
  }

  if (kind === "invoices") {
    rows = [
      { id: "INV-2026-090", vendor: "Office Essentials Co.", order: "PO-2026-018", date: "Nov 22, 2026", due: "Dec 22, 2026", amount: "PKR 179,500", status: "Pending approval" },
      { id: "INV-2026-089", vendor: "Pak Furniture Works", order: "PO-2026-017", date: "Nov 20, 2026", due: "Dec 20, 2026", amount: "PKR 268,000", status: "Paid" },
      { id: "INV-2026-088", vendor: "Techno Supplies Ltd", order: "PO-2026-016", date: "Nov 18, 2026", due: "Nov 28, 2026", amount: "PKR 845,000", status: "Overdue" },
    ];
    columns = [
      { key: "id", label: "Invoice" },
      { key: "vendor", label: "Vendor" },
      { key: "order", label: "Purchase order" },
      { key: "date", label: "Invoice date" },
      { key: "due", label: "Due date" },
      { key: "amount", label: "Amount" },
      { key: "status", label: "Status", render: (v) => <Status value={v} /> },
    ];
  }

  if (kind === "receiving") {
    rows = [
      { id: "RCV-2026-031", order: "PO-2026-017", vendor: "Pak Furniture Works", expected: "16 chairs", received: "12 chairs", date: "Nov 22, 2026", status: "Partially Received" },
      { id: "RCV-2026-030", order: "PO-2026-016", vendor: "Techno Supplies Ltd", expected: "5 items", received: "5 items", date: "Nov 20, 2026", status: "Completed" },
      { id: "RCV-2026-029", order: "PO-2026-015", vendor: "Office Essentials Co.", expected: "24 cartons", received: "—", date: "Nov 24, 2026", status: "Expected" },
    ];
    columns = [
      { key: "id", label: "Receipt" },
      { key: "order", label: "Purchase order" },
      { key: "vendor", label: "Vendor" },
      { key: "expected", label: "Expected" },
      { key: "received", label: "Received" },
      { key: "date", label: "Date" },
      { key: "status", label: "Status", render: (v) => <Status value={v} /> },
    ];
  }

  if (kind === "budgets") {
    rows = [
      { id: "Engineering", period: "FY 2026", owner: "Sara Malik", allocated: "PKR 8,000,000", spent: "PKR 6,420,000", remaining: "PKR 1,580,000", status: "On track" },
      { id: "Operations", period: "FY 2026", owner: "Hina Raza", allocated: "PKR 4,500,000", spent: "PKR 3,150,000", remaining: "PKR 1,350,000", status: "On track" },
      { id: "Marketing", period: "FY 2026", owner: "Sara Malik", allocated: "PKR 3,200,000", spent: "PKR 2,810,000", remaining: "PKR 390,000", status: "At risk" },
      { id: "Administration", period: "FY 2026", owner: "Ayesha Khan", allocated: "PKR 2,500,000", spent: "PKR 1,780,000", remaining: "PKR 720,000", status: "On track" },
    ];
    columns = [
      { key: "id", label: "Department" },
      { key: "period", label: "Period" },
      { key: "owner", label: "Budget owner" },
      { key: "allocated", label: "Allocated" },
      { key: "spent", label: "Spent" },
      { key: "remaining", label: "Remaining" },
      { key: "status", label: "Status", render: (v) => <Status value={v} /> },
    ];
  }

  const searchable = rows.filter((r) =>
    Object.values(r).join(" ").toLowerCase().includes(search.toLowerCase())
  );
  const primary =
    kind === "vendors"
      ? "Add vendor"
      : kind === "purchase-requests"
        ? "New request"
        : kind === "rfqs"
          ? "Create RFQ"
          : kind === "users"
            ? "Invite user"
            : kind === "purchase-orders"
              ? "Create order"
              : `New ${title.toLowerCase().replace(/s$/, "")}`;
  const showAdd = kind !== "approvals";

  return (
    <>
      <PageHeader
        title={title}
        description={
          {
            vendors: "Manage supplier relationships, compliance, and performance.",
            "purchase-requests": "Create, track, and manage purchasing needs across your organization.",
            approvals: "Review and take action on requests in your approval queue.",
            "purchase-orders": "Track orders from supplier confirmation through delivery.",
            rfqs: "Run competitive sourcing events and compare supplier proposals.",
            contracts: "Keep agreements, renewal dates, and obligations in one place.",
            catalog: "Browse approved items and preferred supplier pricing.",
            invoices: "Match invoices to purchase orders and manage payment status.",
            receiving: "Record deliveries and resolve quantity discrepancies.",
            budgets: "Monitor committed and actual spend against department budgets.",
            users: "Manage workspace members, departments, and access roles.",
          }[kind] || ""
        }
        action={
          showAdd && (
            <Button icon={Plus} onClick={() => openModal(kind === "vendors" ? "vendor" : "request")}>
              {primary}
            </Button>
          )
        }
      />
      <div className="mb-4 grid grid-cols-2 gap-3 lg:grid-cols-4">
        <MetricCard
          label={kind === "vendors" ? "Active suppliers" : "Total records"}
          value={String(rows.length).padStart(2, "0")}
          icon={kind === "vendors" ? Building2 : FolderKanban}
          detail="In this workspace"
        />
        <MetricCard
          label="Needs attention"
          value={kind === "approvals" ? `${rows.length}` : "03"}
          icon={AlertCircle}
          detail="Review required"
        />
        <MetricCard
          label="Updated this month"
          value={kind === "purchase-orders" ? "12" : "08"}
          icon={Activity}
          detail="Across your organization"
        />
        <MetricCard
          label="Total value"
          value={
            kind === "vendors"
              ? fmt(store.vendors.reduce((a, v) => a + v.spend, 0))
              : kind === "purchase-requests" || kind === "approvals" || kind === "purchase-orders"
                ? fmt(rows.reduce((a, r) => a + (Number(r.amount) || 0), 0))
                : "PKR 2.48M"
          }
          icon={Wallet}
          detail="Current financial year"
        />
      </div>
      <Surface>
        <div className="flex flex-wrap items-center justify-between gap-3 px-5 py-4">
          <div>
            <h2 className="text-sm font-semibold text-slate-900">All {title.toLowerCase()}</h2>
            <p className="mt-1 text-xs text-slate-500">
              Showing {searchable.length} of {rows.length} records
            </p>
          </div>
          <div className="flex items-center gap-2">
            <SearchBar value={search} onChange={setSearch} />
            <Button variant="outline" icon={Filter}>
              Filter
            </Button>
            <IconButton label="More actions">
              <MoreHorizontal size={18} />
            </IconButton>
          </div>
        </div>
        <Table
          columns={columns}
          rows={searchable}
          empty={rows.length ? "No records match your search." : `No ${title.toLowerCase()} yet.`}
        />
      </Surface>
    </>
  );
}

function Analytics({ store }) {
  return (
    <>
      <PageHeader
        title="Analytics"
        description="of spend, savings, and supplier performance."
        action={
          <Button variant="outline" icon={ArrowDownToLine} onClick={() => window.print()}>
            Export report
          </Button>
        }
      />
      <div className="mb-5 grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <MetricCard label="Addressable spend" value="PKR 14.28M" change="12.8%" detail="Year to date" icon={Wallet} />
        <MetricCard label="Cost savings" value="PKR 842K" change="8.4%" detail="5.9% of total spend" icon={ArrowLeftRight} />
        <MetricCard label="Contract coverage" value="78.4%" change="3.1%" detail="Spend under contract" icon={ShieldCheck} />
        <MetricCard label="Supplier performance" value="92.6%" change="2.3%" detail="Weighted delivery + quality" icon={Building2} />
      </div>
      <div className="grid gap-4 xl:grid-cols-2">
        <Surface>
          <SectionTitle title="Spend vs. budget" sub="Monthly view · PKR millions" />
          <div className="h-[300px] p-5">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={spendTrend} barGap={5}>
                <CartesianGrid vertical={false} stroke="#edf0f5" />
                <XAxis dataKey="month" tickLine={false} axisLine={false} tick={{ fontSize: 11, fill: "#8792a2" }} />
                <YAxis
                  tickLine={false}
                  axisLine={false}
                  tick={{ fontSize: 11, fill: "#8792a2" }}
                  tickFormatter={(v) => `PKR ${v}m`}
                />
                <Tooltip />
                <Legend />
                <Bar name="Spend" dataKey="spend" fill="#1a73e8" radius={[6, 6, 0, 0]} />
                <Bar name="Budget" dataKey="budget" fill="#d9e5f8" radius={[6, 6, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </Surface>
        <Surface>
          <SectionTitle title="Spend by category" sub="Share of total addressable spend" />
          <div className="p-5">
            {[
              { name: "IT & Technology", value: 34, amount: "PKR 4.86M", color: "#1a73e8" },
              { name: "Professional services", value: 26, amount: "PKR 3.71M", color: "#4c8df6" },
              { name: "Office & facilities", value: 19, amount: "PKR 2.71M", color: "#81aaf5" },
              { name: "Logistics & freight", value: 12, amount: "PKR 1.71M", color: "#a9c4f8" },
              { name: "Other categories", value: 9, amount: "PKR 1.29M", color: "#d9e5f8" },
            ].map((x) => (
              <div key={x.name} className="mb-5 last:mb-0">
                <div className="mb-2 flex justify-between text-sm">
                  <span className="text-slate-600">{x.name}</span>
                  <strong className="font-medium text-slate-800">{x.amount}</strong>
                </div>
                <div className="h-2 overflow-hidden rounded-full bg-slate-100">
                  <div className="h-full rounded-full transition-all" style={{ width: `${x.value}%`, background: x.color }} />
                </div>
              </div>
            ))}
          </div>
        </Surface>
        <Surface>
          <SectionTitle title="Supplier performance" sub="By on-time delivery rate" />
          <div className="p-5">
            {store.vendors.length === 0 && <EmptyState text="No supplier data yet." />}
            {store.vendors.slice(0, 4).map((v) => (
              <div key={v.id} className="mb-5 last:mb-0">
                <div className="mb-2 flex justify-between text-sm">
                  <span className="text-slate-600">{v.name}</span>
                  <strong className="font-medium text-slate-800">{v.delivery}%</strong>
                </div>
                <div className="h-2 overflow-hidden rounded-full bg-slate-100">
                  <div className="h-full rounded-full bg-[#4caf82]" style={{ width: `${v.delivery}%` }} />
                </div>
              </div>
            ))}
          </div>
        </Surface>
        <Surface>
          <SectionTitle title="Spend by department" sub="Committed + invoiced spend" />
          <div className="divide-y divide-slate-100">
            {[
              { n: "Engineering", a: "PKR 6.42M", pct: 81 },
              { n: "Operations", a: "PKR 3.15M", pct: 70 },
              { n: "Marketing", a: "PKR 2.81M", pct: 88 },
              { n: "Administration", a: "PKR 1.78M", pct: 71 },
            ].map((x) => (
              <div key={x.n} className="flex items-center gap-4 px-5 py-4">
                <span className="w-28 text-sm text-slate-600">{x.n}</span>
                <div className="h-2 flex-1 rounded-full bg-slate-100">
                  <div className="h-full rounded-full bg-[#1a73e8]" style={{ width: `${x.pct}%` }} />
                </div>
                <span className="text-sm font-medium text-slate-700">{x.a}</span>
              </div>
            ))}
          </div>
        </Surface>
      </div>
    </>
  );
}

function Notifications({ store }) {
  return (
    <>
      <PageHeader
        title="Notifications"
        description="Stay up to date on procurement activity across your workspace."
        action={
          <Button variant="outline" onClick={store.markAllRead}>
            Mark all as read
          </Button>
        }
      />
      <Surface>
        <div className="divide-y divide-slate-100">
          {store.notifications.length === 0 && <EmptyState text="You’re all caught up — no notifications." />}
          {store.notifications.map((n) => (
            <div
              key={n.id}
              onClick={() => store.markRead?.(n.id)}
              className={`flex cursor-pointer items-start gap-4 px-5 py-5 transition hover:bg-slate-50/80 ${
                !n.read ? "bg-blue-50/30" : ""
              }`}
            >
              <span
                className={`mt-1 grid size-9 shrink-0 place-items-center rounded-full ${
                  n.read ? "bg-slate-100 text-slate-500" : "bg-blue-50 text-[#1a73e8]"
                }`}
              >
                <Bell size={17} />
              </span>
              <div className="flex-1">
                <p className="text-sm font-semibold text-slate-800">{n.title}</p>
                <p className="mt-1 text-sm text-slate-500">{n.detail}</p>
                <p className="mt-2 text-xs text-slate-400">{n.time}</p>
              </div>
              {!n.read && <span className="mt-2 size-2 rounded-full bg-[#1a73e8]" />}
            </div>
          ))}
        </div>
      </Surface>
    </>
  );
}

function SettingsPage({ store }) {
  const [tab, setTab] = useState("Organization");
  const [saved, setSaved] = useState(false);

  return (
    <>
      <PageHeader title="Settings" description="Manage your workspace preferences and organization details." />
      <div className="grid gap-4 lg:grid-cols-[220px_1fr]">
        <Surface className="h-fit p-2">
          {["Organization", "Profile", "Notifications", "Security", "Integrations"].map((v, i) => {
            const TabIcon = [Building2, UserRound, Bell, ShieldCheck, Globe2][i];
            return (
              <button
                key={v}
                type="button"
                onClick={() => setTab(v)}
                className={`flex w-full cursor-pointer items-center gap-3 rounded-xl px-3 py-2.5 text-left text-sm transition ${
                  tab === v ? "bg-blue-50 font-semibold text-[#1a73e8]" : "text-slate-600 hover:bg-slate-50"
                }`}
              >
                <span className={tab === v ? "text-[#1a73e8]" : "text-slate-400"}>
                  <TabIcon size={16} />
                </span>
                {v}
              </button>
            );
          })}
        </Surface>
        <div className="flex flex-col gap-4">
          <Surface>
            <SectionTitle title={`${tab} settings`} sub="Details for your procurement workspace" />
            <div className="grid gap-4 p-5 sm:grid-cols-2">
              <label className={fieldLabelCls}>
                Organization name
                <input defaultValue={store.settings?.organization || "Acme Corporation"} className={fieldInputCls} />
              </label>
              <label className={fieldLabelCls}>
                Business email
                <input defaultValue={store.settings?.email || "procurement@acme.com"} className={fieldInputCls} />
              </label>
              <label className={fieldLabelCls}>
                Industry
                <select defaultValue={store.settings?.industry || "Technology"} className={fieldInputCls}>
                  <option>Technology</option>
                  <option>Manufacturing</option>
                  <option>Financial services</option>
                </select>
              </label>
              <label className={fieldLabelCls}>
                Fiscal year starts
                <select defaultValue={store.settings?.fiscalYear || "January"} className={fieldInputCls}>
                  <option>January</option>
                  <option>July</option>
                  <option>April</option>
                </select>
              </label>
              <label className={`${fieldLabelCls} sm:col-span-2`}>
                Organization address
                <input
                  defaultValue={store.settings?.address || "100 Market Street, San Francisco, CA"}
                  className={fieldInputCls}
                />
              </label>
            </div>
          </Surface>
          <Surface>
            <SectionTitle title="Workspace preferences" sub="Control how ProCureX works for you" />
            <div className="divide-y divide-slate-100">
              {[
                { title: "Email notifications", desc: "Get notified about approvals, invoices, and sourcing events" },
                { title: "Approval reminders", desc: "Send a reminder when requests are waiting for review" },
                { title: "Weekly spend digest", desc: "Receive a weekly summary of organization spend" },
              ].map((x) => (
                <label key={x.title} className="flex cursor-pointer items-center justify-between gap-4 px-5 py-4 hover:bg-slate-50/60">
                  <span>
                    <b className="block text-sm font-medium text-slate-800">{x.title}</b>
                    <small className="mt-1 block text-xs text-slate-500">{x.desc}</small>
                  </span>
                  <input type="checkbox" defaultChecked className="size-4 cursor-pointer accent-[#1a73e8]" />
                </label>
              ))}
            </div>
            <div className="flex justify-end border-t border-slate-100 p-4">
              <Button
                onClick={() => {
                  setSaved(true);
                  setTimeout(() => setSaved(false), 2200);
                }}
              >
                {saved ? "Changes saved" : "Save changes"}
              </Button>
            </div>
          </Surface>
        </div>
      </div>
    </>
  );
}

export default function AppShell() {
  const pathname = usePathname();
  const router = useRouter();
  const base = useStore();
  const realRole = base.realRole || base.user?.role || "employee";
  const isAdmin = realRole === "admin";
  const store = { ...base, role: isAdmin ? base.role : realRole };

  const [signingOut, setSigningOut] = useState(false);
  const [menu, setMenu] = useState(false);
  const [query, setQuery] = useState("");
  const [modal, setModal] = useState("");
  const [globalSearch, setGlobalSearch] = useState("");

  const isPublicAuth = PUBLIC_AUTH_PATHS.includes(pathname);

  useEffect(() => {
    if (!store.ready || isPublicAuth) return;
    if (!store.user) {
      router.replace("/login");
    }
  }, [store.ready, store.user, isPublicAuth, router]);

  const slug = pathname.split("/").filter(Boolean).at(-1) || "dashboard";
  const key = pageTitles[slug] ? slug : "dashboard";
  const title = pageTitles[key];

  const handleSignOut = async () => {
    if (signingOut) return;
    setSigningOut(true);
    try {
      await store.logout();
    } finally {
      setMenu(false);
      router.replace("/login");
    }
  };

  const unread = store.notifications.filter((n) => !n.read).length;

  const routePath = (k) =>
    k === "dashboard" ? "/dashboard" : k === "vendor-portal" ? "/vendor-portal" : k === "users" ? "/admin/users" : `/${k}`;

  const roleAccess = {
    employee: ["dashboard", "purchase-requests", "vendors", "catalog", "purchase-orders", "notifications", "settings"],
    department_manager: ["dashboard", "purchase-requests", "approvals", "vendors", "rfqs", "quotations", "comparison", "purchase-orders", "contracts", "catalog", "invoices", "receiving", "budgets", "analytics", "reports", "notifications", "settings"],
    procurement_officer: ["dashboard", "purchase-requests", "approvals", "vendors", "rfqs", "quotations", "comparison", "vendor-portal", "purchase-orders", "contracts", "catalog", "invoices", "receiving", "budgets", "analytics", "reports", "notifications", "settings"],
    finance_manager: ["dashboard", "approvals", "purchase-orders", "invoices", "budgets", "analytics", "reports", "notifications", "settings"],
    director: ["dashboard", "approvals", "purchase-orders", "budgets", "analytics", "reports", "notifications", "settings"],
    vendor: ["dashboard", "vendor-portal", "quotations", "purchase-orders", "notifications", "settings"],
  };

  const navSections = sections
    .map((section) => ({
      ...section,
      items: section.items.filter(
        (item) => store.role === "admin" || !roleAccess[store.role] || roleAccess[store.role].includes(item.key)
      ),
    }))
    .filter((section) => section.items.length);

  const sidebar = (
    <aside className="flex h-screen w-[256px] shrink-0 flex-col border-r border-slate-800/90 bg-[#111827] text-slate-300">
      <Link href="/dashboard" className="flex h-[64px] items-center gap-3 border-b border-slate-800/80 px-5">
        <span className="grid size-8 place-items-center rounded-xl bg-[#1a73e8] text-[17px] font-bold text-white shadow-sm">
          P
        </span>
        <span className="text-base font-semibold tracking-tight text-white">
          pro<span className="text-blue-400">cure</span>x
        </span>
        <span className="ml-auto rounded-md bg-white/10 px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wider text-slate-300">
          Workspace
        </span>
      </Link>

      <div className="flex items-center gap-3 border-b border-slate-800/70 bg-white/[0.02] px-4 py-3.5">
        <div className="grid size-8 place-items-center rounded-xl bg-[#1a73e8]/20 text-xs font-semibold text-blue-300 ring-1 ring-blue-400/25">
          AC
        </div>
        <div className="min-w-0 flex-1">
          <p className="truncate text-xs font-semibold text-slate-100">Acme Corporation</p>
          <p className="text-[11px] text-slate-400">Pro plan</p>
        </div>
        <ChevronDown size={14} className="text-slate-500" />
      </div>

      <nav className="scrollbar-none flex-1 overflow-y-auto px-3 pb-5">
        {navSections.map((section) => (
          <div key={section.title} className="mt-4">
            <p className="mb-1.5 px-2.5 text-[10px] font-semibold uppercase tracking-[0.13em] text-slate-500">
              {section.title}
            </p>
            {section.items.map(({ key: k, label, icon: Icon, badge }) => (
              <Link
                key={k}
                href={routePath(k)}
                onClick={() => setMenu(false)}
                className={`mb-0.5 flex h-9 items-center gap-2.5 rounded-xl px-2.5 text-[13px] transition ${
                  key === k
                    ? "bg-[#1a73e8] font-semibold text-white shadow-xs"
                    : "text-slate-400 hover:bg-white/[0.06] hover:text-slate-100"
                }`}
              >
                <Icon
                  size={16}
                  strokeWidth={key === k ? 2.2 : 1.8}
                  className={key === k ? "text-white" : "text-slate-400"}
                />
                <span className="flex-1 truncate">{label}</span>
                {badge && (
                  <span
                    className={`rounded-md px-1.5 py-0.5 text-[10px] font-semibold ${
                      key === k ? "bg-white/20 text-white" : "bg-slate-800 text-slate-300"
                    }`}
                  >
                    {badge}
                  </span>
                )}
              </Link>
            ))}
          </div>
        ))}
      </nav>

      <div className="border-t border-slate-800/80 p-3">
        <Link
          href="/help"
          className="mb-2 flex h-9 items-center gap-2.5 rounded-xl px-2.5 text-[13px] text-slate-400 transition hover:bg-white/[0.06] hover:text-slate-100"
        >
          <LifeBuoy size={16} />
          Help center
          <ArrowUpRight className="ml-auto" size={13} />
        </Link>
        <div className="flex items-center gap-2.5 rounded-xl border border-slate-800/80 bg-white/[0.04] p-2">
          <div className="grid size-8 shrink-0 place-items-center rounded-full bg-indigo-500/20 text-xs font-semibold text-indigo-300">
            {(store.user?.name || "U")
              .split(" ")
              .map((x) => x[0])
              .slice(0, 2)
              .join("")}
          </div>
          <div className="min-w-0 flex-1">
            <p className="line-clamp-1 break-words text-xs font-semibold text-slate-100">
              {store.user?.name || "User"}
            </p>
            <p className="mt-0.5 break-words text-[11px] text-slate-400">
              {roleLabels[realRole] || realRole}
            </p>
          </div>
          <button
            type="button"
            aria-label="Sign out"
            title="Sign out"
            disabled={signingOut}
            onClick={handleSignOut}
            className="shrink-0 cursor-pointer rounded-lg p-1.5 text-slate-400 transition hover:bg-white/10 hover:text-white disabled:opacity-50"
          >
            <LogOut size={15} />
          </button>
        </div>
      </div>
    </aside>
  );

  const currentRoleLabel = roleLabels[store.role] || "Employee";
  const filteredLinks = useMemo(
    () => navSections.flatMap((s) => s.items).filter((x) => x.label.toLowerCase().includes(globalSearch.toLowerCase())),
    [globalSearch, navSections]
  );

  if (isPublicAuth) return null;
  if (!store.ready) {
    return (
      <div className="grid min-h-screen place-items-center bg-[#f3f5f8] text-sm text-slate-500" role="status">
        Loading your workspace…
      </div>
    );
  }
  if (!store.user) return null;

  return (
    <div className="flex min-h-screen bg-[#f3f5f8] text-slate-900">
      {menu && (
        <div className="fixed inset-0 z-40 flex md:hidden">
          <div className="relative z-50">{sidebar}</div>
          <button
            type="button"
            aria-label="Close navigation"
            className="flex-1 bg-slate-950/50"
            onClick={() => setMenu(false)}
          />
        </div>
      )}

      <div className="hidden md:block">{sidebar}</div>

      <div className="flex min-w-0 flex-1 flex-col bg-[#f3f5f8]">
        <header className="sticky top-0 z-30 flex h-[64px] items-center gap-3 border-b border-slate-200/80 bg-white/95 px-4 backdrop-blur sm:px-6">
          <button
            type="button"
            className="cursor-pointer rounded-xl p-2 text-slate-500 transition hover:bg-slate-100 md:hidden"
            aria-label="Open navigation"
            onClick={() => setMenu(true)}
          >
            <Menu size={19} />
          </button>

          <div className="hidden items-center gap-2 text-xs text-slate-400 sm:flex">
            <span>Workspace</span>
            <ChevronRight size={13} />
            <span className="font-semibold text-slate-700">{title}</span>
          </div>

          <div className="relative ml-auto hidden w-[260px] md:block">
            <Search className="pointer-events-none absolute left-3 top-2.5 text-slate-400" size={15} />
            <input
              value={globalSearch}
              onChange={(e) => setGlobalSearch(e.target.value)}
              placeholder="Search anything…"
              aria-label="Search navigation"
              className="h-9 w-full rounded-xl border border-slate-200 bg-[#f3f5f8] pl-9 pr-12 text-xs text-slate-800 outline-none transition focus:border-[#1a73e8] focus:bg-white focus:ring-4 focus:ring-blue-100"
            />
            <kbd className="absolute right-2.5 top-2 rounded border border-slate-200 bg-white px-1.5 py-0.5 text-[10px] text-slate-400">
              ⌘ K
            </kbd>
            {globalSearch && (
              <div className="absolute left-0 right-0 top-11 z-50 rounded-xl border border-slate-200 bg-white p-2 shadow-xl">
                {filteredLinks.length ? (
                  filteredLinks.map((x) => (
                    <Link
                      key={x.key}
                      href={routePath(x.key)}
                      onClick={() => setGlobalSearch("")}
                      className="flex items-center gap-2 rounded-lg px-2.5 py-2 text-sm text-slate-700 transition hover:bg-slate-50"
                    >
                      <x.icon size={15} />
                      {x.label}
                    </Link>
                  ))
                ) : (
                  <p className="p-3 text-sm text-slate-500">No results found</p>
                )}
              </div>
            )}
          </div>

          <div className="ml-auto flex items-center gap-1 md:ml-2">
            {isAdmin ? (
              <div className="hidden items-center gap-1.5 rounded-xl border border-slate-200 bg-[#f3f5f8] px-2.5 py-1.5 lg:flex">
                <span className="size-1.5 rounded-full bg-emerald-500" />
                <select
                  aria-label="Switch role preview"
                  value={store.role}
                  onChange={(e) => store.setRole(e.target.value)}
                  className="max-w-[145px] cursor-pointer bg-transparent text-[11px] font-medium text-slate-700 outline-none"
                >
                  {Object.entries(roleLabels).map(([roleKey, label]) => (
                    <option key={roleKey} value={roleKey}>
                      Preview: {label}
                    </option>
                  ))}
                </select>
              </div>
            ) : (
              <div className="hidden items-center gap-1.5 rounded-xl border border-slate-200 bg-[#f3f5f8] px-2.5 py-1.5 lg:flex">
                <span className="size-1.5 rounded-full bg-emerald-500" />
                <span className="text-[11px] font-medium text-slate-700">
                  {roleLabels[realRole] || realRole}
                </span>
              </div>
            )}

            <IconButton label="Notifications" onClick={() => router.push("/notifications")}>
              <span className="relative">
                <Bell size={18} />
                {unread > 0 && (
                  <span className="absolute -right-1 -top-1 grid size-3.5 place-items-center rounded-full bg-rose-500 text-[9px] font-semibold text-white">
                    {unread}
                  </span>
                )}
              </span>
            </IconButton>

            <button
              type="button"
              onClick={() => router.push("/settings")}
              aria-label="Settings"
              className="hidden cursor-pointer rounded-xl p-2 text-slate-500 transition hover:bg-slate-100 sm:block"
            >
              <Settings size={17} />
            </button>
          </div>
        </header>

        <main className="mx-auto w-full max-w-[1480px] flex-1 bg-[#f3f5f8] px-4 py-6 sm:px-6 lg:px-8 lg:py-7">
          {key === "dashboard" ? (
            <Dashboard store={store} openModal={setModal} />
          ) : key === "analytics" || key === "reports" ? (
            <Analytics store={store} />
          ) : key === "notifications" ? (
            <Notifications store={store} />
          ) : key === "settings" ? (
            <SettingsPage store={store} />
          ) : key === "help" ? (
            <>
              <PageHeader
                title="Help center"
                description="Find answers and get support from our procurement specialists."
              />
              <Surface className="p-6">
                <h2 className="font-semibold text-slate-900">How can we help?</h2>
                <p className="mt-2 text-sm text-slate-500">
                  Browse guides, learn about workflows, or contact your workspace administrator.
                </p>
                <div className="mt-5 grid gap-3 sm:grid-cols-2">
                  {[
                    "Getting started with procurement",
                    "Submitting a purchase request",
                    "Managing supplier relationships",
                    "Understanding approvals",
                  ].map((x) => (
                    <button
                      key={x}
                      type="button"
                      className="flex cursor-pointer items-center justify-between rounded-xl border border-slate-200 p-4 text-left text-sm font-medium text-slate-700 transition hover:border-blue-200 hover:bg-blue-50/30"
                    >
                      <span>{x}</span>
                      <ChevronRight size={16} className="text-slate-400" />
                    </button>
                  ))}
                </div>
              </Surface>
            </>
          ) : (
            <RecordsPage
              kind={key}
              store={store}
              openModal={setModal}
              search={query}
              setSearch={setQuery}
            />
          )}
        </main>

        <footer className="flex flex-wrap items-center justify-between gap-2 border-t border-slate-200/80 bg-[#f3f5f8] px-5 py-3 text-[11px] text-slate-400 sm:px-8">
          <span>© 2026 ProCureX, Inc. · All rights reserved</span>
          <span className="flex items-center gap-3">
            <span>
              All systems operational <i className="ml-1 inline-block size-1.5 rounded-full bg-emerald-500" />
            </span>
            <span>v2.4.0</span>
            <span className="hidden lg:inline">
              {isAdmin ? "Role preview" : "Role"}: {currentRoleLabel}
            </span>
          </span>
        </footer>
      </div>

      {modal && (
        <FormModal
          type={modal}
          onClose={() => setModal("")}
          defaultRequester={store.user?.name || "Ayesha Khan"}
          onSave={
            modal === "vendor"
              ? store.addVendor
              : (r) => store.addRequest({ ...r, requester: store.user?.name || r.requester })
          }
          vendors={store.vendors}
        />
      )}
    </div>
  );
}