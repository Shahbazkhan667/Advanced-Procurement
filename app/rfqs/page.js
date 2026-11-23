"use client";
import { useState } from "react";
import { useStore } from "../../lib/store";
import {
  PageHeader,
  Surface,
  SectionTitle,
  Status,
  fmt,
} from "../../components/dashboard/primitives";
import { CalendarDays, Check, Plus, Send, X } from "lucide-react";
const demo = [
  {
    id: "RFQ-2026-024",
    title: "Laptops — engineering refresh",
    requestId: "PR-2026-041",
    vendor: "5 invited",
    due: "2026-11-28",
    amount: 1480000,
    status: "Open",
  },
  {
    id: "RFQ-2026-023",
    title: "Office supply contract",
    requestId: "PR-2026-040",
    vendor: "3 invited",
    due: "2026-11-25",
    amount: 185000,
    status: "Open",
  },
  {
    id: "RFQ-2026-022",
    title: "Cloud services renewal",
    requestId: "PR-2026-038",
    vendor: "4 invited",
    due: "2026-11-20",
    amount: 920000,
    status: "Evaluation",
  },
  {
    id: "RFQ-2026-021",
    title: "Conference room furniture",
    requestId: "PR-2026-039",
    vendor: "3 invited",
    due: "2026-11-15",
    amount: 640000,
    status: "Awarded",
  },
];
export default function RFQPage() {
  const store = useStore();
  const [open, setOpen] = useState(false);
  const [notice, setNotice] = useState("");
  const rfqs = [...store.rfqs, ...demo];
  const approved = store.requests.filter((r) =>
    ["Approved", "In sourcing"].includes(r.status),
  );
  function submit(e) {
    e.preventDefault();
    const f = new FormData(e.currentTarget);
    const invited = Array.from(
      e.currentTarget.querySelectorAll('input[name="vendors"]:checked'),
    ).map((x) => x.value);
    if (!invited.length) {
      setNotice("Select at least one supplier to invite.");
      return;
    }
    const request = store.requests.find((r) => r.id === f.get("request"));
    store.addRFQ({
      title: f.get("title"),
      requestId: request?.id || "",
      requestTitle: request?.title || "",
      amount: request?.amount || 0,
      due: f.get("due"),
      vendors: invited,
      notes: f.get("notes"),
    });
    if (request) store.updateRequest(request.id, { status: "In sourcing" });
    store.addNotification({
      title: "New RFQ published",
      detail: `${f.get("title")} · ${invited.length} suppliers invited`,
    });
    setNotice("Sourcing event published and suppliers invited.");
    setOpen(false);
  }
  return (
    <main className="min-h-screen bg-[#f7f8fa] p-4 md:p-8">
      <div className="mx-auto max-w-[1300px]">
        <PageHeader
          title="Requests for quote"
          description="Invite approved suppliers to submit comparable pricing and delivery terms."
          action={
            <button
              onClick={() => {
                setOpen(true);
                setNotice("");
              }}
              className="inline-flex h-10 items-center gap-2 rounded-lg bg-[#1a73e8] px-4 text-sm font-medium text-white"
            >
              <Plus size={16} />
              Create RFQ
            </button>
          }
        />
        {notice && !open && (
          <p
            role="status"
            className="mb-4 rounded-lg bg-emerald-50 p-3 text-sm text-emerald-800"
          >
            {notice}
          </p>
        )}
        <div className="mb-4 grid gap-4 sm:grid-cols-3">
          <Surface className="p-4">
            <p className="text-xs text-slate-500">Open events</p>
            <b className="mt-1 block text-2xl">
              {rfqs.filter((r) => r.status === "Open").length}
            </b>
          </Surface>
          <Surface className="p-4">
            <p className="text-xs text-slate-500">Supplier invitations</p>
            <b className="mt-1 block text-2xl">
              {rfqs.reduce(
                (a, r) =>
                  a + (r.vendors?.length || Number.parseInt(r.vendor) || 0),
                0,
              )}
            </b>
          </Surface>
          <Surface className="p-4">
            <p className="text-xs text-slate-500">Quotes to review</p>
            <b className="mt-1 block text-2xl">{store.quotations.length}</b>
          </Surface>
        </div>
        <Surface>
          <SectionTitle
            title="Sourcing events"
            sub="Track response deadlines and supplier participation"
          />
          <div className="overflow-x-auto">
            <table className="w-full min-w-[850px] text-left text-sm">
              <thead className="border-y border-slate-100 bg-slate-50/70 text-[10px] uppercase tracking-wider text-slate-400">
                <tr>
                  {[
                    "RFQ",
                    "Linked request",
                    "Invited suppliers",
                    "Est. value",
                    "Due date",
                    "Status",
                    "Quotes",
                  ].map((x) => (
                    <th key={x} className="px-4 py-3 font-semibold">
                      {x}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {rfqs.map((r) => (
                  <tr key={r.id} className="border-b border-slate-50">
                    <td className="px-4 py-4">
                      <b className="font-medium text-[#1a73e8]">{r.id}</b>
                      <p className="mt-1 text-xs text-slate-500">{r.title}</p>
                    </td>
                    <td className="px-4 py-4 text-slate-600">
                      {r.requestId || "—"}
                    </td>
                    <td className="px-4 py-4 text-slate-600">
                      {r.vendors?.join(", ") || r.vendor}
                    </td>
                    <td className="px-4 py-4">{fmt(r.amount)}</td>
                    <td className="px-4 py-4 text-slate-500">{r.due}</td>
                    <td className="px-4 py-4">
                      <Status value={r.status} />
                    </td>
                    <td className="px-4 py-4">
                      {store.quotations.filter((q) => q.rfqId === r.id)
                        .length || "—"}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Surface>
      </div>
      {open && (
        <div className="fixed inset-0 z-50 grid place-items-center bg-slate-950/40 p-4">
          <form
            onSubmit={submit}
            className="max-h-[90vh] w-full max-w-xl overflow-y-auto rounded-2xl bg-white p-6 shadow-2xl"
          >
            <div className="mb-5 flex items-start justify-between">
              <div>
                <h2 className="font-semibold">Create request for quote</h2>
                <p className="mt-1 text-xs text-slate-500">
                  Choose an approved request and invite suppliers.
                </p>
              </div>
              <button
                type="button"
                onClick={() => setOpen(false)}
                aria-label="Close"
                className="text-slate-500"
              >
                <X size={18} />
              </button>
            </div>
            {notice && (
              <p role="alert" className="mb-3 text-sm text-rose-600">
                {notice}
              </p>
            )}
            <div className="flex flex-col gap-4">
              <label className="field-label">
                Approved purchase request
                <select name="request" required className="field-input">
                  {approved.length ? (
                    approved.map((r) => (
                      <option key={r.id} value={r.id}>
                        {r.id} · {r.title}
                      </option>
                    ))
                  ) : (
                    <option value="">No approved requests available</option>
                  )}
                </select>
              </label>
              <label className="field-label">
                RFQ title
                <input
                  name="title"
                  required
                  placeholder="Sourcing event title"
                  className="field-input"
                />
              </label>
              <label className="field-label">
                Response deadline
                <input
                  name="due"
                  type="date"
                  required
                  min={new Date().toISOString().slice(0, 10)}
                  className="field-input"
                />
              </label>
              <fieldset>
                <legend className="mb-2 text-xs font-semibold text-slate-600">
                  Invite suppliers
                </legend>
                <div className="grid gap-2 sm:grid-cols-2">
                  {store.vendors
                    .filter((v) => v.status === "Active")
                    .map((v) => (
                      <label
                        key={v.id}
                        className="flex items-center gap-2 rounded-lg border border-slate-200 p-3 text-xs text-slate-700"
                      >
                        <input
                          type="checkbox"
                          name="vendors"
                          value={v.name}
                          className="accent-[#1a73e8]"
                        />
                        {v.name}
                      </label>
                    ))}
                </div>
              </fieldset>
              <label className="field-label">
                Sourcing notes
                <textarea
                  name="notes"
                  rows="3"
                  placeholder="Scope, delivery address, and submission requirements"
                  className="field-input h-auto resize-y"
                />
              </label>
              <button className="inline-flex h-10 items-center justify-center gap-2 rounded-lg bg-[#1a73e8] text-sm font-medium text-white">
                <Send size={15} />
                Publish RFQ and invite suppliers
              </button>
            </div>
          </form>
        </div>
      )}
    </main>
  );
}
