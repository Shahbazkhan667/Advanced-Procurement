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
import { Check, ChevronRight, Clock3, X } from "lucide-react";
const stages = [
  "Department Manager",
  "Procurement Officer",
  "Finance Manager",
  "Director",
];
export default function ApprovalsPage() {
  const store = useStore();
  const [selected, setSelected] = useState(
    store.requests.find((x) => x.status.includes("Pending"))?.id || "",
  );
  const [comment, setComment] = useState("");
  const [error, setError] = useState("");
  const current = store.requests.find((x) => x.id === selected);
  function decide(status) {
    if (comment.trim().length < 8) {
      setError("Add an audit comment of at least 8 characters.");
      return;
    }
    store.updateRequest(current.id, {
      status,
      auditComment: comment.trim(),
      approvedBy: store.user?.name || "Ayesha Khan",
    });
    store.addNotification({
      title: `Request ${status.toLowerCase()}`,
      detail: `${current.id} · ${comment.trim()}`,
    });
    setComment("");
    setError("");
    const next = store.requests.find(
      (x) => x.status.toLowerCase().includes("pending") && x.id !== current.id,
    );
    setSelected(next?.id || "");
  }
  return (
    <main className="min-h-screen bg-[#f7f8fa] p-4 md:p-8">
      <div className="mx-auto max-w-[1300px]">
        <PageHeader
          title="Approvals"
          description="Review purchase requests and leave an audit note with each decision."
        />
        <div className="grid gap-4 xl:grid-cols-[360px_1fr]">
          <Surface>
            <SectionTitle
              title="Your approval queue"
              sub={`${store.requests.filter((x) => x.status.toLowerCase().includes("pending")).length} waiting for review`}
            />
            <div className="divide-y divide-slate-100">
              {store.requests
                .filter((x) => x.status.toLowerCase().includes("pending"))
                .map((r) => (
                  <button
                    key={r.id}
                    onClick={() => {
                      setSelected(r.id);
                      setComment("");
                      setError("");
                    }}
                    className={`w-full p-4 text-left transition hover:bg-slate-50 ${selected === r.id ? "bg-blue-50/60" : ""}`}
                  >
                    <div className="flex items-center justify-between gap-2">
                      <span className="text-xs font-medium text-[#1a73e8]">
                        {r.id}
                      </span>
                      <Status value={r.status} />
                    </div>
                    <p className="mt-2 text-sm font-semibold text-slate-800">
                      {r.title}
                    </p>
                    <p className="mt-1 text-xs text-slate-500">
                      {r.requester} · {r.department}
                    </p>
                    <p className="mt-3 text-sm font-medium">{fmt(r.amount)}</p>
                  </button>
                ))}
              {!store.requests.some((x) =>
                x.status.toLowerCase().includes("pending"),
              ) && (
                <p className="p-8 text-center text-sm text-slate-500">
                  Your approval queue is clear.
                </p>
              )}
            </div>
          </Surface>
          {current ? (
            <div className="flex flex-col gap-4">
              <Surface>
                <SectionTitle
                  title="Approval route"
                  sub="Four-stage review workflow"
                />
                <div className="grid gap-3 p-5 sm:grid-cols-4">
                  {stages.map((stage, i) => (
                    <div key={stage} className="flex items-start gap-2">
                      <span
                        className={`grid size-7 shrink-0 place-items-center rounded-full text-xs font-semibold ${i === 0 ? "bg-blue-50 text-[#1a73e8]" : "bg-slate-100 text-slate-500"}`}
                      >
                        {i === 0 ? <Clock3 size={14} /> : i + 1}
                      </span>
                      <div>
                        <p className="text-xs font-semibold text-slate-700">
                          {stage}
                        </p>
                        <p className="mt-1 text-[10px] text-slate-400">
                          {i === 0 ? "Awaiting review" : "Up next"}
                        </p>
                      </div>
                      {i < 3 && (
                        <ChevronRight
                          size={14}
                          className="ml-auto text-slate-300"
                        />
                      )}
                    </div>
                  ))}
                </div>
              </Surface>
              <Surface>
                <SectionTitle
                  title={current.title}
                  sub={`${current.id} · Submitted ${current.date} · ${current.department}`}
                />
                <div className="p-5">
                  <div className="grid gap-4 sm:grid-cols-3">
                    {[
                      { k: "Requested by", v: current.requester },
                      { k: "Department", v: current.department },
                      { k: "Estimated total", v: fmt(current.amount) },
                    ].map((x) => (
                      <div key={x.k}>
                        <p className="text-xs text-slate-500">{x.k}</p>
                        <p className="mt-1 text-sm font-medium text-slate-800">
                          {x.v}
                        </p>
                      </div>
                    ))}
                  </div>
                  <div className="mt-5 border-t border-slate-100 pt-4">
                    <h3 className="text-xs font-semibold uppercase tracking-wider text-slate-500">
                      Line items
                    </h3>
                    {(current.items || []).map((x, i) => (
                      <div
                        key={i}
                        className="mt-3 flex justify-between text-sm"
                      >
                        <span className="text-slate-600">
                          {x.name} × {x.qty}
                        </span>
                        <span className="font-medium">
                          {fmt(x.qty * x.price)}
                        </span>
                      </div>
                    ))}
                  </div>
                  <label className="mt-5 block field-label">
                    Audit comment (required)
                    <textarea
                      value={comment}
                      onChange={(e) => setComment(e.target.value)}
                      rows="3"
                      className="field-input h-auto resize-y"
                      placeholder="Document your review or decision rationale"
                    />
                  </label>
                  {error && (
                    <p className="mt-2 text-xs text-rose-600">{error}</p>
                  )}
                  <div className="mt-4 flex justify-end gap-2">
                    <button
                      onClick={() => decide("Rejected")}
                      className="inline-flex h-10 items-center gap-2 rounded-lg border border-rose-200 px-4 text-sm font-medium text-rose-700 hover:bg-rose-50"
                    >
                      <X size={15} />
                      Reject
                    </button>
                    <button
                      onClick={() => decide("Approved")}
                      className="inline-flex h-10 items-center gap-2 rounded-lg bg-[#1a73e8] px-4 text-sm font-medium text-white hover:bg-blue-700"
                    >
                      <Check size={15} />
                      Approve
                    </button>
                  </div>
                </div>
              </Surface>
            </div>
          ) : (
            <Surface className="grid min-h-60 place-items-center">
              <p className="text-sm text-slate-500">
                Select a request to review.
              </p>
            </Surface>
          )}
        </div>
      </div>
    </main>
  );
}
