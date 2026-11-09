"use client";

import { useState, useEffect } from "react";

interface Account {
  _id: string;
  accountCode: string;
  name: string;
}

interface JournalEntry {
  _id: string;
  description: string;
  debitAccount: { _id: string; name: string; accountCode: string };
  creditAccount: { _id: string; name: string; accountCode: string };
  amount: number;
  date: string;
}

export default function JournalEntriesPage() {
  const [entries, setEntries] = useState<JournalEntry[]>([]);
  const [accounts, setAccounts] = useState<Account[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const [description, setDescription] = useState("");
  const [debitAccount, setDebitAccount] = useState("");
  const [creditAccount, setCreditAccount] = useState("");
  const [amount, setAmount] = useState("");

  const fetchData = async () => {
    try {
      const token = localStorage.getItem("token");
      const headers = { Authorization: `Bearer ${token}` };

      const entryRes = await fetch("https://dental-clinic-system-2.onrender.com/api/journal-entries", { headers });
      const entryData = await entryRes.json();
      if (entryData.entries) setEntries(entryData.entries);

      const accRes = await fetch("https://dental-clinic-system-2.onrender.com/api/accounts", { headers });
      const accData = await accRes.json();
      if (accData.accounts) setAccounts(accData.accounts);

    } catch (err) {
      setError("Server connection error");
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleCreateEntry = async (e: React.FormEvent) => {
    e.preventDefault();
    if (debitAccount === creditAccount) {
      alert("Debit and credit accounts must be different!");
      return;
    }

    setLoading(true);
    setError("");

    try {
      const token = localStorage.getItem("token");
      const res = await fetch("https://dental-clinic-system-2.onrender.com/api/journal-entries", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          description,
          debitAccount,
          creditAccount,
          amount: Number(amount),
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.message || "Failed to create journal entry");
      }

      setIsModalOpen(false);
      fetchData();

      setDescription("");
      setDebitAccount("");
      setCreditAccount("");
      setAmount("");
    } catch (err: any) {
      alert(err.message || err);
    } finally {
      setLoading(false);
    }
  };

  return (
  <div className="w-full min-h-screen bg-[#f3f5f8] p-4 sm:p-5 md:p-8 space-y-7">
    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-5">
      <h1 className="text-2xl md:text-3xl font-bold text-[#0f1b33] tracking-tight">
        Journal Entries
      </h1>
      <button
        onClick={() => setIsModalOpen(true)}
        className="w-full sm:w-auto bg-[#0f1b33] text-white px-6 py-3 rounded-xl text-sm font-semibold hover:bg-[#202d45] shadow-lg shadow-slate-900/10 transition-all duration-200"
      >
        Add New Entry
      </button>
    </div>

    {error && <p className="text-red-500 mb-4">{error}</p>}

    <div className="bg-white border border-slate-200 rounded-2xl overflow-hidden shadow-sm">
      <div className="w-full overflow-x-auto">
        <table className="w-full min-w-[850px] text-left border-collapse">
          <thead>
            <tr className="bg-[#f8fafc] border-b border-slate-200 text-xs text-slate-500 uppercase tracking-wider">
              <th className="px-4 sm:px-6 py-5 font-semibold whitespace-nowrap">DESCRIPTION</th>
              <th className="px-4 sm:px-6 py-5 font-semibold whitespace-nowrap">DEBIT ACCOUNT</th>
              <th className="px-4 sm:px-6 py-5 font-semibold whitespace-nowrap">CREDIT ACCOUNT</th>
              <th className="px-4 sm:px-6 py-5 font-semibold whitespace-nowrap">AMOUNT ($)</th>
              <th className="px-4 sm:px-6 py-5 font-semibold whitespace-nowrap">DATE</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100 text-sm text-slate-600">
            {entries.length > 0 ? (
              entries.map((ent) => (
                <tr key={ent._id} className="border-b hover:bg-gray-50 text-sm">
                  <td className="px-4 sm:px-6 py-5 font-medium">{ent.description}</td>
                  <td className="px-4 sm:px-6 py-5 text-blue-600 font-semibold whitespace-nowrap">
                    {ent.debitAccount ? `${ent.debitAccount.accountCode} - ${ent.debitAccount.name}` : "N/A"}
                  </td>
                  <td className="px-4 sm:px-6 py-5 text-purple-600 font-semibold whitespace-nowrap">
                    {ent.creditAccount ? `${ent.creditAccount.accountCode} - ${ent.creditAccount.name}` : "N/A"}
                  </td>
                  <td className="px-4 sm:px-6 py-5 font-bold text-green-600 whitespace-nowrap">${ent.amount}</td>
                  <td className="px-4 sm:px-6 py-5 whitespace-nowrap">{new Date(ent.date).toLocaleDateString()}</td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={5} className="text-center p-6 text-gray-500">
                  No journal entries found.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>

    {isModalOpen && (
      <div className="fixed inset-0 z-50 bg-[#0f1b33]/50 backdrop-blur-sm flex items-center justify-center p-3 sm:p-4">
        <div className="bg-white rounded-2xl p-5 sm:p-7 w-full max-w-lg max-h-[90vh] overflow-y-auto space-y-5 shadow-2xl border border-slate-100">
          <h2 className="text-xl font-bold text-slate-800">Add Journal Entry</h2>
          <form onSubmit={handleCreateEntry} className="space-y-4">
            <div>
              <label className="block text-sm font-semibold text-slate-600 mb-2">Description</label>
              <input
                type="text"
                placeholder="e.g. Daily clinic revenue recording"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                required
                className="w-full border border-slate-200 bg-slate-50 rounded-xl px-4 py-3 text-base sm:text-sm text-slate-700 outline-none focus:bg-white focus:border-[#0f1b33] focus:ring-2 focus:ring-slate-200 transition-all duration-200"
              />
            </div>

            <div>
              <label className="block text-xs font-medium text-gray-600 mb-1">Phone</label>
              <select
                value={debitAccount}
                onChange={(e) => setDebitAccount(e.target.value)}
                required
                className="w-full border border-slate-200 bg-slate-50 rounded-xl px-4 py-3 text-base sm:text-sm text-slate-700 outline-none focus:bg-white focus:border-[#0f1b33] focus:ring-2 focus:ring-slate-200 transition-all duration-200"
              >
                <option value="">Select Debit Account</option>
                {accounts.map((acc) => (
                  <option key={acc._id} value={acc._id}>
                    {acc.accountCode} - {acc.name}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-xs font-medium text-gray-600 mb-1">Email</label>
              <select
                value={creditAccount}
                onChange={(e) => setCreditAccount(e.target.value)}
                required
                className="w-full border border-slate-200 bg-slate-50 rounded-xl px-4 py-3 text-base sm:text-sm text-slate-700 outline-none focus:bg-white focus:border-[#0f1b33] focus:ring-2 focus:ring-slate-200 transition-all duration-200"
              >
                <option value="">Select Credit Account</option>
                {accounts.map((acc) => (
                  <option key={acc._id} value={acc._id}>
                    {acc.accountCode} - {acc.name}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-xs font-medium text-gray-600 mb-1">Email</label>
              <input
                type="number"
                step="0.01"
                placeholder="Enter amount"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                required
                className="w-full border border-slate-200 bg-slate-50 rounded-xl px-4 py-3 text-base sm:text-sm text-slate-700 outline-none focus:bg-white focus:border-[#0f1b33] focus:ring-2 focus:ring-slate-200 transition-all duration-200"
              />
            </div>

            <div className="flex flex-col-reverse sm:flex-row sm:justify-end gap-3 pt-2">
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
                className="w-full sm:w-auto px-6 py-2.5 rounded-xl text-sm font-semibold bg-[#0f1b33] text-white hover:bg-[#202d45] shadow-md transition-all duration-200"
              >
                {loading ? "Saving..." : "Save Entry"}
              </button>
            </div>
          </form>
        </div>
      </div>
    )}
  </div>
);
}