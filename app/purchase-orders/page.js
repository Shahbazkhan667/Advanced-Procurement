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
import { Check, ChevronRight, Plus, Send, X } from "lucide-react";
const nextStatus = {
  Draft: "Approved",
  Approved: "Sent",
  Sent: "Partially Received",
  "Partially Received": "Completed",
};
export default function PurchaseOrdersPage() {
  const store = useStore();
  const [open, setOpen] = useState(false);
  const [message, setMessage] = useState("");
  const approved = store.requests.filter((r) =>
    ["Approved", "In sourcing"].includes(r.status),
  );
  function create(e) {
    e.preventDefault();
    const f = new FormData(e.currentTarget);
    const request = store.requests.find((x) => x.id === f.get("request"));
    const vendor = store.vendors.find((x) => x.id === f.get("vendor"));
    if (!request || !vendor) return;
    store.addPO({
      requestId: request.id,
      vendor: vendor.name,
      amount: Number(f.get("amount")) || request.amount,
      status: "Draft",
      items: request.items,
    });
    store.updateRequest(request.id, { status: "In sourcing" });
    store.addNotification({
      title: "Purchase order created",
      detail: `${request.id} · ${vendor.name}`,
    });
    setOpen(false);
    setMessage("Purchase order created as a draft.");
  }
  function advance(po) {
    const status = nextStatus[po.status];
    if (!status) return;
    store.updatePO(po.id, { status });
    store.addNotification({
      title: `Purchase order ${status.toLowerCase()}`,
      detail: `${po.id} · ${po.vendor}`,
    });
  }
  return (
    <main className="min-h-screen bg-[#f7f8fa] p-4 md:p-8">
      <div className="mx-auto max-w-[1300px]">
        <PageHeader
          title="Purchase orders"
          description="Create approved orders and track them through delivery and receiving."
          action={
            <button
              onClick={() => {
                setOpen(true);
                setMessage("");
              }}
              className="inline-flex h-10 items-center gap-2 rounded-lg bg-[#1a73e8] px-4 text-sm font-medium text-white"
            >
              <Plus size={16} />
              Create purchase order
            </button>
          }
        />
        {message && (
          <p
            role="status"
            className="mb-4 rounded-lg bg-emerald-50 p-3 text-sm text-emerald-800"
          >
            {message}
          </p>
        )}
        <div className="mb-4 grid gap-4 sm:grid-cols-4">
          {["Draft", "Approved", "Sent", "Partially Received"].map((s) => (
            <Surface key={s} className="p-4">
              <p className="text-xs text-slate-500">{s}</p>
              <b className="mt-1 block text-2xl">
                {store.purchaseOrders.filter((p) => p.status === s).length}
              </b>
            </Surface>
          ))}
        </div>
        <Surface>
          <SectionTitle
            title="All purchase orders"
            sub="Open an order to review or print the purchase document"
          />
          <div className="overflow-x-auto">
            <table className="w-full min-w-[850px] text-left text-sm">
              <thead className="border-y border-slate-100 bg-slate-50/70 text-[10px] uppercase tracking-wider text-slate-400">
                <tr>
                  {[
                    "Order",
                    "Request",
                    "Supplier",
                    "Date",
                    "Amount",
                    "Status",
                    "Next action",
                    "",
                  ].map((x) => (
                    <th key={x} className="px-4 py-3 font-semibold">
                      {x}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {store.purchaseOrders.map((po) => (
                  <tr key={po.id} className="border-b border-slate-50">
                    <td className="px-4 py-4">
                      <Link
                        href={`/purchase-orders/${po.id}`}
                        className="font-medium text-[#1a73e8] hover:underline"
                      >
                        {po.id}
                      </Link>
                    </td>
                    <td className="px-4 py-4 text-slate-600">{po.requestId}</td>
                    <td className="px-4 py-4">{po.vendor}</td>
                    <td className="px-4 py-4 text-slate-500">{po.date}</td>
                    <td className="px-4 py-4 font-medium">{fmt(po.amount)}</td>
                    <td className="px-4 py-4">
                      <Status value={po.status} />
                    </td>
                    <td className="px-4 py-4">
                      {nextStatus[po.status] ? (
                        <button
                          onClick={() => advance(po)}
                          className="inline-flex items-center gap-1 rounded-md border border-slate-200 px-2.5 py-1.5 text-xs font-medium text-slate-600 hover:bg-slate-50"
                        >
                          {po.status === "Draft" ? (
                            <Check size={13} />
                          ) : (
                            <Send size={13} />
                          )}
                          Mark {nextStatus[po.status]}
                        </button>
                      ) : (
                        <span className="text-xs text-slate-400">Complete</span>
                      )}
                    </td>
                    <td className="px-4 py-4">
                      <Link
                        aria-label={`View ${po.id}`}
                        href={`/purchase-orders/${po.id}`}
                      >
                        <ChevronRight size={17} className="text-slate-400" />
                      </Link>
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
            onSubmit={create}
            className="w-full max-w-lg rounded-2xl bg-white p-6 shadow-2xl"
          >
            <div className="mb-5 flex justify-between">
              <div>
                <h2 className="font-semibold">Create purchase order</h2>
                <p className="mt-1 text-xs text-slate-500">
                  Create a draft from an approved request and selected supplier.
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
            <div className="flex flex-col gap-4">
              <label className="field-label">
                Approved request
                <select name="request" required className="field-input">
                  {approved.map((r) => (
                    <option key={r.id} value={r.id}>
                      {r.id} · {r.title} · {fmt(r.amount)}
                    </option>
                  ))}
                </select>
              </label>
              <label className="field-label">
                Supplier
                <select name="vendor" required className="field-input">
                  {store.vendors
                    .filter((v) => v.status === "Active")
                    .map((v) => (
                      <option key={v.id} value={v.id}>
                        {v.name}
                      </option>
                    ))}
                </select>
              </label>
              <label className="field-label">
                Final order amount
                <input
                  name="amount"
                  type="number"
                  min="1"
                  placeholder="Defaults to request total"
                  className="field-input"
                />
              </label>
              <p className="rounded-lg bg-blue-50 p-3 text-xs leading-5 text-blue-800">
                The generated order starts in Draft. Approve it, then mark it
                sent or update receiving status from this list.
              </p>
              <button
                disabled={!approved.length || !store.vendors.length}
                className="h-10 rounded-lg bg-[#1a73e8] text-sm font-medium text-white disabled:opacity-50"
              >
                Create draft purchase order
              </button>
            </div>
          </form>
        </div>
      )}
    </main>
  );
}
