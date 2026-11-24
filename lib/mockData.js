export const roles = ["admin", "employee", "department_manager", "procurement_officer", "finance_manager", "director", "vendor"];
export const roleLabels = { admin: "Administrator", employee: "Employee", department_manager: "Department Manager", procurement_officer: "Procurement Officer", finance_manager: "Finance Manager", director: "Director", vendor: "Vendor" };
export const seedUsers = [
  { id: "u1", name: "Shahbaz Khan", email: "admin@procurex.com", role: "admin", department: "Administration", status: "Active" },
  { id: "u2", name: "Bilal Ahmed", email: "employee@procurex.com", role: "employee", department: "Engineering", status: "Active" },
  { id: "u3", name: "Sara Malik", email: "manager@procurex.com", role: "department_manager", department: "Marketing", status: "Active" },
  { id: "u4", name: "Usman Tariq", email: "procurement@procurex.com", role: "procurement_officer", department: "Procurement", status: "Active" },
  { id: "u5", name: "Hina Raza", email: "finance@procurex.com", role: "finance_manager", department: "Finance", status: "Active" },
  { id: "u6", name: "Omar Siddiqui", email: "director@procurex.com", role: "director", department: "Executive", status: "Active" },
  { id: "u7", name: "Techno Supplies Ltd", email: "vendor@procurex.com", role: "vendor", department: "Vendor", status: "Active" },
  { id: "u8", name: "Nadia Iqbal", email: "nadia@procurex.com", role: "employee", department: "Operations", status: "Active" },
];
export const seedVendors = [
  { id: "v1", name: "Techno Supplies Ltd", category: "IT Equipment", contact: "sales@technosupplies.pk", phone: "+92 300 1234567", rating: 4.8, ntn: "1234567-8", status: "Active", spend: 4250000, delivery: 96 },
  { id: "v2", name: "Office Essentials Co.", category: "Office Supplies", contact: "hello@officeessentials.pk", phone: "+92 301 5678910", rating: 4.6, ntn: "7654321-0", status: "Active", spend: 1840000, delivery: 91 },
  { id: "v3", name: "Vertex Technologies", category: "IT Equipment", contact: "quotes@vertex.pk", phone: "+92 333 9182736", rating: 4.4, ntn: "2345678-1", status: "Active", spend: 3150000, delivery: 88 },
  { id: "v4", name: "Metro Logistics", category: "Logistics", contact: "ops@metrologistics.pk", phone: "+92 321 1122334", rating: 4.2, ntn: "9876543-2", status: "On hold", spend: 980000, delivery: 82 },
  { id: "v5", name: "Pak Furniture Works", category: "Furniture", contact: "orders@pakfurniture.pk", phone: "+92 322 5432198", rating: 4.7, ntn: "5432198-5", status: "Active", spend: 2230000, delivery: 94 },
];
export const seedRequests = [
  { id: "PR-2026-041", title: "Laptops for engineering team", department: "Engineering", requester: "Bilal Ahmed", date: "2026-11-21", amount: 1480000, status: "Pending approval", items: [{ name: "Business laptop", qty: 8, price: 185000 }] },
  { id: "PR-2026-040", title: "Quarterly office supplies", department: "Operations", requester: "Nadia Iqbal", date: "2026-11-20", amount: 185000, status: "Approved", items: [{ name: "Office supply bundle", qty: 1, price: 185000 }] },
  { id: "PR-2026-039", title: "Meeting room furniture", department: "Administration", requester: "Ayesha Khan", date: "2026-11-18", amount: 640000, status: "In sourcing", items: [{ name: "Conference chair", qty: 16, price: 40000 }] },
  { id: "PR-2026-038", title: "Annual cloud renewal", department: "Engineering", requester: "Bilal Ahmed", date: "2026-11-16", amount: 920000, status: "Draft", items: [{ name: "Cloud subscription", qty: 1, price: 920000 }] },
  { id: "PR-2026-037", title: "Marketing event materials", department: "Marketing", requester: "Sara Malik", date: "2026-11-14", amount: 275000, status: "Completed", items: [{ name: "Event materials", qty: 1, price: 275000 }] },
];
export const seedPurchaseOrders = [
  { id: "PO-2026-018", requestId: "PR-2026-040", vendor: "Office Essentials Co.", date: "2026-11-21", amount: 179500, status: "Sent" },
  { id: "PO-2026-017", requestId: "PR-2026-037", vendor: "Pak Furniture Works", date: "2026-11-19", amount: 268000, status: "Partially Received" },
  { id: "PO-2026-016", requestId: "PR-2026-035", vendor: "Techno Supplies Ltd", date: "2026-11-17", amount: 845000, status: "Completed" },
];
export const spendTrend = [{ month: "Jun", spend: 2.4, budget: 3 }, { month: "Jul", spend: 3.1, budget: 3.4 }, { month: "Aug", spend: 2.7, budget: 3.2 }, { month: "Sep", spend: 3.8, budget: 4 }, { month: "Oct", spend: 3.2, budget: 3.7 }, { month: "Nov", spend: 4.1, budget: 4.5 }];
