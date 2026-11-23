"use client";
import Link from "next/link";
import { useState } from "react";
import { useStore } from "../../lib/store";
import {
  PageHeader,
  Surface,
  SectionTitle,
  Status,
  fmt,
} from "../../components/dashboard/primitives";
import { Building2, ExternalLink, Plus, Search, Trash2, X } from "lucide-react";
const categories = [
  "IT Equipment",
  "Office Supplies",
  "Logistics",
  "Furniture",
  "Professional Services",
  "Other",
];
export default function VendorsPage() {
  const store = useStore();
  const [q, setQ] = useState("");
  const [category, setCategory] = useState("all");
  const [status, setStatus] = useState("all");
  const [editing, setEditing] = useState(null);
  const [remove, setRemove] = useState(null);
  const rows = store.vendors.filter(
    (v) =>
      `${v.name} ${v.contact} ${v.category}`
        .toLowerCase()
        .includes(q.toLowerCase()) &&
      (category === "all" || v.category === category) &&
      (status === "all" || v.status === status),
  );
  function save(e) {
    e.preventDefault();
    const f = new FormData(e.currentTarget);
    const data = {
      name: f.get("name"),
      category: f.get("category"),
      contact: f.get("contact"),
      phone: f.get("phone"),
      ntn: f.get("ntn"),
      status: f.get("status"),
    };
    if (editing?.id) store.updateVendor(editing.id, data);
    else store.addVendor(data);
    setEditing(null);
  }
  return (
    <main className="min-h-screen bg-[#f7f8fa] p-4 md:p-8">
      <div className="mx-auto max-w-[1300px]">
        <PageHeader
          title="Vendors"
          description="Manage approved suppliers, compliance, and delivery performance."
          action={
            <button
              onClick={() => setEditing({})}
              className="inline-flex h-10 items-center gap-2 rounded-lg bg-[#1a73e8] px-4 text-sm font-medium text-white"
            >
              <Plus size={16} />
              Add vendor
            </button>
          }
        />
        <div className="mb-4 grid gap-4 sm:grid-cols-3">
          <Surface className="p-4">
            <p className="text-xs text-slate-500">Approved suppliers</p>
            <b className="mt-1 block text-2xl">
              {store.vendors.filter((v) => v.status === "Active").length}
            </b>
          </Surface>
          <Surface className="p-4">
            <p className="text-xs text-slate-500">Average rating</p>
            <b className="mt-1 block text-2xl">
              {(
                store.vendors.reduce((a, v) => a + Number(v.rating || 0), 0) /
                Math.max(store.vendors.length, 1)
              ).toFixed(1)}{" "}
              / 5
            </b>
          </Surface>
          <Surface className="p-4">
            <p className="text-xs text-slate-500">YTD spend</p>
            <b className="mt-1 block text-2xl">
              {fmt(store.vendors.reduce((a, v) => a + Number(v.spend || 0), 0))}
            </b>
          </Surface>
        </div>
        <Surface>
          <SectionTitle
            title="Supplier directory"
            sub={`${rows.length} suppliers match your filters`}
          />
          <div className="flex flex-wrap gap-2 p-4">
            <label className="relative min-w-[220px] flex-1">
              <Search
                size={15}
                className="absolute left-3 top-2.5 text-slate-400"
              />
              <input
                aria-label="Search vendors"
                value={q}
                onChange={(e) => setQ(e.target.value)}
                placeholder="Search suppliers…"
                className="field-input pl-9"
              />
            </label>
            <select
              aria-label="Filter by category"
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              className="field-input w-auto min-w-40"
            >
              <option value="all">All categories</option>
              {categories.map((x) => (
                <option key={x}>{x}</option>
              ))}
            </select>
            <select
              aria-label="Filter by status"
              value={status}
              onChange={(e) => setStatus(e.target.value)}
              className="field-input w-auto min-w-36"
            >
              <option value="all">All statuses</option>
              <option>Active</option>
              <option>On hold</option>
            </select>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full min-w-[950px] text-left text-sm">
              <thead className="border-y border-slate-100 bg-slate-50/70 text-[10px] uppercase tracking-wider text-slate-400">
                <tr>
                  {[
                    "Supplier",
                    "Category",
                    "Rating",
                    "NTN",
                    "YTD spend",
                    "On-time",
                    "Status",
                    "Actions",
                  ].map((x) => (
                    <th key={x} className="px-4 py-3 font-semibold">
                      {x}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {rows.map((v) => (
                  <tr key={v.id} className="border-b border-slate-50">
                    <td className="px-4 py-3">
                      <Link
                        href={`/vendors/${v.id}`}
                        className="flex items-center gap-3"
                      >
                        <span className="grid size-9 place-items-center rounded-lg bg-blue-50 text-blue-700">
                          <Building2 size={16} />
                        </span>
                        <span>
                          <b className="block font-medium text-slate-800 hover:text-blue-700">
                            {v.name}
                          </b>
                          <small className="text-slate-500">{v.contact}</small>
                        </span>
                      </Link>
                    </td>
                    <td className="px-4 py-3 text-slate-600">{v.category}</td>
                    <td className="px-4 py-3">
                      {v.rating ? `★ ${Number(v.rating).toFixed(1)}` : "New"}
                    </td>
                    <td className="px-4 py-3 text-slate-500">{v.ntn || "—"}</td>
                    <td className="px-4 py-3 font-medium">{fmt(v.spend)}</td>
                    <td className="px-4 py-3">
                      {v.delivery ? `${v.delivery}%` : "—"}
                    </td>
                    <td className="px-4 py-3">
                      <Status value={v.status} />
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex gap-1">
                        <button
                          onClick={() => setEditing(v)}
                          className="rounded-md border border-slate-200 px-2.5 py-1.5 text-xs font-medium hover:bg-slate-50"
                        >
                          Edit
                        </button>
                        <button
                          onClick={() => setRemove(v)}
                          aria-label={`Remove ${v.name}`}
                          className="rounded-md p-2 text-slate-400 hover:bg-rose-50 hover:text-rose-600"
                        >
                          <Trash2 size={15} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
            {rows.length === 0 && (
              <p className="p-10 text-center text-sm text-slate-500">
                No suppliers match these filters.
              </p>
            )}
          </div>
        </Surface>
      </div>
      {editing && (
        <div className="fixed inset-0 z-50 grid place-items-center bg-slate-950/40 p-4">
          <form
            onSubmit={save}
            className="w-full max-w-lg rounded-2xl bg-white p-6 shadow-2xl"
          >
            <div className="mb-5 flex justify-between">
              <div>
                <h2 className="font-semibold">
                  {editing.id ? "Edit supplier" : "Add supplier"}
                </h2>
                <p className="mt-1 text-xs text-slate-500">
                  Keep supplier and compliance details up to date.
                </p>
              </div>
              <button
                type="button"
                aria-label="Close"
                onClick={() => setEditing(null)}
                className="text-slate-500"
              >
                <X size={18} />
              </button>
            </div>
            <div className="grid gap-4 sm:grid-cols-2">
              <label className="field-label sm:col-span-2">
                Legal company name
                <input
                  name="name"
                  required
                  defaultValue={editing.name || ""}
                  className="field-input"
                />
              </label>
              <label className="field-label">
                Category
                <select
                  name="category"
                  defaultValue={editing.category || categories[0]}
                  className="field-input"
                >
                  {categories.map((x) => (
                    <option key={x}>{x}</option>
                  ))}
                </select>
              </label>
              <label className="field-label">
                Status
                <select
                  name="status"
                  defaultValue={editing.status || "Active"}
                  className="field-input"
                >
                  <option>Active</option>
                  <option>On hold</option>
                </select>
              </label>
              <label className="field-label">
                Contact email
                <input
                  name="contact"
                  type="email"
                  required
                  defaultValue={editing.contact || ""}
                  className="field-input"
                />
              </label>
              <label className="field-label">
                Phone
                <input
                  name="phone"
                  defaultValue={editing.phone || ""}
                  className="field-input"
                />
              </label>
              <label className="field-label sm:col-span-2">
                Tax registration / NTN
                <input
                  name="ntn"
                  defaultValue={editing.ntn || ""}
                  className="field-input"
                />
              </label>
            </div>
            <button className="mt-5 h-10 w-full rounded-lg bg-[#1a73e8] text-sm font-medium text-white">
              {editing.id ? "Save supplier" : "Add supplier"}
            </button>
          </form>
        </div>
      )}
      {remove && (
        <div className="fixed inset-0 z-50 grid place-items-center bg-slate-950/40 p-4">
          <div
            role="alertdialog"
            aria-modal="true"
            className="w-full max-w-sm rounded-2xl bg-white p-6 shadow-2xl"
          >
            <h2 className="font-semibold">Remove {remove.name}?</h2>
            <p className="mt-2 text-sm text-slate-500">
              This supplier will be removed from the workspace directory.
            </p>
            <div className="mt-5 flex justify-end gap-2">
              <button
                onClick={() => setRemove(null)}
                className="rounded-lg border border-slate-200 px-3 py-2 text-sm"
              >
                Cancel
              </button>
              <button
                onClick={() => {
                  store.deleteVendor(remove.id);
                  setRemove(null);
                }}
                className="rounded-lg bg-rose-600 px-3 py-2 text-sm font-medium text-white"
              >
                Remove supplier
              </button>
            </div>
          </div>
        </div>
      )}
    </main>
  );
}
