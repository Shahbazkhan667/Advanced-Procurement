"use client";
import { useState } from "react";
import { useStore } from "../../lib/store";
import {
  PageHeader,
  Surface,
  SectionTitle,
} from "../../components/dashboard/primitives";
import { Bell, Check, MailOpen } from "lucide-react";
export default function NotificationsPage() {
  const store = useStore();
  const [filter, setFilter] = useState("all");
  const rows = store.notifications.filter((n) => filter === "all" || !n.read);
  return (
    <main className="min-h-screen bg-[#f7f8fa] p-4 md:p-8">
      <div className="mx-auto max-w-[1050px]">
        <PageHeader
          title="Notifications"
          description="Review approvals, supplier activity, and purchase order updates."
          action={
            <button
              onClick={store.markAllRead}
              className="inline-flex h-9 items-center gap-2 rounded-lg border border-slate-200 bg-white px-3 text-xs font-medium text-slate-700"
            >
              <MailOpen size={15} />
              Mark all as read
            </button>
          }
        />
        <div className="mb-4 flex gap-2">
          {[
            { id: "all", label: `All (${store.notifications.length})` },
            {
              id: "unread",
              label: `Unread (${store.notifications.filter((n) => !n.read).length})`,
            },
          ].map((x) => (
            <button
              key={x.id}
              onClick={() => setFilter(x.id)}
              className={`rounded-full px-3 py-1.5 text-xs font-medium ${filter === x.id ? "bg-blue-100 text-blue-800" : "bg-white text-slate-600"}`}
            >
              {x.label}
            </button>
          ))}
        </div>
        <Surface>
          <SectionTitle title="Activity" sub="Your workspace updates" />
          <div className="divide-y divide-slate-100">
            {rows.map((n) => (
              <button
                key={n.id}
                onClick={() => store.markRead(n.id)}
                className={`flex w-full items-start gap-4 p-5 text-left transition hover:bg-slate-50 ${!n.read ? "bg-blue-50/30" : ""}`}
              >
                <span
                  className={`mt-0.5 grid size-9 shrink-0 place-items-center rounded-lg ${n.read ? "bg-slate-100 text-slate-500" : "bg-blue-50 text-[#1a73e8]"}`}
                >
                  <Bell size={16} />
                </span>
                <span className="min-w-0 flex-1">
                  <b className="block text-sm font-medium text-slate-800">
                    {n.title}
                  </b>
                  <span className="mt-1 block text-xs text-slate-500">
                    {n.detail}
                  </span>
                  <span className="mt-2 block text-[10px] text-slate-400">
                    {n.time}
                  </span>
                </span>
                {!n.read && (
                  <span
                    className="mt-1 size-2 rounded-full bg-[#1a73e8]"
                    aria-label="Unread"
                  />
                )}
              </button>
            ))}
            {rows.length === 0 && (
              <p className="p-10 text-center text-sm text-slate-500">
                You are all caught up.
              </p>
            )}
          </div>
        </Surface>
      </div>
    </main>
  );
}
