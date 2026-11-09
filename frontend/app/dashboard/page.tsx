"use client";

import Sidebar from "../components/Sidebar";
import DashboardCards from "../components/dashboardCards/page";
import QuickActions from "../components/QuickActions";
import FinancialSummary from "../components/FinancialSummary";

export default function DashboardPage() {
  return (
  <div className="flex flex-col md:flex-row min-h-screen bg-slate-100">
    <Sidebar />

    <main className="flex-1 min-w-0 p-4 sm:p-5 md:p-6 lg:p-8">
      <div className="mb-6 md:mb-8">
        <h1 className="text-xl sm:text-2xl font-bold text-slate-800">
          Welcome back! 👋
        </h1>
        <p className="text-sm text-slate-500 mt-1">
          Here is what is happening with your clinic today.
        </p>
      </div>

      <div className="space-y-5 md:space-y-6">
        <DashboardCards />

        <div className="flex flex-col lg:flex-row gap-5 md:gap-6">
          <QuickActions />
          <FinancialSummary />
        </div>
      </div>
    </main>
  </div>
);
}