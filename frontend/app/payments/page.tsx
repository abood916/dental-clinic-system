"use client";

import { useState, useEffect } from "react";

interface Payment {
  _id: string;
  invoice: { _id: string; invoiceNumber: string; total: number };
  amount: number;
  method: string;
  createdAt: string;
}

interface Invoice {
  _id: string;
  invoiceNumber: string;
  total: number;
}

export default function PaymentsPage() {
  const [payments, setPayments] = useState<Payment[]>([]);
  const [invoices, setInvoices] = useState<Invoice[]>([]);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const [invoiceId, setInvoiceId] = useState("");
  const [amount, setAmount] = useState("");
  const [method, setMethod] = useState("cash");

  const fetchData = async () => {
    try {
      const token = localStorage.getItem("token");
      const headers = { Authorization: `Bearer ${token}` };

      const payRes = await fetch("https://dental-clinic-system-2.onrender.com/api/payments", { headers });
      const payData = await payRes.json();
      if (payData.payments) setPayments(payData.payments);

      const invRes = await fetch("https://dental-clinic-system-2.onrender.com/api/invoices", { headers });
      const invData = await invRes.json();
      if (invData.invoices) setInvoices(invData.invoices);

    } catch (err) {
      setError("Server connection error");
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleCreatePayment = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const token = localStorage.getItem("token");
      const res = await fetch("https://dental-clinic-system-2.onrender.com/api/payments", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          invoiceId,
          amount: Number(amount),
          method,
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.message || "Failed to process payment");
      }

      setIsModalOpen(false);
      fetchData();

      setInvoiceId("");
      setAmount("");
      setMethod("cash");
    } catch (error: any) {
      alert(error.message || error);
    } finally {
      setLoading(false);
    }
  };

  
return (
  <div className="min-h-screen w-full bg-[#f3f5f8] p-4 sm:p-6 md:p-8">
    <div className="flex flex-col sm:flex-row justify-between sm:items-center gap-4 mb-8">
      <h1 className="text-2xl md:text-3xl font-bold text-[#0f1b33] tracking-tight">
        Payments Management
      </h1>

      <button
        onClick={() => setIsModalOpen(true)}
        className="w-full sm:w-auto bg-[#0f1b33] text-white px-5 py-2.5 rounded-xl hover:bg-[#202d45] transition-all duration-200 text-sm font-semibold shadow-sm hover:shadow-md"
      >
        Add New Payment
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
              <th className="px-4 sm:px-5 py-4 whitespace-nowrap">INVOICE NO</th>
              <th className="px-4 sm:px-5 py-4 whitespace-nowrap">AMOUNT ($)</th>
              <th className="px-4 sm:px-5 py-4 whitespace-nowrap">METHOD</th>
              <th className="px-4 sm:px-5 py-4 whitespace-nowrap">DATE</th>
            </tr>
          </thead>

          <tbody>
            {payments.length > 0 ? (
              payments.map((p) => (
                <tr
                  key={p._id}
                  className="border-b border-slate-100 last:border-0 hover:bg-slate-50/80 text-sm text-slate-600 transition-colors duration-150"
                >
                  <td className="px-4 sm:px-5 py-4 font-semibold text-[#202d45] whitespace-nowrap">
                    {p.invoice?.invoiceNumber || "N/A"}
                  </td>

                  <td className="px-4 sm:px-5 py-4 font-bold text-emerald-700 whitespace-nowrap">
                    ${p.amount}
                  </td>

                  <td className="px-4 sm:px-5 py-4 uppercase text-xs font-bold text-[#0f1b33] whitespace-nowrap">
                    {p.method}
                  </td>

                  <td className="px-4 sm:px-5 py-4 whitespace-nowrap">
                    {new Date(p.createdAt).toLocaleDateString()}
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td
                  colSpan={4}
                  className="text-center px-5 py-10 text-slate-400 text-sm"
                >
                  No payments recorded yet.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>

    {isModalOpen && (
      <div className="fixed inset-0 bg-[#0f1b33]/50 backdrop-blur-sm flex items-center justify-center p-3 sm:p-4 z-50">
        <div className="bg-white rounded-2xl max-w-md w-full max-h-[90vh] overflow-y-auto p-5 sm:p-7 shadow-2xl border border-slate-100">
          <h2 className="text-xl font-bold mb-6 text-[#0f1b33]">
            Record New Payment
          </h2>

          <form onSubmit={handleCreatePayment} className="space-y-4">
            <div>
              <label className="block text-xs font-semibold text-slate-600 mb-2">
                Select Invoice
              </label>

              <select
                value={invoiceId}
                onChange={(e) => setInvoiceId(e.target.value)}
                required
                className="w-full border border-slate-200 rounded-xl px-4 py-3 text-base sm:text-sm text-[#202d45] bg-white outline-none transition-all duration-200 focus:border-[#0f1b33] focus:ring-2 focus:ring-[#0f1b33]/10"
              >
                <option value="">Select Invoice</option>
                {invoices.map((inv) => (
                  <option key={inv._id} value={inv._id}>
                    {inv.invoiceNumber} - (${inv.total})
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-600 mb-2">
                Amount ($)
              </label>

              <input
                type="number"
                placeholder="Enter paid amount"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                required
                className="w-full border border-slate-200 rounded-xl px-4 py-3 text-base sm:text-sm text-[#202d45] bg-white outline-none transition-all duration-200 focus:border-[#0f1b33] focus:ring-2 focus:ring-[#0f1b33]/10"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-600 mb-2">
                Payment Method
              </label>

              <select
                value={method}
                onChange={(e) => setMethod(e.target.value)}
                className="w-full border border-slate-200 rounded-xl px-4 py-3 text-base sm:text-sm text-[#202d45] bg-white outline-none transition-all duration-200 focus:border-[#0f1b33] focus:ring-2 focus:ring-[#0f1b33]/10"
              >
                <option value="cash">Cash</option>
                <option value="card">Card</option>
              </select>
            </div>

            <div className="flex flex-col-reverse sm:flex-row sm:justify-end gap-3 pt-4">
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
                {loading ? "Processing..." : "Save Payment"}
              </button>
            </div>
          </form>
        </div>
      </div>
    )}
  </div>
);

}