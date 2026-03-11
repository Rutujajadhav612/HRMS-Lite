import React, { useEffect, useState } from "react";
import { getDashboardSummary } from "../services/api";
import { Link } from "react-router-dom";

const DEPT_COLORS = ["#6366f1","#10b981","#f59e0b","#ef4444","#06b6d4","#8b5cf6","#ec4899"];

export default function Dashboard() {
  const [summary, setSummary] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    getDashboardSummary()
      .then(setSummary)
      .catch((e) => setError(e.message))
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <div className="loading-center"><div className="spinner" /><span>Loading dashboard…</span></div>;
  if (error) return <div className="card" style={{color:"var(--red)"}}>{error}</div>;

  const { total_employees, present_today, absent_today, total_attendance_records, employee_summary } = summary;

  const stats = [
    { label: "Total Employees", value: total_employees, sub: "Registered staff", color: "#6366f1" },
    { label: "Present Today", value: present_today, sub: "Marked present", color: "#10b981" },
    { label: "Absent Today", value: absent_today, sub: "Marked absent", color: "#ef4444" },
    { label: "Total Records", value: total_attendance_records, sub: "All time", color: "#f59e0b" },
  ];

  return (
    <div>
      <div className="stats-grid">
        {stats.map((s) => (
          <div className="stat-card" key={s.label} style={{ "--accent-color": s.color }}>
            <div className="stat-label">{s.label}</div>
            <div className="stat-value" style={{ color: s.color }}>{s.value}</div>
            <div className="stat-sub">{s.sub}</div>
          </div>
        ))}
      </div>

      <div className="card">
        <div className="section-header">
          <span className="section-title">Employee Summary — Attendance Overview</span>
          <Link to="/employees" className="btn btn-ghost btn-sm">View All</Link>
        </div>
        {employee_summary.length === 0 ? (
          <div className="empty-state">
            <div className="empty-icon">◈</div>
            <div className="empty-title">No employees yet</div>
            <div className="empty-sub">Add employees to see their summary here</div>
          </div>
        ) : (
          <div className="table-wrapper">
            <table>
              <thead>
                <tr>
                  <th>Employee ID</th>
                  <th>Full Name</th>
                  <th>Department</th>
                  <th>Days Present</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {employee_summary.map((emp, i) => (
                  <tr key={emp.employee_id}>
                    <td><span className="emp-id-tag">{emp.employee_id}</span></td>
                    <td style={{ fontWeight: 600 }}>{emp.full_name}</td>
                    <td><span className="dept-tag">{emp.department}</span></td>
                    <td>
                      <span style={{ fontFamily: "var(--mono)", color: DEPT_COLORS[i % DEPT_COLORS.length], fontWeight: 700 }}>
                        {emp.present_days}
                      </span>
                    </td>
                    <td>
                      <Link to={`/attendance?emp=${emp.employee_id}`} className="btn btn-ghost btn-sm">View Attendance</Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
