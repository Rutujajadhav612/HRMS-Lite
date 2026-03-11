import React, { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { getEmployees, createEmployee, deleteEmployee } from "../services/api";

const DEPARTMENTS = ["Engineering","Product","Design","Marketing","Sales","HR","Finance","Operations","Legal","Support"];

function AddEmployeeModal({ onClose, onAdded }) {
  const [form, setForm] = useState({ employee_id: "", full_name: "", email: "", department: "" });
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => setForm((f) => ({ ...f, [e.target.name]: e.target.value }));

  const handleSubmit = async () => {
    if (!form.employee_id || !form.full_name || !form.email || !form.department) {
      toast.error("All fields are required"); return;
    }
    setLoading(true);
    try {
      const emp = await createEmployee(form);
      toast.success(`Employee ${emp.full_name} added!`);
      onAdded(emp); onClose();
    } catch (e) { toast.error(e.message); }
    finally { setLoading(false); }
  };

  return (
    <div className="modal-overlay" onClick={(e) => e.target === e.currentTarget && onClose()}>
      <div className="modal">
        <div className="modal-header">
          <span className="modal-title">Add New Employee</span>
          <button className="btn btn-icon btn-ghost" onClick={onClose}>✕</button>
        </div>
        <div className="modal-body">
          {[
            { name: "employee_id", label: "Employee ID", placeholder: "e.g. EMP-001" },
            { name: "full_name", label: "Full Name", placeholder: "e.g. Ananya Sharma" },
            { name: "email", label: "Email Address", placeholder: "ananya@company.com", type: "email" },
          ].map((f) => (
            <div className="form-group" key={f.name}>
              <label className="form-label">{f.label}</label>
              <input className="form-input" name={f.name} type={f.type || "text"} placeholder={f.placeholder} value={form[f.name]} onChange={handleChange} />
            </div>
          ))}
          <div className="form-group">
            <label className="form-label">Department</label>
            <select className="form-select" name="department" value={form.department} onChange={handleChange}>
              <option value="">Select Department</option>
              {DEPARTMENTS.map((d) => <option key={d} value={d}>{d}</option>)}
            </select>
          </div>
        </div>
        <div className="modal-footer">
          <button className="btn btn-ghost" onClick={onClose}>Cancel</button>
          <button className="btn btn-primary" onClick={handleSubmit} disabled={loading}>
            {loading ? <><div className="spinner" style={{width:14,height:14}} />Adding…</> : "Add Employee"}
          </button>
        </div>
      </div>
    </div>
  );
}

export default function Employees() {
  const [employees, setEmployees] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [search, setSearch] = useState("");
  const [deleting, setDeleting] = useState(null);

  useEffect(() => {
    getEmployees()
      .then(setEmployees)
      .catch((e) => toast.error(e.message))
      .finally(() => setLoading(false));
  }, []);

  const handleDelete = async (empId) => {
    if (!window.confirm(`Delete employee ${empId}? This will also remove all their attendance records.`)) return;
    setDeleting(empId);
    try {
      await deleteEmployee(empId);
      setEmployees((prev) => prev.filter((e) => e.employee_id !== empId));
      toast.success("Employee deleted");
    } catch (e) { toast.error(e.message); }
    finally { setDeleting(null); }
  };

  const filtered = employees.filter((e) =>
    e.full_name.toLowerCase().includes(search.toLowerCase()) ||
    e.employee_id.toLowerCase().includes(search.toLowerCase()) ||
    e.department.toLowerCase().includes(search.toLowerCase()) ||
    e.email.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div>
      {showModal && <AddEmployeeModal onClose={() => setShowModal(false)} onAdded={(emp) => setEmployees((p) => [emp, ...p])} />}

      <div className="card">
        <div className="section-header" style={{ marginBottom: 20 }}>
          <div style={{ display: "flex", gap: 12, alignItems: "center", flex: 1, flexWrap: "wrap" }}>
            <span className="section-title">All Employees</span>
            <span style={{ fontSize: 12, color: "var(--text3)", fontFamily: "var(--mono)", background: "var(--surface2)", padding: "2px 8px", borderRadius: 4 }}>
              {employees.length} total
            </span>
          </div>
          <div style={{ display: "flex", gap: 10, flexWrap: "wrap" }}>
            <input className="form-input" style={{ width: 220 }} placeholder="Search employees…" value={search} onChange={(e) => setSearch(e.target.value)} />
            <button className="btn btn-primary" onClick={() => setShowModal(true)}>+ Add Employee</button>
          </div>
        </div>

        {loading ? (
          <div className="loading-center"><div className="spinner" /><span>Loading employees…</span></div>
        ) : filtered.length === 0 ? (
          <div className="empty-state">
            <div className="empty-icon">◈</div>
            <div className="empty-title">{search ? "No results found" : "No employees yet"}</div>
            <div className="empty-sub">{search ? "Try a different search term" : "Click + Add Employee to get started"}</div>
          </div>
        ) : (
          <div className="table-wrapper">
            <table>
              <thead>
                <tr>
                  <th>Employee ID</th>
                  <th>Full Name</th>
                  <th>Email</th>
                  <th>Department</th>
                  <th>Joined</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {filtered.map((emp) => (
                  <tr key={emp.id}>
                    <td><span className="emp-id-tag">{emp.employee_id}</span></td>
                    <td style={{ fontWeight: 600 }}>{emp.full_name}</td>
                    <td style={{ color: "var(--text2)", fontSize: 13 }}>{emp.email}</td>
                    <td><span className="dept-tag">{emp.department}</span></td>
                    <td style={{ fontSize: 12, color: "var(--text3)", fontFamily: "var(--mono)" }}>
                      {emp.created_at ? new Date(emp.created_at).toLocaleDateString("en-IN") : "—"}
                    </td>
                    <td>
                      <button className="btn btn-danger btn-sm" onClick={() => handleDelete(emp.employee_id)} disabled={deleting === emp.employee_id}>
                        {deleting === emp.employee_id ? <div className="spinner" style={{width:12,height:12}} /> : "Delete"}
                      </button>
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
