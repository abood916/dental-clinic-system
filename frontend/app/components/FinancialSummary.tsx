"use client";

import { useState, useEffect } from "react";

export default function FinancialSummary() {
  const [financials, setFinancials] = useState({
    totalIncome: 0,
    totalExpenses: 0,
    netProfit: 0,
    outstanding: 0,
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchFinancialData = async () => {
      try {
        const token = localStorage.getItem("token");
        const headers = { Authorization: `Bearer ${token}` };

        const [payRes, expRes, invRes] = await Promise.all([
          fetch("https://dental-clinic-system-2.onrender.com/api/payments", { headers }).catch(() => null),
          fetch("https://dental-clinic-system-2.onrender.com/api/expenses", { headers }).catch(() => null),
          fetch("https://dental-clinic-system-2.onrender.com/api/invoices", { headers }).catch(() => null),
        ]);

        const payData = payRes ? await payRes.json() : {};
        const expData = expRes ? await expRes.json() : {};
        const invData = invRes ? await invRes.json() : {};

        const income = payData.payments
          ? payData.payments.reduce((sum: number, p: any) => sum + (p.amount || 0), 0)
          : 0;

        const expensesList = expData.expenses || expData || [];
        const expenses = Array.isArray(expensesList)
          ? expensesList.reduce((sum: number, e: any) => sum + (e.amount || 0), 0)
          : 0;

        const invoicesList = invData.invoices || [];
        const outstandingAmount = invoicesList
          .filter((inv: any) => inv.status === "pending" || inv.status === "unpaid")
          .reduce((sum: number, inv: any) => sum + (inv.totalAmount || inv.amount || 0), 0);

        setFinancials({
          totalIncome: income,
          totalExpenses: expenses,
          netProfit: income - expenses,
          outstanding: outstandingAmount,
        });
      } catch (err) {
        console.error("Failed to fetch financial summary", err);
      } finally {
        setLoading(false);
      }
    };

    fetchFinancialData();
  }, []);

  const [currentMonth, setCurrentMonth] = useState("");

useEffect(() => {
  setCurrentMonth(new Date().toLocaleString("en-US", { month: "long", year: "numeric" }));
}, []);

  return (
  <div className="bg-white p-4 sm:p-5 md:p-6 rounded-2xl shadow-sm border border-slate-100 flex-1 w-full md:w-2/5 flex flex-col justify-between">
    <div>
      <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-3 mb-5 sm:mb-6">
        <h2 className="text-xl font-bold text-slate-800">Financial Summary</h2>
        <span className="text-xs font-semibold bg-slate-100 text-slate-600 px-3 py-1 rounded-full self-start sm:self-auto">
          {currentMonth}
        </span>
      </div>

      <div className="space-y-4">
        <div className="flex flex-col xs:flex-row xs:justify-between xs:items-center gap-1 py-2.5 border-b border-slate-100">
          <span className="text-sm text-slate-500 flex items-center gap-2">
            <span>💵</span> Total Income:
          </span>
          <span className="text-sm font-bold text-emerald-600">
            {loading ? "..." : `$${financials.totalIncome.toLocaleString()}`}
          </span>
        </div>

        <div className="flex flex-col xs:flex-row xs:justify-between xs:items-center gap-1 py-2.5 border-b border-slate-100">
          <span className="text-sm text-slate-500 flex items-center gap-2">
            <span>📉</span> Total Expenses:
          </span>
          <span className="text-sm font-bold text-rose-600">
            {loading ? "..." : `$${financials.totalExpenses.toLocaleString()}`}
          </span>
        </div>

        <div className="flex flex-col xs:flex-row xs:justify-between xs:items-center gap-1 py-2.5 border-b border-slate-100">
          <span className="text-sm text-slate-500 flex items-center gap-2">
            <span>📈</span> Net Profit:
          </span>
          <span className="text-sm font-bold text-blue-600">
            {loading ? "..." : `$${financials.netProfit.toLocaleString()}`}
          </span>
        </div>

        <div className="flex flex-col xs:flex-row xs:justify-between xs:items-center gap-1 py-2.5">
          <span className="text-sm text-slate-500 flex items-center gap-2">
            <span>⏳</span> Outstanding Collections:
          </span>
          <span className="text-sm font-bold text-amber-600">
            {loading ? "..." : `$${financials.outstanding.toLocaleString()}`}
          </span>
        </div>
      </div>
    </div>

    <div className="mt-6 pt-4 border-t border-slate-100 text-center">
      <span className="text-xs text-slate-400">
        Updated in real-time from Accounting modules
      </span>
    </div>
  </div>
);
}