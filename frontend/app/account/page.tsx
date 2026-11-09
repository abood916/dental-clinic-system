"use client";

import { useState, useEffect } from "react";

interface Account {
  _id: string;
  accountCode: string;
  name: string;
  type: "asset" | "liability" | "equity" | "revenue" | "expense";
  isActive: boolean;
}

export default function AccountsPage() {
  const [accounts, setAccounts] = useState<Account[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  // Form states
  const [accountCode, setAccountCode] = useState("");
  const [name, setName] = useState("");
  const [type, setType] = useState("asset");

  // Fetch Accounts
  const fetchData = async () => {
    try {
      const token = localStorage.getItem("token");
      const res = await fetch("https://dental-clinic-system-2.onrender.com/api/accounts", {
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await res.json();
      if (data.accounts) setAccounts(data.accounts);
    } catch (err) {
      setError("Server connection error");
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  // Create Account Submit
  const handleCreateAccount = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const token = localStorage.getItem("token");
      const res = await fetch("https://dental-clinic-system-2.onrender.com/api/accounts", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          accountCode,
          name,
          type,
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.message || "Failed to create account");
      }

      setIsModalOpen(false);
      fetchData();

      // Reset form
      setAccountCode("");
      setName("");
      setType("asset");
    } catch (err: any) {
      alert(err.message || err);
    } finally {
      setLoading(false);
    }
  };

  // Deactivate Account
  const handleDeactivate = async (id: string) => {
    if (!confirm("Are you sure you want to deactivate this account?")) return;

    try {
      const token = localStorage.getItem("token");
      const res = await fetch(`https://dental-clinic-system-2.onrender.com/api/accounts/${id}/deactivate`, {
        method: "PATCH",
        headers: { Authorization: `Bearer ${token}` },
      });

      if (!res.ok) throw new Error("Failed to deactivate account");
      fetchData();
    } catch (err: any) {
      alert(err.message);
    }
  };

  return (
    <div className="w-full min-h-screen bg-slate-100 p-4 sm:p-5 md:p-8 space-y-6 md:space-y-7">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 sm:gap-5">
        <h1 className="text-2xl md:text-3xl font-bold text-[#0f1b33] tracking-tight">Chart Of Account</h1>
        <button
          onClick={() => setIsModalOpen(true)}
          className="w-full sm:w-auto bg-slate-800 text-white px-5 sm:px-6 py-3 rounded-xl text-sm font-semibold hover:bg-[#202d45] shadow-lg shadow-slate-900/10 transition-all duration-200"
        >
          Add New Account
        </button>
      </div>

      {error && <p className="text-red-500 mb-4">{error}</p>}

      {/* Accounts Table */}
      <div className="bg-white border border-slate-200 rounded-2xl overflow-hidden shadow-sm">
        <div className="w-full overflow-x-auto">
        <table className="w-full min-w-[750px] text-left border-collapse">
          <thead>
           <tr className="bg-[#f8fafc] border-b border-slate-200 text-xs text-slate-500 uppercase tracking-wider">
              <th className="px-4 md:px-6 py-4 md:py-5 font-semibold">CODE</th>
              <th className="px-4 md:px-6 py-4 md:py-5 font-semibold">ACCOUNT NAME</th>
              <th className="px-4 md:px-6 py-4 md:py-5 font-semibold">TYPE</th>
              <th className="px-4 md:px-6 py-4 md:py-5 font-semibold">STATUS</th>
              <th className="px-4 md:px-6 py-4 md:py-5 font-semibold text-right">ACTIONS</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100 text-sm text-slate-600">
            {accounts.length > 0 ? (
              accounts.map((acc) => (
                <tr key={acc._id} className="border-b border-slate-100 last:border-0 hover:bg-slate-50 text-sm transition-colors">
                  <td className="px-4 md:px-6 py-4 md:py-5 font-mono font-semibold whitespace-nowrap">{acc.accountCode}</td>
                  <td className="px-4 md:px-6 py-4 md:py-5 font-medium whitespace-nowrap">{acc.name}</td>
                  <td className="px-4 md:px-6 py-4 md:py-5 uppercase text-xs font-bold text-gray-600 whitespace-nowrap">{acc.type}</td>
                  <td className="px-4 md:px-6 py-4 md:py-5 whitespace-nowrap">
                    <span
                      className={`px-2 py-1 rounded-full text-xs font-semibold ${
                        acc.isActive ? "bg-green-100 text-green-700" : "bg-red-100 text-red-700"
                      }`}
                    >
                      {acc.isActive ? "Active" : "Inactive"}
                    </span>
                  </td>
                  <td className="p-3 text-right">
                    {acc.isActive && (
                      <button
                        onClick={() => handleDeactivate(acc._id)}
                        className="text-red-600 hover:underline text-xs font-semibold"
                      >
                        Deactivate
                      </button>
                    )}
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={5} className="text-center p-6 text-gray-500">
                  No accounts found.
                </td>
              </tr>
            )}
          </tbody>
        </table>
        </div>
      </div>

      {/* Modal Add Account */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 bg-[#0f1b33]/50 backdrop-blur-sm flex items-center justify-center p-3 sm:p-4">
          <div className="bg-white rounded-2xl p-5 sm:p-7 w-full max-w-lg max-h-[90vh] overflow-y-auto space-y-5 shadow-2xl border border-slate-100">
            <h2 className="text-xl font-bold text-slate-800">Add New Account</h2>
            <form onSubmit={handleCreateAccount} className="space-y-4">
              <div>
                <label className="block text-xs font-medium text-gray-600 mb-1">Account Code</label>
                <input
                  type="text"
                  placeholder="e.g. 1010"
                  value={accountCode}
                  onChange={(e) => setAccountCode(e.target.value)}
                  required
                  className="w-full border border-slate-200 bg-slate-50 rounded-xl px-4 py-3 text-base sm:text-sm text-slate-700 outline-none focus:bg-white focus:border-[#0f1b33] focus:ring-2 focus:ring-slate-200 transition-all duration-200"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-gray-600 mb-1">Account Name</label>
                <input
                  type="text"
                  placeholder="e.g. Cash in Hand"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  required
                  className="w-full border border-slate-200 bg-slate-50 rounded-xl px-4 py-3 text-base sm:text-sm text-slate-700 outline-none focus:bg-white focus:border-[#0f1b33] focus:ring-2 focus:ring-slate-200 transition-all duration-200"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-gray-600 mb-1">Account Type</label>
                <select
                  value={type}
                  onChange={(e) => setType(e.target.value)}
                  className="w-full border border-slate-200 bg-slate-50 rounded-xl px-4 py-3 text-base sm:text-sm text-slate-700 outline-none focus:bg-white focus:border-[#0f1b33] focus:ring-2 focus:ring-slate-200 transition-all duration-200"
                >
                  <option value="asset">Asset</option>
                  <option value="liability">Liability</option>
                  <option value="equity">Equity</option>
                  <option value="revenue">Revenue</option>
                  <option value="expense">Expense</option>
                </select>
              </div>

              <div className="flex flex-col-reverse sm:flex-row justify-end gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="w-full sm:w-auto px-5 py-2.5 rounded-xl text-sm font-semibold text-slate-600 hover:bg-slate-100 transition-all"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={loading}
                  className="w-full sm:w-auto px-6 py-2.5 rounded-xl text-sm font-semibold bg-[#0f1b33] text-white hover:bg-[#202d45] shadow-md transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {loading ? "Saving..." : "Save Account"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
} 