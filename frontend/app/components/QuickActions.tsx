"use client";

import Link from "next/link";

export default function QuickActions() {
  const actions = [
    {
      title: "Add New Patient",
      icon: "👤+",
      path: "/Patients",
      bgColor: "bg-blue-600",
      textColor: "text-white",
    },
    {
      title: "Schedule Appointment",
      icon: "📅+",
      path: "/appointments",
      bgColor: "bg-slate-700",
      textColor: "text-white",
    },
    {
      title: "Create New Invoice",
      icon: "📄+",
      path: "/invoices",
      bgColor: "bg-slate-700",
      textColor: "text-white",
    },
    {
      title: "Register Payment",
      icon: "💰+",
      path: "/payments",
      bgColor: "bg-slate-700",
      textColor: "text-white",
    },
  ];

    return (
      <div className="bg-white p-4 sm:p-5 md:p-6 rounded-2xl shadow-sm border border-slate-100 flex-1 w-full">
        <h2 className="text-xl font-bold text-slate-800 mb-5 sm:mb-6">Quick Actions</h2>

        <div className="grid grid-cols-2 gap-3 sm:gap-4">
          {actions.map((action, index) => (
            <Link
              key={index}
              href={action.path}
              className={`flex flex-col items-center justify-center p-3 sm:p-5 md:p-6 rounded-2xl text-center min-h-[130px] sm:h-40 transition hover:shadow-lg ${action.bgColor} ${action.textColor}`}
            >
              <div className="text-3xl sm:text-4xl mb-2 sm:mb-3">{action.icon}</div>
              <span className="text-xs sm:text-sm font-semibold leading-snug">
                {action.title}
              </span>
            </Link>
          ))}
      </div>
    </div>
  );
}