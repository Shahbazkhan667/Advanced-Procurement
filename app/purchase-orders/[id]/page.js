"use client";
import Link from "next/link";
import { useParams } from "next/navigation";
import { useStore } from "../../../lib/store";
import {
  PageHeader,
  Surface,
  SectionTitle,
  Status,
  fmt,
} from "../../../components/dashboard/primitives";
import { ArrowLeft, Printer } from "lucide-react";
export default function PurchaseOrderPage() {
  const { id } = useParams();
  const { purchaseOrders } = useStore();
  const po = purchaseOrders.find((x) => x.id === id) || purchaseOrders[0];
  return (
    <main className="min-h-screen bg-[#f7f8fa] p-4 md:p-8">
      <div className="mx-auto max-w-[1100px]">
        <Link
          href="/purchase-orders"
          className="mb-5 inline-flex items-center gap-2 text-sm text-slate-500"
        >
          <ArrowLeft size={16} />
          Back to purchase orders
        </Link>
        <PageHeader
          title="Purchase order"
          description="Review the order, supplier details, and receiving progress."
          action={
            <button
              onClick={() => window.print()}
              className="inline-flex h-10 items-center gap-2 rounded-lg border border-slate-200 bg-white px-4 text-sm font-medium"
            >
              <Printer size={16} />
              Print order
            </button>
          }
        />
        <Surface className="p-6 md:p-10">
          <div className="flex flex-wrap items-start justify-between gap-5 border-b border-slate-200 pb-7">
            <div>
              <p className="text-xs font-semibold uppercase tracking-widest text-[#1a73e8]">
                ProCureX purchase order
              </p>
              <h2 className="mt-2 text-2xl font-semibold">{po.id}</h2>
              <p className="mt-2 text-sm text-slate-500">Created {po.date}</p>
            </div>
            <Status value={po.status} />
          </div>
          <div className="grid gap-8 py-7 sm:grid-cols-2">
            <div>
              <p className="text-xs font-semibold uppercase tracking-wider text-slate-400">
                Supplier
              </p>
              <p className="mt-2 font-semibold">{po.vendor}</p>
              <p className="mt-1 text-sm text-slate-500">
                Vendor account · Approved supplier
              </p>
            </div>
            <div>
              <p className="text-xs font-semibold uppercase tracking-wider text-slate-400">
                Request reference
              </p>
              <p className="mt-2 font-semibold">{po.requestId}</p>
              <p className="mt-1 text-sm text-slate-500">
                Payment terms: Net 30
              </p>
            </div>
          </div>
          <SectionTitle title="Order lines" sub="All amounts shown in PKR" />
          <div className="py-5">
            <div className="flex justify-between border-b border-slate-100 py-3 text-sm">
              <span className="text-slate-600">
                Approved goods and services
              </span>
              <span className="font-medium">{fmt(po.amount)}</span>
            </div>
            <div className="flex justify-between py-3 text-sm">
              <span className="text-slate-600">Subtotal</span>
              <span>{fmt(po.amount)}</span>
            </div>
            <div className="flex justify-between py-3 text-sm">
              <span className="text-slate-600">Tax</span>
              <span>$0</span>
            </div>
            <div className="flex justify-between border-t border-slate-200 py-4 text-base font-semibold">
              <span>Total order value</span>
              <span>{fmt(po.amount)}</span>
            </div>
          </div>
          <p className="border-t border-slate-100 pt-5 text-xs text-slate-400">
            This purchase order is generated electronically by ProCureX. Please
            reference the PO number on all invoices and delivery documents.
          </p>
        </Surface>
      </div>
    </main>
  );
}
