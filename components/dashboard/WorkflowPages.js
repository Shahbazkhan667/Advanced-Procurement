"use client";
import { useMemo, useState } from "react";
import {
  Bar,
  BarChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import { useParams } from "next/navigation";
import { useStore } from "../../lib/store";
import {
  PageHeader,
  Button,
  Surface,
  SectionTitle,
  Status,
  Table,
  fmt,
} from "./primitives";
import {
  ArrowLeft,
  Check,
  Clock3,
  FileText,
  Plus,
  Printer,
  Send,
  Trash2,
} from "lucide-react";
export function RequestBuilder() {
  const store = useStore();
  const [items, setItems] = useState([{ name: "", qty: 1, price: "" }]);
  const [submitted, setSubmitted] = useState(false);
  const total = items.reduce(
    (sum, x) => sum + (Number(x.qty) || 0) * (Number(x.price) || 0),
    0,
  );
  function change(i, key, value) {
    setItems((a) => a.map((x, j) => (j === i ? { ...x, [key]: value } : x)));
  }
  function submit(e) {
    e.preventDefault();
    const f = new FormData(e.currentTarget);
    const request = {
      title: f.get("title"),
      department: f.get("department"),
      requester: store.user?.name || "Ayesha Khan",
      amount: total,
      status: submitted ? "Pending approval" : "Draft",
      items: items.map((x) => ({
        ...x,
        qty: Number(x.qty),
        price: Number(x.price),
      })),
    };
    store.addRequest(request);
    location.href = "/purchase-requests";
  }
  return (
    <>
      <PageHeader
        title="New purchase request"
        description="Tell us what you need. You can save a draft and submit it for approval later."
      />
      <form onSubmit={submit} className="grid gap-4 xl:grid-cols-[1fr_320px]">
        <div className="flex flex-col gap-4">
          <Surface>
            <SectionTitle
              title="Request details"
              sub="Add context so your approvers can make a quick decision"
            />
            <div className="grid gap-4 p-5 sm:grid-cols-2">
              <label className="field-label sm:col-span-2">
                Request title
                <input
                  name="title"
                  required
                  placeholder="What are you purchasing?"
                  className="field-input"
                />
              </label>
              <label className="field-label">
                Department
                <select name="department" className="field-input">
                  <option>Engineering</option>
                  <option>Operations</option>
                  <option>Marketing</option>
                  <option>Finance</option>
                  <option>Administration</option>
                </select>
              </label>
              <label className="field-label">
                Need-by date
                <input
                  name="date"
                  type="date"
                  required
                  className="field-input"
                />
              </label>
              <label className="field-label sm:col-span-2">
                Business justification
                <textarea
                  name="justification"
                  required
                  minLength="12"
                  rows="3"
                  placeholder="Explain the business need and expected impact"
                  className="field-input h-auto resize-y"
                />
              </label>
            </div>
          </Surface>
          <Surface>
            <SectionTitle
              title="Items and services"
              sub="Add one or more line items with quantities and estimated unit prices"
              action={
                <button
                  type="button"
                  onClick={() =>
                    setItems((a) => [...a, { name: "", qty: 1, price: "" }])
                  }
                  className="flex items-center gap-1 text-xs font-medium text-[#1a73e8]"
                >
                  <Plus size={14} /> Add item
                </button>
              }
            />
            <div className="overflow-x-auto p-5">
              <div className="min-w-[600px]">
                <div className="mb-2 grid grid-cols-[1fr_90px_140px_130px_36px] gap-3 px-1 text-[10px] font-semibold uppercase tracking-wider text-slate-400">
                  <span>Description</span>
                  <span>Quantity</span>
                  <span>Unit price (PKR)</span>
                  <span>Line total</span>
                  <span />
                </div>
                {items.map((item, i) => (
                  <div
                    key={i}
                    className="mb-3 grid grid-cols-[1fr_90px_140px_130px_36px] items-center gap-3"
                  >
                    <input
                      value={item.name}
                      onChange={(e) => change(i, "name", e.target.value)}
                      required
                      placeholder="Item or service description"
                      className="field-input"
                    />
                    <input
                      value={item.qty}
                      onChange={(e) => change(i, "qty", e.target.value)}
                      type="number"
                      min="1"
                      required
                      className="field-input"
                    />
                    <input
                      value={item.price}
                      onChange={(e) => change(i, "price", e.target.value)}
                      type="number"
                      min="1"
                      required
                      placeholder="0"
                      className="field-input"
                    />
                    <span className="text-sm font-medium tabular-nums">
                      {fmt((Number(item.qty) || 0) * (Number(item.price) || 0))}
                    </span>
                    <button
                      type="button"
                      aria-label="Remove line item"
                      disabled={items.length === 1}
                      onClick={() =>
                        setItems((a) => a.filter((_, j) => i !== j))
                      }
                      className="rounded-md p-2 text-slate-400 hover:bg-rose-50 hover:text-rose-600 disabled:opacity-30"
                    >
                      <Trash2 size={15} />
                    </button>
                  </div>
                ))}
              </div>
            </div>
            <div className="flex justify-end border-t border-slate-100 px-5 py-4">
              <div className="text-right">
                <span className="text-xs text-slate-500">Estimated total</span>
                <strong className="ml-4 text-lg font-semibold">
                  {fmt(total)}
                </strong>
              </div>
            </div>
          </Surface>
          <div className="flex justify-end gap-2">
            <button
              type="submit"
              onClick={() => setSubmitted(false)}
              className="h-10 rounded-lg border border-slate-200 bg-white px-4 text-sm font-medium text-slate-700"
            >
              Save draft
            </button>
            <button
              type="submit"
              onClick={() => setSubmitted(true)}
              className="inline-flex h-10 items-center gap-2 rounded-lg bg-[#1a73e8] px-4 text-sm font-medium text-white"
            >
              <Send size={15} />
              Submit for approval
            </button>
          </div>
        </div>
        <div className="flex flex-col gap-4">
          <Surface>
            <SectionTitle title="Request summary" />
            <div className="p-5">
              <p className="text-xs text-slate-500">Estimated total</p>
              <p className="mt-1 text-[26px] font-semibold tracking-tight">
                {fmt(total)}
              </p>
              <div className="my-4 border-t border-slate-100" />
              <div className="flex justify-between text-xs text-slate-500">
                <span>Line items</span>
                <span className="font-medium text-slate-700">
                  {items.length}
                </span>
              </div>
              <div className="mt-3 flex justify-between text-xs text-slate-500">
                <span>Approval route</span>
                <span className="font-medium text-slate-700">4 stages</span>
              </div>
            </div>
          </Surface>
          <Surface className="p-4">
            <div className="flex items-center gap-2 text-sm font-semibold">
              <Clock3 size={15} className="text-[#1a73e8]" />
              Approval steps
            </div>
            <ol className="mt-4 flex flex-col gap-4">
              {[
                "Department Manager",
                "Procurement Officer",
                "Finance Manager",
                "Director",
              ].map((x, i) => (
                <li
                  key={x}
                  className="flex items-center gap-3 text-xs text-slate-600"
                >
                  <span
                    className={`grid size-6 place-items-center rounded-full ${i === 0 ? "bg-blue-50 text-[#1a73e8]" : "bg-slate-100 text-slate-500"}`}
                  >
                    {i + 1}
                  </span>
                  {x}
                </li>
              ))}
            </ol>
          </Surface>
        </div>
      </form>
    </>
  );
}
export function VendorPortal() {
  const store = useStore();
  const [saved, setSaved] = useState(false);
  return (
    <>
      <PageHeader
        title="Supplier portal"
        eyebrow="Vendor workspace"
        description="Respond to open sourcing events and track your submitted proposals."
      />
      <div className="mb-5 grid gap-4 sm:grid-cols-3">
        <Surface className="p-4">
          <p className="text-xs text-slate-500">Open invitations</p>
          <b className="mt-2 block text-2xl">2</b>
        </Surface>
        <Surface className="p-4">
          <p className="text-xs text-slate-500">Submitted quotes</p>
          <b className="mt-2 block text-2xl">4</b>
        </Surface>
        <Surface className="p-4">
          <p className="text-xs text-slate-500">Awarded orders</p>
          <b className="mt-2 block text-2xl">3</b>
        </Surface>
      </div>
      <div className="grid gap-4 xl:grid-cols-[1.5fr_1fr]">
        <Surface>
          <SectionTitle
            title="Invitations to quote"
            sub="Submit a competitive proposal before the response deadline"
          />
          <div className="divide-y divide-slate-100">
            {[
              {
                id: "RFQ-2026-024",
                title: "Laptops — engineering refresh",
                due: "Nov 28, 2026",
                items: "8 line items",
                budget: "PKR 1,480,000",
              },
              {
                id: "RFQ-2026-023",
                title: "Office supply contract",
                due: "Nov 25, 2026",
                items: "12 line items",
                budget: "PKR 185,000",
              },
            ].map((x) => (
              <div key={x.id} className="p-5">
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <span className="text-[11px] font-medium text-[#1a73e8]">
                      {x.id}
                    </span>
                    <h3 className="mt-1 font-semibold text-slate-800">
                      {x.title}
                    </h3>
                    <p className="mt-1 text-xs text-slate-500">
                      {x.items} · Budget estimate {x.budget}
                    </p>
                  </div>
                  <Status value="Open" />
                </div>
                <div className="mt-4 grid gap-3 sm:grid-cols-[1fr_130px_140px]">
                  <label className="field-label">
                    Your total quote (PKR)
                    <input
                      type="number"
                      min="1"
                      placeholder="Enter quote amount"
                      className="field-input"
                    />
                  </label>
                  <label className="field-label">
                    Delivery days
                    <input
                      type="number"
                      min="1"
                      placeholder="Days"
                      className="field-input"
                    />
                  </label>
                  <label className="field-label">
                    Quote valid until
                    <input type="date" className="field-input" />
                  </label>
                </div>
                <label className="mt-3 block field-label">
                  Proposal notes
                  <textarea
                    rows="2"
                    placeholder="Add terms, inclusions, or product details"
                    className="field-input h-auto resize-y"
                  />
                </label>
                <div className="mt-3 flex justify-end">
                  <Button onClick={() => setSaved(true)} icon={Check}>
                    {saved ? "Quote submitted" : "Submit quotation"}
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </Surface>
        <Surface>
          <SectionTitle title="Submission checklist" />
          <div className="p-5">
            <p className="text-sm leading-6 text-slate-600">
              Before submitting, make sure your quotation includes pricing,
              delivery timing, applicable taxes, and any warranty or support
              terms.
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
export function Comparison() {
  const store = useStore();
  const saved = store.recommendations["PR-2026-041"];
  const [recommendation, setRecommendation] = useState(saved?.note || "");
  const [note, setNote] = useState("");
  return (
    <>
      <PageHeader
        title="Quote comparison"
        description="Compare vendor responses side by side and document your sourcing recommendation."
      />
      <div className="mb-4 grid gap-4 sm:grid-cols-3">
        <Surface className="p-4">
          <span className="text-xs text-slate-500">Request</span>
          <b className="mt-1 block text-sm">
            PR-2026-041 · Engineering laptops
          </b>
        </Surface>
        <Surface className="p-4">
          <span className="text-xs text-slate-500">Lowest bid</span>
          <b className="mt-1 block text-sm text-emerald-700">PKR 1,398,000</b>
        </Surface>
        <Surface className="p-4">
          <span className="text-xs text-slate-500">Potential savings</span>
          <b className="mt-1 block text-sm">PKR 82,000 · 5.5%</b>
        </Surface>
      </div>
      <Surface className="mb-4">
        <SectionTitle
          title="Supplier comparison matrix"
          sub="Best price and delivery are highlighted"
        />
        <div className="overflow-x-auto">
          <table className="w-full min-w-[780px] text-sm">
            <thead>
              <tr className="border-b bg-slate-50 text-left text-xs text-slate-500">
                <th className="px-5 py-3">Evaluation criteria</th>
                <th className="px-5 py-3">Techno Supplies Ltd</th>
                <th className="px-5 py-3">Vertex Technologies</th>
                <th className="px-5 py-3">Pak Systems</th>
              </tr>
            </thead>
            <tbody>
              {[
                [
                  "Total quote",
                  "PKR 1,480,000",
                  "PKR 1,398,000",
                  "PKR 1,525,000",
                ],
                ["Delivery lead time", "18 days", "21 days", "14 days"],
                ["Warranty", "3 years", "2 years", "2 years"],
                ["On-time delivery", "96%", "88%", "91%"],
                ["Quality rating", "4.8 / 5", "4.4 / 5", "4.6 / 5"],
                ["Payment terms", "Net 30", "Net 45", "Net 30"],
              ].map((r, i) => (
                <tr
                  key={r[0]}
                  className="border-b border-slate-100 last:border-0"
                >
                  <td className="px-5 py-4 font-medium text-slate-700">
                    {r[0]}
                  </td>
                  {r.slice(1).map((v, j) => (
                    <td
                      key={j}
                      className={`px-5 py-4 ${(i === 0 && j === 1) || (i === 1 && j === 2) ? "font-semibold text-emerald-700" : "text-slate-600"}`}
                    >
                      {v}
                      {i === 0 && j === 1 && (
                        <span className="ml-2 rounded bg-emerald-50 px-1.5 py-1 text-[9px] font-semibold">
                          LOWEST
                        </span>
                      )}
                      {i === 1 && j === 2 && (
                        <span className="ml-2 rounded bg-blue-50 px-1.5 py-1 text-[9px] font-semibold text-blue-700">
                          FASTEST
                        </span>
                      )}
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Surface>
      <Surface className="mb-4">
        <SectionTitle
          title="Quote price comparison"
          sub="Supplier bids in PKR"
        />
        <div className="h-[230px] p-4">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart
              data={[
                { vendor: "Techno Supplies", price: 1480000 },
                { vendor: "Vertex Tech", price: 1398000 },
                { vendor: "Pak Systems", price: 1525000 },
              ]}
            >
              <CartesianGrid vertical={false} stroke="#edf0f5" />
              <XAxis dataKey="vendor" tickLine={false} axisLine={false} />
              <YAxis
                tickFormatter={(v) => `${(v / 1000000).toFixed(1)}m`}
                tickLine={false}
                axisLine={false}
              />
              <Tooltip formatter={(v) => `PKR ${Number(v).toLocaleString()}`} />
              <Bar
                dataKey="price"
                name="Quote"
                fill="#1a73e8"
                radius={[5, 5, 0, 0]}
              />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </Surface>
      <Surface>
        <SectionTitle
          title="Procurement recommendation"
          sub="A justification is required for audit and approval"
        />
        <form
          className="grid gap-4 p-5 md:grid-cols-[1fr_1fr_auto] md:items-end"
          onSubmit={(e) => {
            e.preventDefault();
            if (note.trim().length < 20) return;
            setRecommendation(note);
            store.saveRecommendation("PR-2026-041", {
              supplier: "Vertex Technologies",
              note,
              by: store.user?.name || "Ayesha Khan",
              date: new Date().toISOString().slice(0, 10),
            });
          }}
        >
          <label className="field-label">
            Recommended supplier
            <select className="field-input">
              <option>Vertex Technologies — PKR 1,398,000</option>
              <option>Techno Supplies Ltd — PKR 1,480,000</option>
              <option>Pak Systems — PKR 1,525,000</option>
            </select>
          </label>
          <label className="field-label">
            Justification (20 characters minimum)
            <textarea
              required
              minLength="20"
              value={note}
              onChange={(e) => setNote(e.target.value)}
              rows="2"
              className="field-input h-auto resize-y"
              placeholder="Explain the value, quality, and delivery tradeoffs"
            />
          </label>
          <button className="h-10 rounded-lg bg-[#1a73e8] px-4 text-sm font-medium text-white">
            {recommendation ? "Recommendation saved" : "Submit recommendation"}
          </button>
        </form>
        {recommendation && (
          <p role="status" className="px-5 pb-4 text-xs text-emerald-700">
            Recommendation saved for audit: {recommendation}
          </p>
        )}
      </Surface>
    </>
  );
}
