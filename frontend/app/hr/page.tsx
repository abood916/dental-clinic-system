"use client";

import { useState, useEffect } from "react";

interface Employee {
  _id: string;
  fullName: string;
  phone: string;
  jobTitle: string;
  salary: number;
}

interface Attendance {
  _id: string;
  employee: { _id: string; fullName: string; jobTitle: string };
  checkIn?: string;
  status: string;
}

interface Leave {
  _id: string;
  employee: { _id: string; fullName: string; jobTitle: string };
  startDate: string;
  endDate: string;
  reason: string;
  status: string;
}

interface Payroll {
  _id: string;
  employee: { _id: string; fullName: string; jobTitle: string };
  month: number;
  year: number;
  basicSalary: number;
  netSalary: number;
}

export default function HRPage() {
  const [activeTab, setActiveTab] = useState<"employees" | "attendance" | "leaves" | "payroll">("employees");

  const [employees, setEmployees] = useState<Employee[]>([]);
  const [attendance, setAttendance] = useState<Attendance[]>([]);
  const [leaves, setLeaves] = useState<Leave[]>([]);
  const [payrolls, setPayrolls] = useState<Payroll[]>([]);

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const [isModalOpen, setIsModalOpen] = useState(false);
  
  const [fullName, setFullName] = useState("");
  const [phone, setPhone] = useState("");
  const [jobTitle, setJobTitle] = useState("");
  const [salary, setSalary] = useState("");

  const [empId, setEmpId] = useState("");
  const [status, setStatus] = useState("present");

  const fetchData = async () => {
    try {
      const token = localStorage.getItem("token");
      const headers = { Authorization: `Bearer ${token}` };

      const [empRes, attRes, leaveRes, payRes] = await Promise.all([
        fetch("https://dental-clinic-system-2.onrender.com/api/hr/employees", { headers }),
        fetch("https://dental-clinic-system-2.onrender.com/api/hr/attendance", { headers }),
        fetch("https://dental-clinic-system-2.onrender.com/api/hr/leaves", { headers }),
        fetch("https://dental-clinic-system-2.onrender.com/api/hr/payroll", { headers }),
      ]);

      const empData = await empRes.json();
      const attData = await attRes.json();
      const leaveData = await leaveRes.json();
      const payData = await payRes.json();

      if (empData.employees) setEmployees(empData.employees);
      if (attData.attendance) setAttendance(attData.attendance);
      if (leaveData.leaves) setLeaves(leaveData.leaves);
      if (payData.payrolls) setPayrolls(payData.payrolls);

    } catch (err) {
      setError("Server connection error");
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleCreateEmployee = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      const token = localStorage.getItem("token");
      const res = await fetch("https://dental-clinic-system-2.onrender.com/api/hr/employees", {
        method: "POST",
        headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
        body: JSON.stringify({ fullName, phone, jobTitle, salary: Number(salary) }),
      });

      if (!res.ok) throw new Error("Failed to create employee");

      setIsModalOpen(false);
      fetchData();
      setFullName(""); setPhone(""); setJobTitle(""); setSalary("");
    } catch (err: any) {
      alert(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleCreateAttendance = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      const token = localStorage.getItem("token");
      const res = await fetch("https://dental-clinic-system-2.onrender.com/api/hr/attendance", {
        method: "POST",
        headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
        body: JSON.stringify({ employee: empId, status, checkIn: new Date() }),
      });

      if (!res.ok) throw new Error("Failed to record attendance");

      setIsModalOpen(false);
      fetchData();
      setEmpId("");
    } catch (err: any) {
      alert(err.message);
    } finally {
      setLoading(false);
    }
  };

 return (
  <div className="min-h-screen w-full bg-[#f3f5f8] p-4 sm:p-6 md:p-8">
    <div className="flex flex-col sm:flex-row justify-between sm:items-center gap-4 mb-6 sm:mb-8">
      <h1 className="text-2xl md:text-3xl font-bold text-[#0f1b33] tracking-tight">
        HR Management
      </h1>

      <button
        onClick={() => setIsModalOpen(true)}
        className="w-full sm:w-auto bg-[#0f1b33] text-white px-5 py-2.5 rounded-xl hover:bg-[#202d45] transition-all duration-200 text-sm font-semibold shadow-sm hover:shadow-md"
      >
        Add New / Record
      </button>
    </div>

    {error && (
      <p className="text-red-600 bg-red-50 border border-red-100 rounded-xl px-4 py-3 mb-5 text-sm">
        {error}
      </p>
    )}

    <div className="flex flex-wrap gap-2 border-b border-slate-200 mb-6 pb-4">
      <button
        onClick={() => setActiveTab("employees")}
        className={`px-4 sm:px-5 py-2.5 rounded-xl text-sm font-semibold transition-all duration-200 ${activeTab === "employees" ? "bg-[#0f1b33] text-white shadow-sm" : "bg-white text-slate-600 border border-slate-200 hover:bg-slate-50 hover:text-[#0f1b33]"}`}
      >
        Employees ({employees.length})
      </button>

      <button
        onClick={() => setActiveTab("attendance")}
        className={`px-4 sm:px-5 py-2.5 rounded-xl text-sm font-semibold transition-all duration-200 ${activeTab === "attendance" ? "bg-[#0f1b33] text-white shadow-sm" : "bg-white text-slate-600 border border-slate-200 hover:bg-slate-50 hover:text-[#0f1b33]"}`}
      >
        Attendance
      </button>

      <button
        onClick={() => setActiveTab("leaves")}
        className={`px-4 sm:px-5 py-2.5 rounded-xl text-sm font-semibold transition-all duration-200 ${activeTab === "leaves" ? "bg-[#0f1b33] text-white shadow-sm" : "bg-white text-slate-600 border border-slate-200 hover:bg-slate-50 hover:text-[#0f1b33]"}`}
      >
        Leaves
      </button>

      <button
        onClick={() => setActiveTab("payroll")}
        className={`px-4 sm:px-5 py-2.5 rounded-xl text-sm font-semibold transition-all duration-200 ${activeTab === "payroll" ? "bg-[#0f1b33] text-white shadow-sm" : "bg-white text-slate-600 border border-slate-200 hover:bg-slate-50 hover:text-[#0f1b33]"}`}
      >
        Payroll
      </button>
    </div>

    {activeTab === "employees" && (
      <div className="bg-white shadow-sm border border-slate-200/80 rounded-2xl overflow-hidden">
        <div className="w-full overflow-x-auto">
          <table className="w-full min-w-[650px] text-left border-collapse">
            <thead>
              <tr className="bg-slate-50/90 border-b border-slate-200 text-slate-500 text-xs font-bold tracking-wider">
                <th className="px-4 sm:px-5 py-4 whitespace-nowrap">NAME</th>
                <th className="px-4 sm:px-5 py-4 whitespace-nowrap">JOB TITLE</th>
                <th className="px-4 sm:px-5 py-4 whitespace-nowrap">PHONE</th>
                <th className="px-4 sm:px-5 py-4 whitespace-nowrap">SALARY ($)</th>
              </tr>
            </thead>

            <tbody>
              {employees.length > 0 ? (
                employees.map((emp) => (
                  <tr
                    key={emp._id}
                    className="border-b border-slate-100 last:border-0 hover:bg-slate-50/80 text-sm text-slate-600 transition-colors duration-150"
                  >
                    <td className="px-4 sm:px-5 py-4 font-semibold text-[#202d45]">
                      {emp.fullName}
                    </td>
                    <td className="px-4 sm:px-5 py-4">{emp.jobTitle}</td>
                    <td className="px-4 sm:px-5 py-4">{emp.phone}</td>
                    <td className="px-4 sm:px-5 py-4 font-bold text-emerald-700">
                      ${emp.salary}
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={4} className="text-center px-5 py-10 text-slate-400 text-sm">
                    No employees found.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    )}

    {activeTab === "attendance" && (
      <div className="bg-white shadow-sm border border-slate-200/80 rounded-2xl overflow-hidden">
        <div className="w-full overflow-x-auto">
          <table className="w-full min-w-[650px] text-left border-collapse">
            <thead>
              <tr className="bg-slate-50/90 border-b border-slate-200 text-slate-500 text-xs font-bold tracking-wider">
                <th className="px-4 sm:px-5 py-4 whitespace-nowrap">EMPLOYEE</th>
                <th className="px-4 sm:px-5 py-4 whitespace-nowrap">JOB TITLE</th>
                <th className="px-4 sm:px-5 py-4 whitespace-nowrap">STATUS</th>
                <th className="px-4 sm:px-5 py-4 whitespace-nowrap">CHECK-IN</th>
              </tr>
            </thead>

            <tbody>
              {attendance.length > 0 ? (
                attendance.map((att) => (
                  <tr
                    key={att._id}
                    className="border-b border-slate-100 last:border-0 hover:bg-slate-50/80 text-sm text-slate-600 transition-colors duration-150"
                  >
                    <td className="px-4 sm:px-5 py-4 font-semibold text-[#202d45]">
                      {att.employee?.fullName || "N/A"}
                    </td>
                    <td className="px-4 sm:px-5 py-4">
                      {att.employee?.jobTitle || "N/A"}
                    </td>
                    <td className="px-4 sm:px-5 py-4 uppercase text-xs font-bold text-[#0f1b33]">
                      {att.status}
                    </td>
                    <td className="px-4 sm:px-5 py-4 whitespace-nowrap">
                      {att.checkIn ? new Date(att.checkIn).toLocaleString() : "N/A"}
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={4} className="text-center px-5 py-10 text-slate-400 text-sm">
                    No attendance records.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    )}

    {activeTab === "leaves" && (
      <div className="bg-white shadow-sm border border-slate-200/80 rounded-2xl overflow-hidden">
        <div className="w-full overflow-x-auto">
          <table className="w-full min-w-[650px] text-left border-collapse">
            <thead>
              <tr className="bg-slate-50/90 border-b border-slate-200 text-slate-500 text-xs font-bold tracking-wider">
                <th className="px-4 sm:px-5 py-4 whitespace-nowrap">EMPLOYEE</th>
                <th className="px-4 sm:px-5 py-4 whitespace-nowrap">REASON</th>
                <th className="px-4 sm:px-5 py-4 whitespace-nowrap">FROM - TO</th>
                <th className="px-4 sm:px-5 py-4 whitespace-nowrap">STATUS</th>
              </tr>
            </thead>

            <tbody>
              {leaves.length > 0 ? (
                leaves.map((l) => (
                  <tr
                    key={l._id}
                    className="border-b border-slate-100 last:border-0 hover:bg-slate-50/80 text-sm text-slate-600 transition-colors duration-150"
                  >
                    <td className="px-4 sm:px-5 py-4 font-semibold text-[#202d45]">
                      {l.employee?.fullName || "N/A"}
                    </td>
                    <td className="px-4 sm:px-5 py-4">{l.reason}</td>
                    <td className="px-4 sm:px-5 py-4 whitespace-nowrap">
                      {new Date(l.startDate).toLocaleDateString()} to {new Date(l.endDate).toLocaleDateString()}
                    </td>
                    <td className="px-4 sm:px-5 py-4 uppercase text-xs font-bold text-amber-600">
                      {l.status}
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={4} className="text-center px-5 py-10 text-slate-400 text-sm">
                    No leave requests.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    )}

    {activeTab === "payroll" && (
      <div className="bg-white shadow-sm border border-slate-200/80 rounded-2xl overflow-hidden">
        <div className="w-full overflow-x-auto">
          <table className="w-full min-w-[650px] text-left border-collapse">
            <thead>
              <tr className="bg-slate-50/90 border-b border-slate-200 text-slate-500 text-xs font-bold tracking-wider">
                <th className="px-4 sm:px-5 py-4 whitespace-nowrap">EMPLOYEE</th>
                <th className="px-4 sm:px-5 py-4 whitespace-nowrap">PERIOD</th>
                <th className="px-4 sm:px-5 py-4 whitespace-nowrap">BASIC ($)</th>
                <th className="px-4 sm:px-5 py-4 whitespace-nowrap">NET SALARY ($)</th>
              </tr>
            </thead>

            <tbody>
              {payrolls.length > 0 ? (
                payrolls.map((p) => (
                  <tr
                    key={p._id}
                    className="border-b border-slate-100 last:border-0 hover:bg-slate-50/80 text-sm text-slate-600 transition-colors duration-150"
                  >
                    <td className="px-4 sm:px-5 py-4 font-semibold text-[#202d45]">
                      {p.employee?.fullName || "N/A"}
                    </td>
                    <td className="px-4 sm:px-5 py-4 whitespace-nowrap">
                      {p.month} / {p.year}
                    </td>
                    <td className="px-4 sm:px-5 py-4">${p.basicSalary}</td>
                    <td className="px-4 sm:px-5 py-4 font-bold text-emerald-700">
                      ${p.netSalary}
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={4} className="text-center px-5 py-10 text-slate-400 text-sm">
                    No payroll records.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    )}

    {isModalOpen && (
      <div className="fixed inset-0 bg-[#0f1b33]/50 backdrop-blur-sm flex items-center justify-center p-3 sm:p-4 z-50">
        <div className="bg-white rounded-2xl max-w-md w-full p-5 sm:p-7 max-h-[90vh] overflow-y-auto shadow-2xl border border-slate-100">
          <h2 className="text-xl font-bold mb-6 text-[#0f1b33]">
            {activeTab === "employees" ? "Add New Employee" : "Record Attendance"}
          </h2>

          {activeTab === "employees" ? (
            <form onSubmit={handleCreateEmployee} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-600 mb-2">
                  Full Name
                </label>
                <input
                  type="text"
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  required
                  className="w-full border border-slate-200 rounded-xl px-4 py-3 text-base sm:text-sm text-[#202d45] bg-white outline-none transition-all duration-200 focus:border-[#0f1b33] focus:ring-2 focus:ring-[#0f1b33]/10"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-600 mb-2">
                  Job Title
                </label>
                <input
                  type="text"
                  value={jobTitle}
                  onChange={(e) => setJobTitle(e.target.value)}
                  required
                  className="w-full border border-slate-200 rounded-xl px-4 py-3 text-base sm:text-sm text-[#202d45] bg-white outline-none transition-all duration-200 focus:border-[#0f1b33] focus:ring-2 focus:ring-[#0f1b33]/10"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-600 mb-2">
                  Phone
                </label>
                <input
                  type="text"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  required
                  className="w-full border border-slate-200 rounded-xl px-4 py-3 text-base sm:text-sm text-[#202d45] bg-white outline-none transition-all duration-200 focus:border-[#0f1b33] focus:ring-2 focus:ring-[#0f1b33]/10"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-600 mb-2">
                  Salary ($)
                </label>
                <input
                  type="number"
                  value={salary}
                  onChange={(e) => setSalary(e.target.value)}
                  required
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
                  Save
                </button>
              </div>
            </form>
          ) : (
            <form onSubmit={handleCreateAttendance} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-600 mb-2">
                  Select Employee
                </label>
                <select
                  value={empId}
                  onChange={(e) => setEmpId(e.target.value)}
                  required
                  className="w-full border border-slate-200 rounded-xl px-4 py-3 text-base sm:text-sm text-[#202d45] bg-white outline-none transition-all duration-200 focus:border-[#0f1b33] focus:ring-2 focus:ring-[#0f1b33]/10"
                >
                  <option value="">Select Employee</option>
                  {employees.map((emp) => (
                    <option key={emp._id} value={emp._id}>
                      {emp.fullName}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-600 mb-2">
                  Status
                </label>
                <select
                  value={status}
                  onChange={(e) => setStatus(e.target.value)}
                  className="w-full border border-slate-200 rounded-xl px-4 py-3 text-base sm:text-sm text-[#202d45] bg-white outline-none transition-all duration-200 focus:border-[#0f1b33] focus:ring-2 focus:ring-[#0f1b33]/10"
                >
                  <option value="present">Present</option>
                  <option value="absent">Absent</option>
                  <option value="late">Late</option>
                </select>
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
                  Save
                </button>
              </div>
            </form>
          )}
        </div>
      </div>
    )}
  </div>
);
}