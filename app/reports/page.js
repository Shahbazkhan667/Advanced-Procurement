"use client";
import { useMemo, useState } from "react";
import {
  Bar,
  BarChart,
  CartesianGrid,
  Legend,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import { useStore } from "../../lib/store";
import { spendTrend } from "../../lib/mockData";
import {
  PageHeader,
  Surface,
  SectionTitle,
  fmt,
} from "../../components/dashboard/primitives";
import { Download } from "lucide-react";
export default function ReportsPage() {
  const store = useStore();
  const [department, setDepartment] = useState("all");
  const [period, setPeriod] = useState("6");
  const months = spendTrend.slice(-Number(period));
  const requests = store.requests.filter(
    (r) => department === "all" || r.department === department,
  );
  const total = requests.reduce((a, r) => a + Number(r.amount || 0), 0);
  const vendorData = store.vendors.map((v) => ({
    name: v.name.split(" ")[0],
    spend: v.spend,
    rating: v.rating,
  }));
  const chartData = useMemo(
    () =>
      months.map((x) => ({
        ...x,
        spend: x.spend * 1000000,
        budget: x.budget * 1000000,
      })),
    [months],
  );
  function exportCSV() {
    const lines = [
      ["ProcureX spend report"],
      ["Period", period + " months"],
      ["Department", department === "all" ? "All departments" : department],
      ["Request ID", "Request", "Department", "Requester", "Amount", "Status"],
      ...requests.map((r) => [
        r.id,
        r.title,
        r.department,
        r.requester,
        r.amount,
        r.status,
      ]),
    ];
    const csv = lines
      .map((row) =>
        row.map((x) => `"${String(x).replaceAll('"', '""')}"`).join(","),
      )
      .join("\n");
    const url = URL.createObjectURL(
      new Blob([csv], { type: "text/csv;charset=utf-8" }),
    );
    const a = document.createElement("a");
    a.href = url;
    a.download = "procurex-spend-report.csv";
    a.click();
    URL.revokeObjectURL(url);
  }
  return (
    <main className="min-h-screen bg-[#f7f8fa] p-4 md:p-8">
      <div className="mx-auto max-w-[1300px]">
        <PageHeader
          title="Procurement reports"
          description="Analyze spend, suppliers, and request activity across your organization."
          action={
            <button
              onClick={exportCSV}
              className="inline-flex h-10 items-center gap-2 rounded-lg border border-slate-200 bg-white px-4 text-sm font-medium text-slate-700"
            >
              <Download size={16} />
              Export CSV
            </button>
          }
        />
        <div className="mb-5 flex flex-wrap gap-3">
          <label className="field-label">
            Department
            <select
              value={department}
              onChange={(e) => setDepartment(e.target.value)}
              className="field-input w-52"
            >
              {["all", ...store.departments].map((d) => (
                <option key={d} value={d}>
                  {d === "all" ? "All departments" : d}
                </option>
              ))}
            </select>
          </label>
          <label className="field-label">
            Reporting period
            <select
              value={period}
              onChange={(e) => setPeriod(e.target.value)}
              className="field-input w-44"
            >
              <option value="3">Last 3 months</option>
              <option value="6">Last 6 months</option>
            </select>
          </label>
        </div>
        <div className="mb-5 grid gap-4 sm:grid-cols-3">
          <Surface className="p-5">
            <p className="text-xs text-slate-500">Filtered request value</p>
            <b className="mt-2 block text-2xl">{fmt(total)}</b>
          </Surface>
          <Surface className="p-5">
            <p className="text-xs text-slate-500">Requests in view</p>
            <b className="mt-2 block text-2xl">{requests.length}</b>
          </Surface>
          <Surface className="p-5">
            <p className="text-xs text-slate-500">Active suppliers</p>
            <b className="mt-2 block text-2xl">
              {store.vendors.filter((v) => v.status === "Active").length}
            </b>
          </Surface>
        </div>
        <div className="grid gap-4 xl:grid-cols-2">
          <Surface>
            <SectionTitle
              title="Monthly spend vs. budget"
              sub="PKR · selected reporting period"
            />
            <div className="h-[300px] p-4">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={chartData}>
                  <CartesianGrid vertical={false} stroke="#edf0f5" />
                  <XAxis dataKey="month" tickLine={false} axisLine={false} />
                  <YAxis
                    tickFormatter={(v) => `$${v / 1000000}m`}
                    tickLine={false}
                    axisLine={false}
                  />
                  <Tooltip formatter={(v) => fmt(v)} />
                  <Legend />
                  <Bar
                    dataKey="spend"
                    name="Actual spend"
                    fill="#1a73e8"
                    radius={[4, 4, 0, 0]}
                  />
                  <Bar
                    dataKey="budget"
                    name="Budget"
                    fill="#dbe7f7"
                    radius={[4, 4, 0, 0]}
                  />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </Surface>
          <Surface>
            <SectionTitle
              title="Supplier spend"
              sub="Year-to-date recorded spend by vendor"
            />
            <div className="h-[300px] p-4">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart
                  data={vendorData}
                  layout="vertical"
                  margin={{ left: 10, right: 20 }}
                >
                  <CartesianGrid horizontal={false} stroke="#edf0f5" />
                  <XAxis
                    type="number"
                    tickFormatter={(v) => `$${v / 1000000}m`}
                    tickLine={false}
                    axisLine={false}
                  />
                  <YAxis
                    type="category"
                    dataKey="name"
                    tickLine={false}
                    axisLine={false}
                  />
                  <Tooltip formatter={(v) => fmt(v)} />
                  <Bar
                    dataKey="spend"
                    name="Spend"
                    fill="#4f46e5"
                    radius={[0, 4, 4, 0]}
                  />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </Surface>
        </div>
      </div>
    </main>
  );
}
