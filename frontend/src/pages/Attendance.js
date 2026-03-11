import React, { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { useSearchParams } from "react-router-dom";
import { getEmployees, markAttendance, getAttendance } from "../services/api";

export default function Attendance() {
  const [searchParams] = useSearchParams();
  const [employees, setEmployees] = useState([]);
  const [selectedEmp, setSelectedEmp] = useState(searchParams.get("emp") || "");
  const [records, setRecords] = useState([]);
  const [loadingEmps, setLoadingEmps] = useState(true);
  const [loadingRecords, setLoadingRecords] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  // Mark form
  const [markForm, setMarkForm] = useState({ employee_id: "", date: new Date().toISOString().split("T")[0], status: "Present" });

  // Filter
  const [fromDate, setFromDate] = useState("");
  const [toDate, setToDate] = useState("");

  useEffect(() => {
    getEmployees()
      .then(setEmployees)
      .catch((e) => toast.error(e.message))
      .finally(() => setLoadingEmps(false));
  }, []);

  // Fetch records when selectedEmp changes
  useEffect(() => {
    if (!selectedEmp) { setRecords([]); return; }
    fetchRecords(selectedEmp, fromDate, toDate);
  }, [selectedEmp]); // eslint-disable-line

  const fetchRecords = async (empId, from, to) => {
    setLoadingRecords(true);
    try {
      const data = await getAttendance(empId, from || null, to || null);
      setRecords(data);
    } catch (e) { toast.error(e.message); }
    finally { setLoadingRecords(false); }
  };

  const handleMark = async () => {
    if (!markForm.employee_id || !markForm.date) { toast.error("Select employee and date"); return; }
    setSubmitting(true);
    try {
      await markAttendance({ employee_id: markForm.employee_id, date: markForm.date, status: markForm.status });
      toast.success(`Attendance marked: ${markForm.status}`);
      if (selectedEmp === markForm.employee_id) fetchRecords(selectedEmp, fromDate, toDate);
    } catch (e) { toast.error(e.message); }
    finally { setSubmitting(false); }
  };

  const handleFilter = () => {
    if (!selectedEmp) { toast.error("Select an employee first"); return; }
    fetchRecords(selectedEmp, fromDate, toDate);
  };

  const presentCount = records.filter((r) => r.status === "Present").length;
  const absentCount = records.filter((r) => r.status === "Absent").length;

  const selectedEmpInfo = employees.find((e) => e.employee_id === selectedEmp);

  return (
    <div style={{ display: "grid", gap: 24 }}>

      {/* Mark Attendance Card */}
      <div className="card">
        <div className="section-header" style={{ marginBottom: 20 }}>
          <span className="section-title">Mark Attendance</span>
        </div>
        <div style={{ display: "flex", gap: 14, flexWrap: "wrap", alignItems: "flex-end" }}>
          <div className="form-group" style={{ flex: "1 1 200px" }}>
            <label className="form-label">Employee</label>
            <select className="form-select" value={markForm.employee_id} onChange={(e) => setMarkForm((f) => ({ ...f, employee_id: e.target.value }))}>
              <option value="">Select Employee</option>
              {employees.map((emp) => (
                <option key={emp.employee_id} value={emp.employee_id}>{emp.full_name} ({emp.employee_id})</option>
              ))}
            </select>
          </div>
          <div className="form-group" style={{ flex: "0 1 180px" }}>
            <label className="form-label">Date</label>
            <input className="form-input" type="date" value={markForm.date} onChange={(e) => setMarkForm((f) => ({ ...f, date: e.target.value }))} max={new Date().toISOString().split("T")[0]} />
          </div>
          <div className="form-group" style={{ flex: "0 1 160px" }}>
            <label className="form-label">Status</label>
            <select className="form-select" value={markForm.status} onChange={(e) => setMarkForm((f) => ({ ...f, status: e.target.value }))}>
              <option value="Present">Present</option>
              <option value="Absent">Absent</option>
            </select>
          </div>
          <button className="btn btn-primary" onClick={handleMark} disabled={submitting} style={{ marginBottom: 1 }}>
            {submitting ? <><div className="spinner" style={{width:14,height:14}} />Saving…</> : "Mark Attendance"}
          </button>
        </div>
      </div>

      {/* View Records Card */}
      <div className="card">
        <div className="section-header" style={{ marginBottom: 20 }}>
          <div>
            <span className="section-title">Attendance Records</span>
            {selectedEmpInfo && (
              <span style={{ marginLeft: 10, fontSize: 13, color: "var(--text2)" }}>
                — {selectedEmpInfo.full_name}
              </span>
            )}
          </div>
          {records.length > 0 && (
            <div style={{ display: "flex", gap: 10, fontSize: 13 }}>
              <span style={{ color: "var(--green)", fontFamily: "var(--mono)", fontWeight: 700 }}>✓ {presentCount} Present</span>
              <span style={{ color: "var(--red)", fontFamily: "var(--mono)", fontWeight: 700 }}>✗ {absentCount} Absent</span>
            </div>
          )}
        </div>

        {/* Filters */}
        <div className="filters-row">
          <select className="form-select" value={selectedEmp} onChange={(e) => setSelectedEmp(e.target.value)} style={{ minWidth: 220 }}>
            <option value="">Select Employee to View</option>
            {employees.map((emp) => (
              <option key={emp.employee_id} value={emp.employee_id}>{emp.full_name} ({emp.employee_id})</option>
            ))}
          </select>
          <input className="form-input" type="date" placeholder="From" value={fromDate} onChange={(e) => setFromDate(e.target.value)} />
          <input className="form-input" type="date" placeholder="To" value={toDate} onChange={(e) => setToDate(e.target.value)} />
          <button className="btn btn-ghost" onClick={handleFilter}>Apply Filter</button>
          {(fromDate || toDate) && (
            <button className="btn btn-ghost" onClick={() => { setFromDate(""); setToDate(""); if (selectedEmp) fetchRecords(selectedEmp, "", ""); }}>
              Clear
            </button>
          )}
        </div>

        {!selectedEmp ? (
          <div className="empty-state">
            <div className="empty-icon">◉</div>
            <div className="empty-title">No employee selected</div>
            <div className="empty-sub">Select an employee above to view their attendance records</div>
          </div>
        ) : loadingRecords ? (
          <div className="loading-center"><div className="spinner" /><span>Loading records…</span></div>
        ) : records.length === 0 ? (
          <div className="empty-state">
            <div className="empty-icon">◉</div>
            <div className="empty-title">No attendance records</div>
            <div className="empty-sub">No attendance has been marked for this employee yet</div>
          </div>
        ) : (
          <div className="table-wrapper">
            <table>
              <thead>
                <tr>
                  <th>#</th>
                  <th>Date</th>
                  <th>Day</th>
                  <th>Status</th>
                </tr>
              </thead>
              <tbody>
                {records.map((rec, i) => {
                  const d = new Date(rec.date + "T00:00:00");
                  return (
                    <tr key={rec.id}>
                      <td style={{ color: "var(--text3)", fontFamily: "var(--mono)", fontSize: 12 }}>{String(i + 1).padStart(2, "0")}</td>
                      <td style={{ fontFamily: "var(--mono)", fontSize: 13 }}>{d.toLocaleDateString("en-IN", { day: "2-digit", month: "short", year: "numeric" })}</td>
                      <td style={{ color: "var(--text2)", fontSize: 13 }}>{d.toLocaleDateString("en-IN", { weekday: "long" })}</td>
                      <td>
                        <span className={`badge ${rec.status === "Present" ? "badge-present" : "badge-absent"}`}>
                          <span className="badge-dot" />
                          {rec.status}
                        </span>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
