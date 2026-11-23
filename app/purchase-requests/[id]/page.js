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
import { ArrowLeft, Check, Clock3, FileText, Send } from "lucide-react";
const stages = [
  "Draft",
  "Department Manager",
  "Procurement Officer",
  "Finance Manager",
  "Director",
  "Approved",
  "In sourcing",
  "Completed",
];
export default function RequestDetailPage() {
  const { id } = useParams();
  const store = useStore();
  const request = store.requests.find((r) => r.id === id);
  if (!request)
    return (
      <main className="p-8 text-sm text-slate-600">
        Request not found.{" "}
        <Link href="/purchase-requests" className="text-blue-600">
          Back to requests
        </Link>
      </main>
    );
  const stage =
    request.status === "Pending approval"
      ? 1
      : request.status === "Approved"
        ? 5
        : request.status === "In sourcing"
          ? 6
          : request.status === "Completed"
            ? 7
            : 0;
  function changeStatus(status) {
    store.updateRequest(request.id, { status });
    store.addNotification({
      title: `Request ${status.toLowerCase()}`,
      detail: `${request.id} · ${request.title}`,
    });
  }
  return (
    <main className="min-h-screen bg-[#f7f8fa] p-4 md:p-8">
      <div className="mx-auto max-w-[1100px]">
        <Link
          href="/purchase-requests"
          className="mb-5 inline-flex items-center gap-2 text-sm text-slate-500"
        >
          <ArrowLeft size={16} />
          Back to requests
        </Link>
        <PageHeader
          title={request.title}
          description={`${request.id} · Created ${request.date}`}
          action={<Status value={request.status} />}
        />
        <div className="grid gap-4 xl:grid-cols-[1fr_320px]">
          <div className="flex flex-col gap-4">
            <Surface>
              <SectionTitle
                title="Request details"
                sub="Submitted by the requesting department"
              />
              <div className="grid gap-5 p-5 sm:grid-cols-3">
                {[
                  { k: "Requester", v: request.requester },
                  { k: "Department", v: request.department },
                  { k: "Estimated total", v: fmt(request.amount) },
                ].map((x) => (
                  <div key={x.k}>
                    <p className="text-xs text-slate-500">{x.k}</p>
                    <p className="mt-1 text-sm font-semibold">{x.v}</p>
                  </div>
                ))}
                <div className="sm:col-span-3">
                  <p className="text-xs text-slate-500">
                    Business justification
                  </p>
                  <p className="mt-1 text-sm leading-6 text-slate-700">
                    {request.justification ||
                      "Purchase requested to support department operations and planned work."}
                  </p>
                </div>
              </div>
            </Surface>
            <Surface>
              <SectionTitle title="Requested items" />
              <div className="overflow-x-auto">
                <table className="w-full text-left text-sm">
                  <thead className="border-b border-slate-100 bg-slate-50 text-xs text-slate-500">
                    <tr>
                      {["Description", "Qty", "Unit price", "Line total"].map(
                        (x) => (
                          <th key={x} className="px-5 py-3">
                            {x}
                          </th>
                        ),
                      )}
                    </tr>
                  </thead>
                  <tbody>
                    {(request.items || []).map((x, i) => (
                      <tr key={i} className="border-b border-slate-50">
                        <td className="px-5 py-4 font-medium">{x.name}</td>
                        <td className="px-5 py-4">{x.qty}</td>
                        <td className="px-5 py-4">{fmt(x.price)}</td>
                        <td className="px-5 py-4 font-semibold">
                          {fmt(x.price * x.qty)}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
                <div className="flex justify-end px-5 py-4 text-sm font-semibold">
                  Total&nbsp; {fmt(request.amount)}
                </div>
              </div>
            </Surface>
          </div>
          <div className="flex flex-col gap-4">
            <Surface>
              <SectionTitle title="Workflow" />
              <ol className="p-5">
                {stages.map((s, i) => (
                  <li key={s} className="flex gap-3 pb-4 last:pb-0">
                    <span
                      className={`grid size-6 shrink-0 place-items-center rounded-full ${i < stage ? "bg-emerald-50 text-emerald-700" : i === stage ? "bg-blue-50 text-[#1a73e8]" : "bg-slate-100 text-slate-400"}`}
                    >
                      {i < stage ? (
                        <Check size={13} />
                      ) : i === stage ? (
                        <Clock3 size={13} />
                      ) : (
                        <span className="text-[10px]">{i + 1}</span>
                      )}
                    </span>
                    <div>
                      <p
                        className={`text-xs font-medium ${i <= stage ? "text-slate-800" : "text-slate-400"}`}
                      >
                        {s}
                      </p>
                      {i === stage && (
                        <p className="mt-1 text-[10px] text-slate-400">
                          Current stage
                        </p>
                      )}
                    </div>
                  </li>
                ))}
              </ol>
            </Surface>
            <Surface>
              <SectionTitle title="Audit trail" />
              <div className="p-5 text-xs leading-5 text-slate-600">
                {request.auditComment ? (
                  <>
                    <p className="font-medium">
                      {request.approvedBy || "Reviewer"} · {request.status}
                    </p>
                    <p className="mt-1">{request.auditComment}</p>
                  </>
                ) : (
                  <p className="text-slate-400">No review comments yet.</p>
                )}
              </div>
            </Surface>
            {request.status === "Draft" && (
              <button
                onClick={() => changeStatus("Pending approval")}
                className="inline-flex h-10 items-center justify-center gap-2 rounded-lg bg-[#1a73e8] text-sm font-medium text-white"
              >
                <Send size={15} />
                Submit request
              </button>
            )}
            {request.status === "Approved" && (
              <Link
                href="/rfqs"
                className="inline-flex h-10 items-center justify-center gap-2 rounded-lg bg-[#1a73e8] text-sm font-medium text-white"
              >
                <FileText size={15} />
                Create RFQ
              </Link>
            )}
          </div>
        </div>
      </div>
    </main>
  );
}
