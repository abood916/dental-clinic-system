"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Cairo } from "next/font/google";


export default function Sidebar() {
  const pathname = usePathname();

 const menuItems = [
  { name: "Dashboard", path: "/dashboard", icon: "📊" },
  { name: "Appointments", path: "/appointments", icon: "📅" },
  { name: "Patients", path: "/Patients", icon: "👥" },
  { name: "Invoices", path: "/invoices", icon: "📄" },
  { name: "Payments", path: "/payments", icon: "💰" },
  { name: "Expenses", path: "/expenses", icon: "📉" },
  { name: "HR Management", path: "/hr", icon: "👤" },
  { name: "Accounts", path: "/account", icon: "💳" },
  { name: "Periods", path: "/accountingPeriod", icon: "📅" },
  { name: "Journal Entries", path: "/journalEntry", icon: "📊" },
];

  return (
  <aside className="w-full md:w-64 p-3 sm:p-4 min-h-0 md:min-h-screen bg-[#0f1b33] text-white flex flex-col justify-between shadow-lg shrink-0">
    <div>
      <div className="flex items-center space-x-3 px-2 mb-5 md:mb-8 mt-2">
        <span className="text-2xl">🦷</span>
        <div>
          <h2 className="text-base font-bold text-white tracking-wide">Dental Clinic</h2>
          <p className="text-xs text-slate-400">Management System</p>
        </div>
      </div>

      <nav className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-1 gap-1.5">
        {menuItems.map((item) => {
          const isActive = pathname === item.path;
          return (
            <Link
              key={item.path}
              href={item.path}
              className={`flex items-center space-x-2 md:space-x-3 px-3 py-2.5 rounded-xl text-xs sm:text-sm font-medium transition ${
                isActive
                  ? "bg-blue-600 text-white shadow-md shadow-blue-600/20"
                  : "text-slate-300 hover:bg-slate-800 hover:text-white"
              }`}
            >
              <span className="text-base shrink-0">{item.icon}</span>
              <span>{item.name}</span>
            </Link>
          );
        })}
      </nav>
    </div>

    <div className="pt-4 mt-4 md:mt-0 border-t border-slate-800">
      <button
        onClick={() => {
          localStorage.removeItem("token");
          window.location.href = "/login";
        }}
        className="w-full flex items-center space-x-3 px-3 py-2.5 text-sm font-medium text-red-400 hover:bg-slate-800 rounded-xl transition"
      >
        <span>🚪</span>
        <span>Logout</span>
      </button>
    </div>
  </aside>
);
}