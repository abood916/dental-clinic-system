"use client";

import { useState, useEffect } from "react";

interface InvoiceItem {
  description: string;
  price: number;
}

interface Invoice {
  _id: string;
  invoiceNumber: string;
  patient: { _id: string; fullName: string; phone: string };
  items: InvoiceItem[];
  total: number;
  createdAt: string;
}

interface Patient {
  _id: string;
  fullName: string;
}

export default function InvoicesPage() {
  const [invoices, setInvoices] = useState<Invoice[]>([]);
  const [patients, setPatients] = useState<Patient[]>([]);
  
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const [patient, setPatient] = useState("");
  const [invoiceNumber, setInvoiceNumber] = useState("");
  const [itemDesc, setItemDesc] = useState("");
  const [itemPrice, setItemPrice] = useState("");
  const [items, setItems] = useState<InvoiceItem[]>([]);

  const fetchData = async () => {
    try {
      const token = localStorage.getItem("token");
      const headers = { Authorization: `Bearer ${token}` };

      const invRes = await fetch("http://localhost:4000/api/invoices", { headers });
      const invData = await invRes.json();
      if (invData.invoices) setInvoices(invData.invoices);

      const patRes = await fetch("http://localhost:4000/api/patient", { headers });
      const patData = await patRes.json();
      if (patData.data) setPatients(patData.data);

    } catch (err) {
      setError("Server connection error");
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleAddItem = () => {
    if (!itemDesc || !itemPrice) return;
    setItems([...items, { description: itemDesc, price: Number(itemPrice) }]);
    setItemDesc("");
    setItemPrice("");
  };

  const handleCreateInvoice = async (e: React.FormEvent) => {
    e.preventDefault();
    if (items.length === 0) {
      alert("Please add at least one item to the invoice.");
      return;
    }

    setLoading(true);
    setError("");

    try {
      const token = localStorage.getItem("token");
      const res = await fetch("http://localhost:4000/api/invoices", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          patient,
          invoiceNumber,
          items,
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.message || "Failed to create invoice");
      }

      setIsModalOpen(false);
      fetchData();
      
      setPatient("");
      setInvoiceNumber("");
      setItems([]);
    } catch (error: any) {
      alert(error.message || error);
    } finally {
      setLoading(false);
    }
  };

  return (
  <div className="w-full min-h-screen bg-[#f3f5f8] p-4 sm:p-5 md:p-8 space-y-7">
    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-5">
      <h1 className="text-2xl md:text-3xl font-bold text-[#0f1b33] tracking-tight">
        Invoices Management
      </h1>
      <button
        onClick={() => setIsModalOpen(true)}
        className="w-full sm:w-auto bg-[#0f1b33] text-white px-6 py-3 rounded-xl text-sm font-semibold hover:bg-[#202d45] shadow-lg shadow-slate-900/10 transition-all duration-200"
      >
        Create New Invoice
      </button>
    </div>

    {error && <p className="text-red-500 mb-4">{error}</p>}

    <div className="bg-white border border-slate-200 rounded-2xl overflow-hidden shadow-sm">
      <div className="w-full overflow-x-auto">
        <table className="w-full min-w-[650px] text-left border-collapse">
          <thead>
            <tr className="bg-[#f8fafc] border-b border-slate-200 text-xs text-slate-500 uppercase tracking-wider">
              <th className="px-4 sm:px-6 py-5 font-semibold whitespace-nowrap">INVOICE NO</th>
              <th className="px-4 sm:px-6 py-5 font-semibold whitespace-nowrap">PATIENT</th>
              <th className="px-4 sm:px-6 py-5 font-semibold whitespace-nowrap">TOTAL ($)</th>
              <th className="px-4 sm:px-6 py-5 font-semibold whitespace-nowrap">DATE</th>
            </tr>
          </thead>
          <tbody>
            {invoices.length > 0 ? (
              invoices.map((inv) => (
                <tr key={inv._id} className="border-b hover:bg-gray-50 text-sm">
                  <td className="px-4 sm:px-6 py-5 font-medium whitespace-nowrap">{inv.invoiceNumber}</td>
                  <td className="px-4 sm:px-6 py-5">{inv.patient?.fullName || "N/A"}</td>
                  <td className="px-4 sm:px-6 py-5 font-semibold text-green-600 whitespace-nowrap">${inv.total}</td>
                  <td className="px-4 sm:px-6 py-5 whitespace-nowrap">{new Date(inv.createdAt).toLocaleDateString()}</td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={4} className="text-center p-6 text-gray-500">
                  No invoices found.
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
          <h2 className="text-xl font-bold text-slate-800">Create New Invoice</h2>
          <form onSubmit={handleCreateInvoice} className="space-y-4">
            <div>
              <label className="block text-xs font-medium text-gray-600 mb-1">Email</label>
              <select
                value={patient}
                onChange={(e) => setPatient(e.target.value)}
                required
                className="w-full border border-slate-200 bg-slate-50 rounded-xl px-4 py-3 text-base sm:text-sm text-slate-700 outline-none focus:bg-white focus:border-[#0f1b33] focus:ring-2 focus:ring-slate-200 transition-all duration-200"
              >
                <option value="">Select Patient</option>
                {patients.map((p) => (
                  <option key={p._id} value={p._id}>
                    {p.fullName}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-xs font-medium text-gray-600 mb-1">Email</label>
              <input
                type="text"
                placeholder="e.g. INV-1001"
                value={invoiceNumber}
                onChange={(e) => setInvoiceNumber(e.target.value)}
                required
                className="w-full border border-slate-200 bg-slate-50 rounded-xl px-4 py-3 text-base sm:text-sm text-slate-700 outline-none focus:bg-white focus:border-[#0f1b33] focus:ring-2 focus:ring-slate-200 transition-all duration-200"
              />
            </div>

            <div className="border p-3 rounded-lg bg-gray-50 space-y-3">
              <label className="block text-xs font-medium text-gray-600 mb-1">Email</label>
              <div className="flex flex-col sm:flex-row gap-2">
                <input
                  type="text"
                  placeholder="Service Description (e.g. Cleaning)"
                  value={itemDesc}
                  onChange={(e) => setItemDesc(e.target.value)}
                  className="w-full min-w-0 border border-slate-200 bg-slate-50 rounded-xl px-4 py-3 text-base sm:text-sm text-slate-700 outline-none focus:bg-white focus:border-[#0f1b33] focus:ring-2 focus:ring-slate-200 transition-all duration-200"
                />
                <input
                  type="number"
                  placeholder="Price"
                  value={itemPrice}
                  onChange={(e) => setItemPrice(e.target.value)}
                  className="w-full sm:w-28 min-w-0 border border-slate-200 bg-slate-50 rounded-xl px-4 py-3 text-base sm:text-sm text-slate-700 outline-none focus:bg-white focus:border-[#0f1b33] focus:ring-2 focus:ring-slate-200 transition-all duration-200"
                />
                <button
                  type="button"
                  onClick={handleAddItem}
                  className="w-full sm:w-auto bg-gray-800 text-white px-3 py-2 rounded-lg text-sm hover:bg-black"
                >
                  Add
                </button>
              </div>

              {items.length > 0 && (
                <ul className="text-xs space-y-1 mt-2">
                  {items.map((it, idx) => (
                    <li key={idx} className="flex justify-between gap-3 bg-white p-2 rounded border">
                      <span className="break-words min-w-0">{it.description}</span>
                      <span className="font-semibold whitespace-nowrap">${it.price}</span>
                    </li>
                  ))}
                </ul>
              )}
            </div>

            <div className="flex flex-col-reverse sm:flex-row sm:justify-end gap-3 pt-2">
              <button
                type="button"
                onClick={() => setIsModalOpen(false)}
                className="w-full sm:w-auto px-4 py-2 text-gray-600 hover:bg-gray-100 rounded-lg text-sm font-bold"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={loading}
                className="w-full sm:w-auto bg-blue-600 text-white px-4 py-2 rounded-lg text-sm hover:bg-blue-700 transition"
              >
                {loading ? "Saving..." : "Save Invoice"}
              </button>
            </div>
          </form>
        </div>
      </div>
    )}
  </div>
);
}