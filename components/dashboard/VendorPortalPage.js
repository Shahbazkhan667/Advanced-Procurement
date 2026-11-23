"use client";
import { useState } from "react";
import { PageHeader, Surface, SectionTitle, Status, fmt } from "./primitives";
import { Check, Send } from "lucide-react";
import { useStore } from "../../lib/store";
const defaultInvites = [
  {
    id: "RFQ-2026-024",
    title: "Laptops — engineering refresh",
    due: "2026-11-28",
    requestId: "PR-2026-041",
    amount: 1480000,
    items: "8 line items",
  },
  {
    id: "RFQ-2026-023",
    title: "Office supply contract",
    due: "2026-11-25",
    requestId: "PR-2026-040",
    amount: 185000,
    items: "12 line items",
  },
];
export default function VendorPortalPage() {
  const store = useStore();
  const vendorName =
    store.role === "vendor"
      ? "Techno Supplies Ltd"
      : store.user?.name || "Techno Supplies Ltd";
  const dynamic = store.rfqs.filter((r) => r.vendors?.includes(vendorName));
  const invites = [...dynamic, ...defaultInvites];
  const [message, setMessage] = useState("");
  function submit(e, rfq) {
    e.preventDefault();
    const f = new FormData(e.currentTarget);
    const existing = store.quotations.find(
      (q) => q.rfqId === rfq.id && q.vendor === vendorName,
    );
    const quote = {
      rfqId: rfq.id,
      vendor: vendorName,
      amount: Number(f.get("amount")),
      deliveryDays: Number(f.get("days")),
      validUntil: f.get("valid"),
      notes: f.get("notes"),
      status: "Received",
    };
    if (existing) store.updateQuotation(existing.id, quote);
    else store.addQuotation(quote);
    store.addNotification({
      title: "Quotation submitted",
      detail: `${vendorName} · ${rfq.id}`,
    });
    setMessage(`Your response for ${rfq.id} has been saved.`);
  }
  return (
    <>
      <PageHeader
        title="Supplier portal"
        eyebrow="Vendor workspace"
        description={`Welcome, ${vendorName}. Respond to open sourcing events and manage your quotations.`}
      />
      <div className="mb-5 grid gap-4 sm:grid-cols-3">
        {[
          { t: "Open invitations", v: invites.length },
          {
            t: "Submitted quotes",
            v: store.quotations.filter((q) => q.vendor === vendorName).length,
          },
          {
            t: "Awarded orders",
            v: store.purchaseOrders.filter((p) => p.vendor === vendorName)
              .length,
          },
        ].map((x) => (
          <Surface key={x.t} className="p-4">
            <p className="text-xs text-slate-500">{x.t}</p>
            <b className="mt-2 block text-2xl">{x.v}</b>
          </Surface>
        ))}
      </div>
      {message && (
        <p
          role="status"
          className="mb-4 rounded-lg bg-emerald-50 p-3 text-sm text-emerald-800"
        >
          {message}
        </p>
      )}
      <div className="grid gap-4 xl:grid-cols-[1.5fr_1fr]">
        <Surface>
          <SectionTitle
            title="Invitations to quote"
            sub="Submit or update your proposal before the response deadline"
          />
          <div className="divide-y divide-slate-100">
            {invites.map((r) => {
              const quote = store.quotations.find(
                (q) => q.rfqId === r.id && q.vendor === vendorName,
              );
              return (
                <form key={r.id} onSubmit={(e) => submit(e, r)} className="p-5">
                  <div className="flex items-start justify-between gap-3">
                    <div>
                      <span className="text-[11px] font-medium text-[#1a73e8]">
                        {r.id}
                      </span>
                      <h3 className="mt-1 font-semibold text-slate-800">
                        {r.title}
                      </h3>
                      <p className="mt-1 text-xs text-slate-500">
                        {r.items || "Approved request"} · Estimate{" "}
                        {fmt(r.amount)}
                      </p>
                    </div>
                    <Status value={quote ? "Submitted" : "Open"} />
                  </div>
                  <div className="mt-4 grid gap-3 sm:grid-cols-3">
                    <label className="field-label">
                      Total quote
                      <input
                        name="amount"
                        type="number"
                        min="1"
                        defaultValue={quote?.amount || ""}
                        required
                        placeholder="PKR amount"
                        className="field-input"
                      />
                    </label>
                    <label className="field-label">
                      Delivery days
                      <input
                        name="days"
                        type="number"
                        min="1"
                        defaultValue={quote?.deliveryDays || ""}
                        required
                        placeholder="Days"
                        className="field-input"
                      />
                    </label>
                    <label className="field-label">
                      Valid until
                      <input
                        name="valid"
                        type="date"
                        defaultValue={quote?.validUntil || ""}
                        required
                        className="field-input"
                      />
                    </label>
                  </div>
                  <label className="mt-3 block field-label">
                    Proposal notes
                    <textarea
                      name="notes"
                      rows="2"
                      defaultValue={quote?.notes || ""}
                      placeholder="Add terms, inclusions, or product details"
                      className="field-input h-auto resize-y"
                    />
                  </label>
                  <div className="mt-3 flex justify-end">
                    <button className="inline-flex h-9 items-center gap-2 rounded-lg bg-[#1a73e8] px-3 text-xs font-medium text-white">
                      {quote ? <Check size={14} /> : <Send size={14} />}
                      {quote ? "Update quotation" : "Submit quotation"}
                    </button>
                  </div>
                </form>
              );
            })}
          </div>
        </Surface>
        <Surface>
          <SectionTitle title="Submission checklist" />
          <div className="p-5">
            <p className="text-sm leading-6 text-slate-600">
              Include pricing, delivery timing, applicable taxes, and warranty
              or support terms in your response.
            </p>
            <div className="mt-4 flex flex-col gap-3">
              {[
                "Itemized pricing",
                "Delivery lead time",
                "Quote validity period",
                "Company contact details",
              ].map((x) => (
                <div
                  key={x}
                  className="flex items-center gap-2 text-xs text-slate-600"
                >
                  <span className="grid size-5 place-items-center rounded-full bg-emerald-50 text-emerald-700">
                    <Check size={12} />
                  </span>
                  {x}
                </div>
              ))}
            </div>
          </div>
        </Surface>
      </div>
    </>
  );
}
