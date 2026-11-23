"use client";
import { useState } from "react";
import { useStore } from "../../lib/store";
import {
  PageHeader,
  Surface,
  SectionTitle,
} from "../../components/dashboard/primitives";
import { Check, Settings2 } from "lucide-react";
export default function SettingsPage() {
  const store = useStore();
  const [saved, setSaved] = useState(false);
  const prefs = store.settings;
  function save(e) {
    e.preventDefault();
    const f = new FormData(e.currentTarget);
    store.updateSettings({
      organization: f.get("organization"),
      email: f.get("email"),
      industry: f.get("industry"),
      fiscalYear: f.get("fiscalYear"),
      address: f.get("address"),
      emailNotifications: f.has("emailNotifications"),
      approvalReminders: f.has("approvalReminders"),
      weeklyDigest: f.has("weeklyDigest"),
    });
    setSaved(true);
    setTimeout(() => setSaved(false), 2500);
  }
  return (
    <main className="min-h-screen bg-[#f7f8fa] p-4 md:p-8">
      <div className="mx-auto max-w-[1050px]">
        <PageHeader
          title="Settings"
          description="Manage organization details and workspace notifications."
        />
        <form
          key={store.ready ? "ready" : "loading"}
          onSubmit={save}
          className="flex flex-col gap-4"
        >
          <Surface>
            <SectionTitle
              title="Organization profile"
              sub="Workspace details used across procurement documents"
            />
            <div className="grid gap-4 p-5 sm:grid-cols-2">
              <label className="field-label">
                Organization name
                <input
                  name="organization"
                  required
                  defaultValue={prefs.organization}
                  className="field-input"
                />
              </label>
              <label className="field-label">
                Business email
                <input
                  name="email"
                  type="email"
                  required
                  defaultValue={prefs.email}
                  className="field-input"
                />
              </label>
              <label className="field-label">
                Industry
                <select
                  name="industry"
                  defaultValue={prefs.industry}
                  className="field-input"
                >
                  <option>Technology</option>
                  <option>Manufacturing</option>
                  <option>Financial services</option>
                  <option>Retail</option>
                  <option>Healthcare</option>
                </select>
              </label>
              <label className="field-label">
                Fiscal year starts
                <select
                  name="fiscalYear"
                  defaultValue={prefs.fiscalYear}
                  className="field-input"
                >
                  {["January", "April", "July", "October"].map((x) => (
                    <option key={x}>{x}</option>
                  ))}
                </select>
              </label>
              <label className="field-label sm:col-span-2">
                Organization address
                <input
                  name="address"
                  defaultValue={prefs.address}
                  className="field-input"
                />
              </label>
            </div>
          </Surface>
          <Surface>
            <SectionTitle
              title="Notification preferences"
              sub="Choose which workspace reminders are enabled"
            />
            <div className="divide-y divide-slate-100">
              {[
                {
                  name: "emailNotifications",
                  title: "Email notifications",
                  desc: "Get updates about approvals, invoices, and sourcing events",
                },
                {
                  name: "approvalReminders",
                  title: "Approval reminders",
                  desc: "Highlight requests waiting for your review",
                },
                {
                  name: "weeklyDigest",
                  title: "Weekly spend digest",
                  desc: "Include a weekly summary of procurement activity",
                },
              ].map((x) => (
                <label
                  key={x.name}
                  className="flex cursor-pointer items-start gap-3 p-5"
                >
                  <input
                    name={x.name}
                    type="checkbox"
                    defaultChecked={prefs[x.name]}
                    className="mt-1 size-4 accent-[#1a73e8]"
                  />
                  <span>
                    <b className="text-sm font-medium text-slate-800">
                      {x.title}
                    </b>
                    <span className="mt-1 block text-xs text-slate-500">
                      {x.desc}
                    </span>
                  </span>
                </label>
              ))}
            </div>
          </Surface>
          <div className="flex flex-wrap items-center justify-between">
            <p className="text-xs text-slate-500">
              <Settings2 size={13} className="mr-1 inline" />
              Role access can be managed under Users & roles.
            </p>
            <button className="inline-flex h-10 items-center gap-2 rounded-lg bg-[#1a73e8] px-4 text-sm font-medium text-white">
              {saved && <Check size={15} />} {saved ? "Saved" : "Save settings"}
            </button>
          </div>
        </form>
      </div>
    </main>
  );
}
