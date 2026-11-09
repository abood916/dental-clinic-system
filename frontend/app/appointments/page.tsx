"use client";

import { useState, useEffect } from "react";

interface Appointment {
  _id: string;
  patient: { _id: string; fullName: string; phone: string };
  appointmentDate: string;
  duration?: number;
  reason: string;
  status: string;
  notes?: string;
}

interface Patient {
  _id: string;
  fullName: string;
}

export default function AppointmentsPage() {
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [patients, setPatients] = useState<Patient[]>([]);
  
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  // Form states
  const [patientId, setPatientId] = useState("");
  const [doctorId, setDoctorId] = useState("");
  const [branchId, setBranchId] = useState("");
  const [appointmentDate, setAppointmentDate] = useState("");
  const [reason, setReason] = useState("");
  const [notes, setNotes] = useState("");

  // Fetch Appointments and Patients
  const fetchData = async () => {
    try {
      const token = localStorage.getItem("token");
      const headers = { Authorization: `Bearer ${token}` };

      // Fetch Appointments
      const appRes = await fetch("http://localhost:4000/api/appointments", { headers });
      const appData = await appRes.json();
      if (appData.data) setAppointments(appData.data);

      // Fetch Patients
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

  const handleCreateAppointment = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const token = localStorage.getItem("token");
      const res = await fetch("http://localhost:4000/api/appointments", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          patientId,
          doctorId: doctorId.trim() || patientId,
          branchId: branchId.trim() || patientId,
          appointmentDate,
          reason,
          notes,
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.message || "Failed to create appointment");
      }

      setIsModalOpen(false);
      fetchData();
      
      // Reset form
      setPatientId("");
      setDoctorId("");
      setBranchId("");
      setAppointmentDate("");
      setReason("");
      setNotes("");
    } catch (error: any) {
      alert(error.message || error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="w-full min-h-screen bg-slate-100 p-4 sm:p-5 md:p-8 space-y-6 md:space-y-7">
  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 sm:gap-5">
    <h1 className="text-2xl md:text-3xl font-bold text-[#0f1b33] tracking-tight">
      Appointments Management
    </h1>
    <button
      onClick={() => setIsModalOpen(true)}
      className="w-full sm:w-auto bg-slate-800 text-white px-6 py-3 rounded-xl text-sm font-semibold hover:bg-[#202d45] shadow-lg shadow-slate-900/10 transition-all duration-200"
    >
      Add New Appointment
    </button>
  </div>

  {error && <p className="text-red-500 mb-4">{error}</p>}

  {/* Appointments Table */}
  <div className="bg-white border border-slate-200 rounded-2xl overflow-hidden shadow-sm">
    <div className="w-full overflow-x-auto">
      <table className="w-full min-w-[700px] text-left border-collapse">
        <thead>
          <tr className="bg-[#f8fafc] border-b border-slate-200 text-xs text-slate-500 uppercase tracking-wider">
            <th className="px-4 md:px-6 py-4 md:py-5 font-semibold whitespace-nowrap">PATIENT</th>
            <th className="px-4 md:px-6 py-4 md:py-5 font-semibold whitespace-nowrap">DATE & TIME</th>
            <th className="px-4 md:px-6 py-4 md:py-5 font-semibold whitespace-nowrap">REASON</th>
            <th className="px-4 md:px-6 py-4 md:py-5 font-semibold whitespace-nowrap">STATUS</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-slate-100 text-sm text-slate-600">
          {appointments.length > 0 ? (
            appointments.map((app) => (
              <tr key={app._id} className="border-b hover:bg-gray-50 text-sm">
                <td className="px-4 md:px-6 py-4 md:py-5 font-semibold text-[#0f1b33] whitespace-nowrap">{app.patient?.fullName || "N/A"}</td>
                <td className="px-4 md:px-6 py-4 md:py-5 whitespace-nowrap">{new Date(app.appointmentDate).toLocaleString()}</td>
                <td className="px-4 md:px-6 py-4 md:py-5">{app.reason}</td>
                <td className="px-4 md:px-6 py-4 md:py-5">
                  <span
                    className={`px-2 py-1 rounded-full text-xs font-semibold ${
                      app.status === "confirmed"
                        ? "bg-green-100 text-green-700"
                        : app.status === "cancelled"
                        ? "bg-red-100 text-red-700"
                        : "bg-yellow-100 text-yellow-700"
                    }`}
                  >
                    {app.status}
                  </span>
                </td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan={4} className="text-center p-6 text-gray-500">
                No appointments found.
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  </div>

  {/* Modal Add Appointment */}
  {isModalOpen && (
    <div className="fixed inset-0 z-50 bg-[#0f1b33]/50 backdrop-blur-sm flex items-center justify-center p-3 sm:p-4">
      <div className="bg-white rounded-2xl p-5 sm:p-7 w-full max-w-lg max-h-[90vh] overflow-y-auto space-y-5 shadow-2xl border border-slate-100">
        <h2 className="text-xl font-bold text-slate-800">Add New Appointment</h2>
        <form onSubmit={handleCreateAppointment} className="space-y-4">
          <div>
            <label className="block text-sm font-semibold text-slate-600 mb-2">Patient</label>
            <select
              value={patientId}
              onChange={(e) => setPatientId(e.target.value)}
              required
              className="w-full border border-slate-200 bg-slate-50 rounded-xl px-4 py-3 text-base sm:text-sm text-slate-700 outline-none focus:bg-white focus:border-slate-100 focus:ring-2 focus:ring-slate-200 transition-all duration-200"
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
            <label className="block text-xs font-medium text-gray-600 mb-1">Doctor ID / Name (Optional)</label>
            <input
              type="text"
              placeholder="Enter Doctor Name or ID"
              value={doctorId}
              onChange={(e) => setDoctorId(e.target.value)}
              className="w-full border border-slate-200 bg-slate-50 rounded-xl px-4 py-3 text-base sm:text-sm text-slate-700 outline-none focus:bg-white focus:border-[#0f1b33] focus:ring-2 focus:ring-slate-200 transition-all duration-200"
            />
          </div>

          <div>
            <label className="block text-xs font-medium text-gray-600 mb-1">Branch ID / Name (Optional)</label>
            <input
              type="text"
              placeholder="Enter Branch Name or ID"
              value={branchId}
              onChange={(e) => setBranchId(e.target.value)}
              className="w-full border border-slate-200 bg-slate-50 rounded-xl px-4 py-3 text-base sm:text-sm text-slate-700 outline-none focus:bg-white focus:border-[#0f1b33] focus:ring-2 focus:ring-slate-200 transition-all duration-200"
            />
          </div>

          <div>
            <label className="block text-xs font-medium text-gray-600 mb-1">Appointment Date & Time</label>
            <input
              type="datetime-local"
              value={appointmentDate}
              onChange={(e) => setAppointmentDate(e.target.value)}
              required
              className="w-full border border-slate-200 bg-slate-50 rounded-xl px-4 py-3 text-base sm:text-sm text-slate-700 outline-none focus:bg-white focus:border-[#0f1b33] focus:ring-2 focus:ring-slate-200 transition-all duration-200"
            />
          </div>

          <div>
            <label className="block text-xs font-medium text-gray-600 mb-1">Reason</label>
            <input
              type="text"
              placeholder="e.g. Toothache / Checkup"
              value={reason}
              onChange={(e) => setReason(e.target.value)}
              required
              className="w-full border border-slate-200 bg-slate-50 rounded-xl px-4 py-3 text-base sm:text-sm text-slate-700 outline-none focus:bg-white focus:border-[#0f1b33] focus:ring-2 focus:ring-slate-200 transition-all duration-200"
            />
          </div>

          <div>
            <label className="block text-xs font-medium text-gray-600 mb-1">Notes (Optional)</label>
            <textarea
              placeholder="Any additional notes..."
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              className="w-full border border-slate-200 bg-slate-50 rounded-xl px-4 py-3 text-base sm:text-sm text-slate-700 outline-none focus:bg-white focus:border-[#0f1b33] focus:ring-2 focus:ring-slate-200 transition-all duration-200"
            />
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
              className="w-full sm:w-auto px-6 py-2.5 rounded-xl text-sm font-semibold bg-[#0f1b33] text-white hover:bg-[#202d45] shadow-md transition-all duration-200"
            >
              {loading ? "Saving..." : "Save Appointment"}
            </button>
          </div>
        </form>
      </div>
    </div>
  )}
</div>
  );
}