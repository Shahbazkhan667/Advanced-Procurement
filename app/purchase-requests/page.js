"use client";
import Link from "next/link";
import { useMemo, useState } from "react";
import { useStore } from "../../lib/store";
import {
  PageHeader,
  Surface,
  SectionTitle,
  Status,
  fmt,
  Button,
} from "../../components/dashboard/primitives";
import { ChevronRight, Plus, Search } from "lucide-react";
const stages = [
  "Draft",
  "Pending approval",
  "Approved",
  "In sourcing",
  "Completed",
];
export default function PurchaseRequestsPage() {
  const store = useStore();
  const [q, setQ] = useState("");
  const [department, setDepartment] = useState("all");
  const [status, setStatus] = useState("all");
  const rows = useMemo(
    () =>
      store.requests.filter(
        (r) =>
          `${r.id} ${r.title} ${r.requester}`
            .toLowerCase()
            .includes(q.toLowerCase()) &&
          (department === "all" || r.department === department) &&
          (status === "all" || r.status === status),
      ),
    [store.requests, q, department, status],
  );
  return (
    <main className="min-h-screen bg-[#f7f8fa] p-4 md:p-8">
      <div className="mx-auto max-w-[1300px]">
        <PageHeader
          title="Purchase requests"
          description="Track buying needs, approval status, and sourcing progress."
          action={
            <Link href="/purchase-requests/new">
              <Button icon={Plus}>New request</Button>
            </Link>
          }
        />
        <div className="mb-4 grid gap-4 sm:grid-cols-3">
          <Surface className="p-4">
            <p className="text-xs text-slate-500">Open requests</p>
            <b className="mt-1 block text-2xl">
              {
                store.requests.filter(
                  (r) => !["Completed", "Rejected"].includes(r.status),
                ).length
              }
            </b>
          </Surface>
          <Surface className="p-4">
            <p className="text-xs text-slate-500">Awaiting approval</p>
            <b className="mt-1 block text-2xl">
              {
                store.requests.filter((r) => r.status.includes("Pending"))
                  .length
              }
            </b>
          </Surface>
          <Surface className="p-4">
            <p className="text-xs text-slate-500">Total requested value</p>
            <b className="mt-1 block text-xl">
              {fmt(
                store.requests.reduce((a, r) => a + Number(r.amount || 0), 0),
              )}
            </b>
          </Surface>
        </div>
        <Surface>
          <SectionTitle
            title="All purchase requests"
            sub={`${rows.length} matching requests`}
          />
          <div className="flex flex-wrap gap-2 p-4">
            <label className="relative min-w-[220px] flex-1">
              <Search
                size={15}
                className="absolute left-3 top-2.5 text-slate-400"
              />
              <input
                value={q}
                onChange={(e) => setQ(e.target.value)}
                aria-label="Search purchase requests"
                placeholder="Search requests…"
                className="field-input pl-9"
              />
            </label>
            <select
              aria-label="Filter by department"
              value={department}
              onChange={(e) => setDepartment(e.target.value)}
              className="field-input w-auto min-w-40"
            >
              <option value="all">All departments</option>
              {store.departments.map((d) => (
                <option key={d}>{d}</option>
              ))}
            </select>
            <select
              aria-label="Filter by status"
              value={status}
              onChange={(e) => setStatus(e.target.value)}
              className="field-input w-auto min-w-40"
            >
              <option value="all">All statuses</option>
              {[...new Set(store.requests.map((r) => r.status))].map((s) => (
                <option key={s}>{s}</option>
              ))}
            </select>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full min-w-[900px] text-left text-sm">
              <thead className="border-y border-slate-100 bg-slate-50/70 text-[10px] uppercase tracking-wider text-slate-400">
                <tr>
                  {[
                    "Request",
                    "Requester / department",
                    "Date",
                    "Amount",
                    "Status",
                    "Progress",
                    "",
                  ].map((x) => (
                    <th key={x} className="px-4 py-3 font-semibold">
                      {x}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {rows.map((r) => {
                  const step = Math.max(0, stages.indexOf(r.status));
                  return (
                    <tr
                      key={r.id}
                      className="border-b border-slate-50 hover:bg-slate-50/40"
                    >
                      <td className="px-4 py-3">
                        <Link
                          href={`/purchase-requests/${r.id}`}
                          className="font-medium text-[#1a73e8] hover:underline"
                        >
                          {r.id}
                        </Link>
                        <p className="mt-1 max-w-[260px] truncate text-xs text-slate-500">
                          {r.title}
                        </p>
                      </td>
                      <td className="px-4 py-3">
                        <span>{r.requester}</span>
                        <p className="mt-1 text-xs text-slate-500">
                          {r.department}
                        </p>
                      </td>
                      <td className="px-4 py-3 text-slate-500">{r.date}</td>
                      <td className="px-4 py-3 font-medium">{fmt(r.amount)}</td>
                      <td className="px-4 py-3">
                        <Status value={r.status} />
                      </td>
                      <td className="px-4 py-3">
                        <div
                          className="flex items-center gap-1"
                          aria-label={`Workflow stage ${step + 1} of ${stages.length}`}
                        >
                          {stages.map((s, i) => (
                            <span
                              key={s}
                              title={s}
                              className={`h-1.5 w-7 rounded-full ${i <= step ? "bg-[#1a73e8]" : "bg-slate-200"}`}
                            />
                          ))}
                        </div>
                      </td>
                      <td className="px-4 py-3">
                        <Link
                          aria-label={`View ${r.id}`}
                          href={`/purchase-requests/${r.id}`}
                          className="rounded-md p-2 text-slate-400 hover:bg-blue-50 hover:text-blue-700"
                        >
                          <ChevronRight size={17} />
                        </Link>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
            {rows.length === 0 && (
              <p className="p-10 text-center text-sm text-slate-500">
                No requests match your filters.
              </p>
            )}
          </div>
        </Surface>
      </div>
    </main>
  );
}
