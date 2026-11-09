"use client";

import { useState, useEffect } from "react";

export default function DashboardCards() {
  const [stats, setStats] = useState({
    appointmentsCount: 0,
    newPatientsCount: 0,
    dailyRevenue: 0,
    pendingInvoices: 0,
  });

  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchRealStats = async () => {
      try {
        const token = localStorage.getItem("token");
        const headers = { Authorization: `Bearer ${token}` };

        const [appRes, invRes, payRes, empRes] = await Promise.all([
          fetch("http://localhost:4000/api/appointments", { headers }).catch(() => null),
          fetch("http://localhost:4000/api/invoices", { headers }).catch(() => null),
          fetch("http://localhost:4000/api/payments", { headers }).catch(() => null),
          fetch("http://localhost:4000/api/hr/employees", { headers }).catch(() => null),
        ]);

        const appData = appRes ? await appRes.json() : {};
        const invData = invRes ? await invRes.json() : {};
        const payData = payRes ? await payRes.json() : {};

        const totalRevenue = payData.payments
          ? payData.payments.reduce((sum: number, p: any) => sum + (p.amount || 0), 0)
          : 0;

        const invoicesList = invData.invoices || [];
        const pendingCount = invoicesList.filter(
          (inv: any) => inv.status === "pending" || inv.status === "unpaid"
        ).length;

        setStats({
          appointmentsCount: appData.count || appData.appointments?.length || 0,
          newPatientsCount: 8, 
          dailyRevenue: totalRevenue,
          pendingInvoices: pendingCount || invoicesList.length,
        });
      } catch (err) {
        console.error("Failed to fetch dashboard stats", err);
      } finally {
        setLoading(false);
      }
    };

    fetchRealStats();
  }, []);

  const cards = [
    {
      title: "Today's Appointments",
      value: loading ? "..." : stats.appointmentsCount,
      icon: "⏰",
      bgColor: "bg-blue-50",
      textColor: "text-blue-600",
    },
    {
      title: "New Patients",
      value: loading ? "..." : stats.newPatientsCount,
      icon: "👤",
      bgColor: "bg-emerald-50",
      textColor: "text-emerald-600",
    },
    {
      title: "Total Revenue",
      value: loading ? "..." : `$${stats.dailyRevenue.toLocaleString()}`,
      icon: "💵",
      bgColor: "bg-amber-50",
      textColor: "text-amber-600",
    },
    {
      title: "Pending Invoices",
      value: loading ? "..." : stats.pendingInvoices,
      icon: "📄",
      bgColor: "bg-rose-50",
      textColor: "text-rose-600",
    },
  ];

  return (
  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 md:gap-5">
    {cards.map((card, index) => (
      <div
        key={index}
        className="bg-slate-200 p-4 sm:p-5 rounded-2xl shadow-sm flex items-center justify-between gap-3 hover:shadow-md transition"
      >
        <div className="min-w-0">
          <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider">
            {card.title}
          </p>
          <h3 className="text-xl sm:text-2xl font-bold text-slate-800 mt-2 break-words">
            {card.value}
          </h3>
        </div>
        <div
          className={`w-10 h-10 sm:w-12 sm:h-12 shrink-0 rounded-xl flex items-center justify-center text-xl ${card.bgColor} ${card.textColor}`}
        >
          {card.icon}
        </div>
      </div>
    ))}
  </div>
);
}