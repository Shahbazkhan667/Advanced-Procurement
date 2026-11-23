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
import { ArrowLeft, Mail, Phone, Star, Truck } from "lucide-react";
export default function VendorProfilePage() {
  const { id } = useParams();
  const store = useStore();
  const vendor =
    store.vendors.find((v) => v.id === id) ||
    store.vendors.find(
      (v) =>
        v.name.toLowerCase().replaceAll(" ", "-") === String(id).toLowerCase(),
    ) ||
    store.vendors[0];
  return (
    <main className="min-h-screen bg-[#f7f8fa] p-4 md:p-8">
      <div className="mx-auto max-w-[1300px]">
        <Link
          href="/vendors"
          className="mb-5 inline-flex items-center gap-2 text-sm font-medium text-slate-500 hover:text-[#1a73e8]"
        >
          <ArrowLeft size={16} />
          Back to vendors
        </Link>
        <PageHeader
          title={vendor.name}
          description={`${vendor.category} · Supplier profile and performance`}
          action={<Status value={vendor.status} />}
        />
        <div className="mb-4 grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
          {[
            { t: "Performance rating", v: `${vendor.rating} / 5`, I: Star },
            { t: "On-time delivery", v: `${vendor.delivery}%`, I: Truck },
            { t: "YTD spend", v: fmt(vendor.spend), I: Star },
            { t: "Tax registration", v: vendor.ntn || "On file", I: Star },
          ].map(({ t, v, I }) => (
            <Surface key={t} className="p-5">
              <div className="flex items-center justify-between text-sm text-slate-500">
                {t}
                <I size={17} className="text-[#1a73e8]" />
              </div>
              <strong className="mt-2 block text-xl font-semibold">{v}</strong>
            </Surface>
          ))}
        </div>
        <div className="grid gap-4 xl:grid-cols-[1fr_320px]">
          <Surface>
            <SectionTitle
              title="Purchase order history"
              sub="Orders placed with this supplier"
            />
            <div className="divide-y divide-slate-100">
              {store.purchaseOrders
                .filter((p) => p.vendor === vendor.name)
                .map((p) => (
                  <div
                    key={p.id}
                    className="flex items-center justify-between gap-4 px-5 py-4"
                  >
                    <div>
                      <p className="text-sm font-medium text-[#1a73e8]">
                        {p.id}
                      </p>
                      <p className="mt-1 text-xs text-slate-500">
                        {p.date} · Request {p.requestId}
                      </p>
                    </div>
                    <div className="text-right">
                      <p className="text-sm font-medium">{fmt(p.amount)}</p>
                      <div className="mt-1">
                        <Status value={p.status} />
                      </div>
                    </div>
                  </div>
                ))}
            </div>
            {!store.purchaseOrders.some((p) => p.vendor === vendor.name) && (
              <p className="p-8 text-center text-sm text-slate-500">
                No purchase orders recorded for this vendor yet.
              </p>
            )}
          </Surface>
          <div className="flex flex-col gap-4">
            <Surface>
              <SectionTitle title="Supplier contact" />
              <div className="flex flex-col gap-4 p-5">
                <div className="flex items-center gap-3 text-sm text-slate-600">
                  <Mail size={16} className="text-slate-400" />
                  {vendor.contact}
                </div>
                <div className="flex items-center gap-3 text-sm text-slate-600">
                  <Phone size={16} className="text-slate-400" />
                  {vendor.phone || "Not provided"}
                </div>
                <div className="mt-2 border-t border-slate-100 pt-4">
                  <p className="text-xs text-slate-500">Category</p>
                  <p className="mt-1 text-sm font-medium">{vendor.category}</p>
                </div>
              </div>
            </Surface>
            <Surface>
              <SectionTitle title="Recent quotations" />
              <div className="divide-y divide-slate-100">
                {store.quotations
                  .filter((q) => q.vendor === vendor.name)
                  .map((q) => (
                    <div key={q.id} className="px-5 py-3">
                      <div className="flex items-center justify-between gap-2">
                        <span className="text-xs font-medium text-[#1a73e8]">
                          {q.id}
                        </span>
                        <Status value={q.status || "Received"} />
                      </div>
                      <p className="mt-1 text-xs text-slate-500">
                        {q.rfqId} · {q.submittedAt}
                      </p>
                      <p className="mt-1 text-sm font-semibold">
                        {fmt(q.amount)}
                      </p>
                    </div>
                  ))}
              </div>
              {!store.quotations.some((q) => q.vendor === vendor.name) && (
                <p className="p-5 text-sm text-slate-500">
                  No quotations have been submitted yet.
                </p>
              )}
              <Link
                href="/quotations"
                className="block border-t border-slate-100 px-5 py-3 text-sm font-medium text-[#1a73e8]"
              >
                View quotations
              </Link>
            </Surface>
          </div>
        </div>
      </div>
    </main>
  );
}
