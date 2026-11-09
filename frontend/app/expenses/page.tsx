"use client";

import { useState, useEffect } from "react";

interface Expense {
  _id: string;
  description: string;
  amount: number;
  category: "rent" | "salaries" | "supplies" | "maintenance" | "other";
  date: string;
}

export default function ExpensesPage() {
  const [expenses, setExpenses] = useState<Expense[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const [description, setDescription] = useState("");
  const [amount, setAmount] = useState("");
  const [category, setCategory] = useState("supplies");
  const [date, setDate] = useState("");

  const fetchData = async () => {
    try {
      const token = localStorage.getItem("token");
      const res = await fetch("http://localhost:4000/api/expenses", {
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await res.json();
      if (data.expenses) setExpenses(data.expenses);
    } catch (err) {
      setError("Server connection error");
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  // Submit Expense
  const handleCreateExpense = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const token = localStorage.getItem("token");
      const res = await fetch("http://localhost:4000/api/expenses", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          description,
          amount: Number(amount),
          category,
          date: date || undefined,
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.message || "Failed to create expense");
      }

      setIsModalOpen(false);
      fetchData();

      setDescription("");
      setAmount("");
      setCategory("supplies");
      setDate("");
    } catch (err: any) {
      alert(err.message || err);
    } finally {
      setLoading(false);
    }
  };

  
return (
  <div className="min-h-screen w-full bg-[#f3f5f8] p-4 sm:p-6 md:p-8">
  <div className="flex flex-col sm:flex-row justify-between sm:items-center gap-4 mb-6 sm:mb-8">
    <h1 className="text-2xl md:text-3xl font-bold text-[#0f1b33] tracking-tight">
      Expenses Management
    </h1>

    <button
      onClick={() => setIsModalOpen(true)}
      className="w-full sm:w-auto bg-[#0f1b33] text-white px-5 py-2.5 rounded-xl hover:bg-[#202d45] transition-all duration-200 text-sm font-semibold shadow-sm hover:shadow-md"
    >
      Add New Expense
    </button>
  </div>

  {error && (
    <p className="text-red-600 bg-red-50 border border-red-100 rounded-xl px-4 py-3 mb-5 text-sm">
      {error}
    </p>
  )}

  <div className="bg-white shadow-sm border border-slate-200/80 rounded-2xl overflow-hidden">
    <div className="w-full overflow-x-auto">
      <table className="w-full min-w-[650px] text-left border-collapse">
        <thead>
          <tr className="bg-slate-50/90 border-b border-slate-200 text-slate-500 text-xs font-bold tracking-wider">
            <th className="px-4 sm:px-5 py-4 whitespace-nowrap">DESCRIPTION</th>
            <th className="px-4 sm:px-5 py-4 whitespace-nowrap">CATEGORY</th>
            <th className="px-4 sm:px-5 py-4 whitespace-nowrap">AMOUNT ($)</th>
            <th className="px-4 sm:px-5 py-4 whitespace-nowrap">DATE</th>
          </tr>
        </thead>

        <tbody>
          {expenses.length > 0 ? (
            expenses.map((exp) => (
              <tr
                key={exp._id}
                className="border-b border-slate-100 last:border-0 hover:bg-slate-50/80 text-sm text-slate-600 transition-colors duration-150"
              >
                <td className="px-4 sm:px-5 py-4 font-semibold text-[#202d45]">
                  {exp.description}
                </td>

                <td className="px-4 sm:px-5 py-4">
                  <span className="bg-slate-100 text-slate-700 px-3 py-1.5 rounded-lg text-xs uppercase font-bold">
                    {exp.category}
                  </span>
                </td>

                <td className="px-4 sm:px-5 py-4 font-bold text-red-600">
                  ${exp.amount}
                </td>

                <td className="px-4 sm:px-5 py-4 whitespace-nowrap">
                  {new Date(exp.date).toLocaleDateString()}
                </td>
              </tr>
            ))
          ) : (
            <tr>
              <td
                colSpan={4}
                className="text-center px-5 py-10 text-slate-400 text-sm"
              >
                No expenses recorded yet.
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  </div>

  {isModalOpen && (
    <div className="fixed inset-0 bg-[#0f1b33]/50 backdrop-blur-sm flex items-center justify-center p-3 sm:p-4 z-50">
      <div className="bg-white rounded-2xl max-w-md w-full p-5 sm:p-7 max-h-[90vh] overflow-y-auto shadow-2xl border border-slate-100">
        <h2 className="text-xl font-bold mb-6 text-[#0f1b33]">
          Record New Expense
        </h2>

        <form onSubmit={handleCreateExpense} className="space-y-4">
          <div>
            <label className="block text-xs font-semibold text-slate-600 mb-2">
              Description
            </label>

            <input
              type="text"
              placeholder="e.g. Dental Supplies Purchase"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              required
              className="w-full border border-slate-200 rounded-xl px-4 py-3 text-base sm:text-sm text-[#202d45] bg-white outline-none transition-all duration-200 focus:border-[#0f1b33] focus:ring-2 focus:ring-[#0f1b33]/10"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-600 mb-2">
              Category
            </label>

            <select
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              className="w-full border border-slate-200 rounded-xl px-4 py-3 text-base sm:text-sm text-[#202d45] bg-white outline-none transition-all duration-200 focus:border-[#0f1b33] focus:ring-2 focus:ring-[#0f1b33]/10"
            >
              <option value="supplies">Supplies</option>
              <option value="rent">Rent</option>
              <option value="salaries">Salaries</option>
              <option value="maintenance">Maintenance</option>
              <option value="other">Other</option>
            </select>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-600 mb-2">
              Amount ($)
            </label>

            <input
              type="number"
              step="0.01"
              placeholder="Enter expense amount"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              required
              className="w-full border border-slate-200 rounded-xl px-4 py-3 text-base sm:text-sm text-[#202d45] bg-white outline-none transition-all duration-200 focus:border-[#0f1b33] focus:ring-2 focus:ring-[#0f1b33]/10"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-600 mb-2">
              Date (Optional)
            </label>

            <input
              type="date"
              value={date}
              onChange={(e) => setDate(e.target.value)}
              className="w-full border border-slate-200 rounded-xl px-4 py-3 text-base sm:text-sm text-[#202d45] bg-white outline-none transition-all duration-200 focus:border-[#0f1b33] focus:ring-2 focus:ring-[#0f1b33]/10"
            />
          </div>

          <div className="flex flex-col-reverse sm:flex-row justify-end gap-3 pt-4">
            <button
              type="button"
              onClick={() => setIsModalOpen(false)}
              className="w-full sm:w-auto px-5 py-2.5 text-slate-500 hover:text-[#0f1b33] hover:bg-slate-100 rounded-xl text-sm font-semibold transition-all duration-200"
            >
              Cancel
            </button>

            <button
              type="submit"
              disabled={loading}
              className="w-full sm:w-auto bg-[#0f1b33] text-white px-6 py-2.5 rounded-xl text-sm font-semibold hover:bg-[#202d45] transition-all duration-200 shadow-sm disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? "Saving..." : "Save Expense"}
            </button>
          </div>
        </form>
      </div>
    </div>
  )}
</div>
);

}