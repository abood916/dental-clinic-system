// app/patients/page.tsx
"use client";

import { useState, useEffect } from "react";

interface Patient {
  _id: string;
  fullName: string;
  phone: string;
  email: string;
  gender: string;
}

export default function PatientsPage() {
  const [patients, setPatients] = useState<Patient[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string>("");
  
  const [showModal, setShowModal] = useState<boolean>(false);
  const [fullName, setFullName] = useState<string>("");
  const [phone, setPhone] = useState<string>("");
  const [email, setEmail] = useState<string>("");
  const [gender, setGender] = useState<string>("male");

  useEffect(() => {
    const fetchPatients = async () => {
      try {
        const token = localStorage.getItem("token");
        console.log("Token sent:", token);         
        const res = await fetch("http://localhost:4000/api/patient", {
          headers: {
            "Authorization": `Bearer ${token}`
          }
        });
        const data = await res.json();
        
        if (res.ok) {
          setPatients(data.data);
        } else {
          setError(data.message || "Failed to fetch patients");
        }
      } catch (err) {
        setError("Server connection error");
      } finally {
        setLoading(false);
      }
    };

    fetchPatients();
  }, []);

  const handleCreatePatient = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem("token");
      const res = await fetch("http://localhost:4000/api/patient", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`
        },
        body: JSON.stringify({ fullName, phone, email, gender })
      });

      const data = await res.json();
      if (res.ok) {
        setShowModal(false);
        setFullName("");
        setPhone("");
        setEmail("");
        window.location.reload(); 
      } else {
        alert(data.message || "Error creating patient");
      }
    } catch (err) {
      alert("Server error");
    }
  };

  return (
  <div className="w-full min-h-screen bg-[#f3f5f8] p-4 sm:p-5 md:p-8 space-y-7">
    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-5">
      <div>
        <h1 className="text-2xl md:text-3xl font-bold text-[#0f1b33] tracking-tight">
          Patients Management
        </h1>
        <p className="text-sm text-slate-500 mt-2">
          Manage your clinic patients and their information.
        </p>
      </div>

      <button
        onClick={() => setShowModal(true)}
        className="w-full sm:w-auto bg-[#0f1b33] text-white px-6 py-3 rounded-xl text-sm font-semibold hover:bg-[#202d45] shadow-lg shadow-slate-900/10 transition-all duration-200"
      >
        + Add New Patient
      </button>
    </div>

    {error && (
      <div className="p-4 bg-red-50 border border-red-100 text-red-600 rounded-xl text-sm shadow-sm">
        {error}
      </div>
    )}

    <div className="bg-white border border-slate-200 rounded-2xl overflow-hidden shadow-sm">
      <div className="w-full overflow-x-auto">
        <table className="w-full min-w-[650px] text-left border-collapse">
          <thead>
            <tr className="bg-[#f8fafc] border-b border-slate-200 text-xs text-slate-500 uppercase tracking-wider">
              <th className="px-4 sm:px-6 py-5 font-semibold whitespace-nowrap">Full Name</th>
              <th className="px-4 sm:px-6 py-5 font-semibold whitespace-nowrap">Phone</th>
              <th className="px-4 sm:px-6 py-5 font-semibold whitespace-nowrap">Email</th>
              <th className="px-4 sm:px-6 py-5 font-semibold whitespace-nowrap">Gender</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100 text-sm text-slate-600">
            {loading ? (
              <tr>
                <td colSpan={4} className="p-6 text-center text-gray-400">Loading patients...</td>
              </tr>
            ) : patients.length === 0 ? (
              <tr>
                <td colSpan={4} className="p-6 text-center text-gray-400">No patients found.</td>
              </tr>
            ) : (
              patients.map((patient) => (
                <tr key={patient._id} className="hover:bg-slate-50 transition-colors duration-200">
                  <td className="px-4 sm:px-6 py-5 font-semibold text-[#0f1b33]">{patient.fullName}</td>
                  <td className="px-4 sm:px-6 py-5 whitespace-nowrap">{patient.phone}</td>
                  <td className="px-4 sm:px-6 py-5">{patient.email}</td>
                  <td className="px-4 sm:px-6 py-5 whitespace-nowrap">{patient.gender}</td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>

    {showModal && (
      <div className="fixed inset-0 z-50 bg-[#0f1b33]/50 backdrop-blur-sm flex items-center justify-center p-3 sm:p-4">
        <div className="bg-white rounded-2xl p-5 sm:p-7 w-full max-w-lg max-h-[90vh] overflow-y-auto space-y-5 shadow-2xl border border-slate-100">
          <h2 className="text-xl font-bold text-slate-800">Add New Patient</h2>
          <form onSubmit={handleCreatePatient} className="space-y-4">
            <div>
              <label className="block text-sm font-semibold text-slate-600 mb-2">Full Name</label>
              <input
                type="text"
                required
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                className="w-full border border-slate-200 bg-slate-50 rounded-xl px-4 py-3 text-base sm:text-sm text-slate-700 outline-none focus:bg-white focus:border-[#0f1b33] focus:ring-2 focus:ring-slate-200 transition-all duration-200"
              />
            </div>
            <div>
              <label className="block text-xs font-medium text-gray-600 mb-1">Phone</label>
              <input
                type="text"
                required
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                className="w-full border border-slate-200 bg-slate-50 rounded-xl px-4 py-3 text-base sm:text-sm text-slate-700 outline-none focus:bg-white focus:border-[#0f1b33] focus:ring-2 focus:ring-slate-200 transition-all duration-200"
              />
            </div>
            <div>
              <label className="block text-xs font-medium text-gray-600 mb-1">Email</label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full border border-slate-200 bg-slate-50 rounded-xl px-4 py-3 text-base sm:text-sm text-slate-700 outline-none focus:bg-white focus:border-[#0f1b33] focus:ring-2 focus:ring-slate-200 transition-all duration-200"
              />
            </div>
            <div>
              <label className="block text-xs font-medium text-gray-600 mb-1">Gender</label>
              <select
                value={gender}
                onChange={(e) => setGender(e.target.value)}
                className="w-full border border-slate-200 bg-slate-50 rounded-xl px-4 py-3 text-base sm:text-sm text-slate-700 outline-none focus:bg-white focus:border-[#0f1b33] focus:ring-2 focus:ring-slate-200 transition-all duration-200"
              >
                <option value="male">Male</option>
                <option value="female">Female</option>
              </select>
            </div>

            <div className="flex flex-col-reverse sm:flex-row sm:justify-end gap-2 pt-2">
              <button
                type="button"
                onClick={() => setShowModal(false)}
                className="w-full sm:w-auto px-5 py-2.5 rounded-xl text-sm font-semibold text-slate-600 hover:bg-slate-100 transition-all"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="w-full sm:w-auto px-6 py-2.5 rounded-xl text-sm font-semibold bg-[#0f1b33] text-white hover:bg-[#202d45] shadow-md transition-all duration-200"
              >
                Save
              </button>
            </div>
          </form>
        </div>
      </div>
    )}
  </div>
);
}