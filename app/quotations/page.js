"use client";
import { useState } from "react";
import { FileText, Search } from "lucide-react";
import {
  PageHeader,
  Surface,
  SectionTitle,
  Status,
  Table,
  Button,
} from "../../components/dashboard/primitives";
import { useStore } from "../../lib/store";
const quotes = [
  {
    id: "QT-2026-082",
    rfq: "RFQ-2026-024",
    vendor: "Techno Supplies Ltd",
    amount: "PKR 1,480,000",
    submitted: "Nov 22, 2026",
    valid: "Dec 22, 2026",
    status: "Received",
  },
  {
    id: "QT-2026-081",
    rfq: "RFQ-2026-024",
    vendor: "Vertex Technologies",
    amount: "PKR 1,398,000",
    submitted: "Nov 22, 2026",
    valid: "Dec 15, 2026",
    status: "Received",
  },
  {
    id: "QT-2026-080",
    rfq: "RFQ-2026-023",
    vendor: "Office Essentials Co.",
    amount: "PKR 179,500",
    submitted: "Nov 21, 2026",
    valid: "Dec 21, 2026",
    status: "Under review",
  },
  {
    id: "QT-2026-079",
    rfq: "RFQ-2026-024",
    vendor: "Pak Systems",
    amount: "PKR 1,525,000",
    submitted: "Nov 20, 2026",
    valid: "Dec 10, 2026",
    status: "Received",
  },
];
export default function QuotationsPage() {
  const store = useStore();
  const [q, setQ] = useState("");
  const saved = store.quotations.map((x) => ({
    ...x,
    amount: `PKR ${Number(x.amount).toLocaleString()}`,
    submitted: x.submittedAt,
    valid: x.validUntil,
    status: x.status || "Received",
  }));
  const rows = [...saved, ...quotes].filter((x) =>
    Object.values(x).join(" ").toLowerCase().includes(q.toLowerCase()),
  );
  return (
    <main className="min-h-screen bg-[#f7f8fa] p-4 md:p-8">
      <div className="mx-auto max-w-[1300px]">
        <PageHeader
          title="Quotations"
          description="Review vendor proposals, compare pricing, and track sourcing responses."
          action={
            <Button
              icon={FileText}
              onClick={() => (location.href = "/comparison")}
            >
              Compare quotes
            </Button>
          }
        />
        <Surface>
          <SectionTitle
            title="Submitted quotations"
            sub={`${rows.length} supplier responses across active sourcing events`}
          />
          <div className="flex justify-end p-4">
            <label className="relative">
              <Search
                size={15}
                className="absolute left-3 top-2.5 text-slate-400"
              />
              <input
                aria-label="Search quotations"
                value={q}
                onChange={(e) => setQ(e.target.value)}
                placeholder="Search quotations…"
                className="h-9 rounded-lg border border-slate-200 pl-9 pr-3 text-sm outline-none focus:ring-2 focus:ring-blue-50"
              />
            </label>
          </div>
          <Table
            columns={[
              { key: "id", label: "Quote ID" },
              { key: "rfq", label: "Sourcing event" },
              { key: "vendor", label: "Supplier" },
              { key: "amount", label: "Total quote" },
              { key: "submitted", label: "Submitted" },
              { key: "valid", label: "Valid until" },
              {
                key: "status",
                label: "Status",
                render: (v) => <Status value={v} />,
              },
            ]}
            rows={rows}
          />
        </Surface>
      </div>
    </main>
  );
}
