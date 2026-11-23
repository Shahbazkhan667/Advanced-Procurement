"use client";
import { useMemo, useState } from "react";
import { useStore } from "../../../lib/store";
import {
  PageHeader,
  Surface,
  SectionTitle,
  Status,
  Button,
} from "../../../components/dashboard/primitives";
import { Plus, Search, Trash2, UserRoundCog, X } from "lucide-react";
import { roleLabels, roles } from "../../../lib/mockData";
export default function UserManagementPage() {
  const store = useStore();
  const [query, setQuery] = useState("");
  const [filter, setFilter] = useState("all");
  const [statusFilter, setStatusFilter] = useState("all");
  const [modal, setModal] = useState(false);
  const [remove, setRemove] = useState(null);
  const [departmentName, setDepartmentName] = useState("");
  const rows = useMemo(
    () =>
      store.users.filter(
        (u) =>
          `${u.name} ${u.email} ${u.department}`
            .toLowerCase()
            .includes(query.toLowerCase()) &&
          (filter === "all" || u.role === filter) &&
          (statusFilter === "all" || u.status === statusFilter),
      ),
    [store.users, query, filter, statusFilter],
  );
  function create(e) {
    e.preventDefault();
    const f = new FormData(e.currentTarget);
    store.addUser({
      name: f.get("name"),
      email: f.get("email"),
      department: f.get("department"),
      role: f.get("role"),
    });
    setModal(false);
  }
  return (
    <main className="min-h-screen bg-[#f7f8fa] p-4 md:p-8">
      <div className="mx-auto max-w-[1300px]">
        <PageHeader
          title="Users & roles"
          description="Manage workspace members, department assignments, and role access."
          action={
            <Button icon={Plus} onClick={() => setModal(true)}>
              Invite user
            </Button>
          }
        />
        <div className="mb-4 grid gap-4 sm:grid-cols-3">
          <Surface className="p-4">
            <p className="text-xs text-slate-500">Workspace members</p>
            <strong className="mt-1 block text-2xl">
              {store.users.length}
            </strong>
          </Surface>
          <Surface className="p-4">
            <p className="text-xs text-slate-500">Active users</p>
            <strong className="mt-1 block text-2xl">
              {store.users.filter((u) => u.status === "Active").length}
            </strong>
          </Surface>
          <Surface className="p-4">
            <p className="text-xs text-slate-500">Departments</p>
            <strong className="mt-1 block text-2xl">
              {new Set(store.users.map((u) => u.department)).size}
            </strong>
          </Surface>
        </div>
        <Surface className="mb-4">
          <SectionTitle
            title="Department management"
            sub="Add or remove workspace departments"
          />
          <div className="flex flex-wrap items-center gap-2 p-4">
            {store.departments.map((d) => (
              <span
                key={d}
                className="inline-flex items-center gap-2 rounded-full bg-slate-100 px-3 py-1.5 text-xs text-slate-700"
              >
                {d}
                <button
                  aria-label={`Remove ${d} department`}
                  onClick={() => store.removeDepartment(d)}
                  className="text-slate-400 hover:text-rose-600"
                >
                  <X size={13} />
                </button>
              </span>
            ))}
            <form
              onSubmit={(e) => {
                e.preventDefault();
                if (departmentName.trim()) {
                  store.addDepartment(departmentName.trim());
                  setDepartmentName("");
                }
              }}
              className="flex gap-2"
            >
              <input
                aria-label="New department name"
                value={departmentName}
                onChange={(e) => setDepartmentName(e.target.value)}
                placeholder="New department"
                className="h-8 rounded-lg border border-slate-200 px-2 text-xs outline-none focus:border-blue-400"
              />
              <button className="h-8 rounded-lg border border-slate-200 px-3 text-xs font-medium hover:bg-slate-50">
                Add
              </button>
            </form>
          </div>
        </Surface>
        <Surface>
          <SectionTitle
            title="Workspace members"
            sub="Changes to access apply immediately"
          />
          <div className="flex flex-wrap items-center justify-between gap-3 p-4">
            <label className="relative">
              <Search
                size={15}
                className="absolute left-3 top-2.5 text-slate-400"
              />
              <input
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                aria-label="Search users"
                placeholder="Search users…"
                className="h-9 rounded-lg border border-slate-200 pl-9 pr-3 text-sm outline-none focus:ring-2 focus:ring-blue-100"
              />
            </label>
            <select
              aria-label="Filter by role"
              value={filter}
              onChange={(e) => setFilter(e.target.value)}
              className="h-9 rounded-lg border border-slate-200 bg-white px-3 text-sm"
            >
              <option value="all">All roles</option>
              {roles.map((r) => (
                <option key={r} value={r}>
                  {roleLabels[r]}
                </option>
              ))}
            </select>
            <select
              aria-label="Filter by status"
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="h-9 rounded-lg border border-slate-200 bg-white px-3 text-sm"
            >
              <option value="all">All statuses</option>
              <option>Active</option>
              <option>Inactive</option>
            </select>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full min-w-[850px] text-left text-sm">
              <thead className="border-y border-slate-100 bg-slate-50/70 text-[10px] uppercase tracking-wider text-slate-400">
                <tr>
                  {["User", "Department", "Role", "Status", "Actions"].map(
                    (x) => (
                      <th key={x} className="px-4 py-3 font-semibold">
                        {x}
                      </th>
                    ),
                  )}
                </tr>
              </thead>
              <tbody>
                {rows.map((u) => (
                  <tr key={u.id} className="border-b border-slate-50">
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-3">
                        <span className="grid size-9 place-items-center rounded-full bg-blue-50 text-xs font-semibold text-blue-700">
                          {u.name
                            .split(" ")
                            .map((x) => x[0])
                            .slice(0, 2)
                            .join("")}
                        </span>
                        <span>
                          <b className="block font-medium text-slate-800">
                            {u.name}
                          </b>
                          <small className="text-slate-500">{u.email}</small>
                        </span>
                      </div>
                    </td>
                    <td className="px-4 py-3 text-slate-600">{u.department}</td>
                    <td className="px-4 py-3 text-slate-600">
                      {roleLabels[u.role]}
                    </td>
                    <td className="px-4 py-3">
                      <Status value={u.status} />
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-2">
                        <button
                          onClick={() =>
                            store.updateUser(u.id, {
                              status:
                                u.status === "Active" ? "Inactive" : "Active",
                            })
                          }
                          className="rounded-md border border-slate-200 px-2.5 py-1.5 text-xs font-medium text-slate-600 hover:bg-slate-50"
                        >
                          {u.status === "Active" ? "Deactivate" : "Activate"}
                        </button>
                        <button
                          onClick={() => setRemove(u)}
                          aria-label={`Delete ${u.name}`}
                          className="rounded-md p-2 text-slate-400 hover:bg-rose-50 hover:text-rose-600"
                        >
                          <Trash2 size={15} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
            {rows.length === 0 && (
              <p className="p-10 text-center text-sm text-slate-500">
                No users match these filters.
              </p>
            )}
          </div>
        </Surface>
      </div>
      {modal && (
        <div className="fixed inset-0 z-50 grid place-items-center bg-slate-950/40 p-4">
          <form
            onSubmit={create}
            className="w-full max-w-lg rounded-2xl bg-white p-6 shadow-2xl"
          >
            <div className="mb-5 flex justify-between">
              <div>
                <h2 className="font-semibold">Invite a workspace member</h2>
                <p className="mt-1 text-xs text-slate-500">
                  Set access level and department assignment.
                </p>
              </div>
              <button
                type="button"
                onClick={() => setModal(false)}
                aria-label="Close"
                className="text-slate-500"
              >
                <X size={18} />
              </button>
            </div>
            <div className="grid gap-4">
              <label className="field-label">
                Full name
                <input name="name" required className="field-input" />
              </label>
              <label className="field-label">
                Work email
                <input
                  name="email"
                  type="email"
                  required
                  className="field-input"
                />
              </label>
              <div className="grid grid-cols-2 gap-3">
                <label className="field-label">
                  Department
                  <select name="department" className="field-input">
                    <option>Engineering</option>
                    <option>Operations</option>
                    <option>Marketing</option>
                    <option>Procurement</option>
                    <option>Finance</option>
                    <option>Administration</option>
                  </select>
                </label>
                <label className="field-label">
                  Role
                  <select name="role" className="field-input">
                    {roles.map((r) => (
                      <option key={r} value={r}>
                        {roleLabels[r]}
                      </option>
                    ))}
                  </select>
                </label>
              </div>
              <button className="mt-2 h-10 rounded-lg bg-[#1a73e8] text-sm font-medium text-white">
                Send invitation
              </button>
            </div>
          </form>
        </div>
      )}
      {remove && (
        <div className="fixed inset-0 z-50 grid place-items-center bg-slate-950/40 p-4">
          <div
            role="alertdialog"
            aria-modal="true"
            className="w-full max-w-sm rounded-2xl bg-white p-6 shadow-2xl"
          >
            <div className="grid size-10 place-items-center rounded-full bg-rose-50 text-rose-600">
              <UserRoundCog size={19} />
            </div>
            <h2 className="mt-4 font-semibold">Remove {remove.name}?</h2>
            <p className="mt-2 text-sm text-slate-500">
              This member will lose access to the workspace. This cannot be
              undone.
            </p>
            <div className="mt-5 flex justify-end gap-2">
              <button
                onClick={() => setRemove(null)}
                className="rounded-lg border border-slate-200 px-3 py-2 text-sm"
              >
                Cancel
              </button>
              <button
                onClick={() => {
                  store.deleteUser(remove.id);
                  setRemove(null);
                }}
                className="rounded-lg bg-rose-600 px-3 py-2 text-sm font-medium text-white"
              >
                Remove member
              </button>
            </div>
          </div>
        </div>
      )}
    </main>
  );
}
