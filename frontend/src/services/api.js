import axios from "axios";

const BASE_URL = process.env.REACT_APP_API_URL || "http://localhost:8000";

const api = axios.create({
  baseURL: BASE_URL,
  headers: { "Content-Type": "application/json" },
});

api.interceptors.response.use(
  (res) => res,
  (err) => {
    const msg =
      err.response?.data?.detail ||
      err.response?.data?.message ||
      "Something went wrong";
    return Promise.reject(new Error(typeof msg === "string" ? msg : JSON.stringify(msg)));
  }
);

// ── Employees ────────────────────────────────────────────────────────────────
export const getEmployees = () => api.get("/employees").then((r) => r.data);
export const createEmployee = (data) => api.post("/employees", data).then((r) => r.data);
export const deleteEmployee = (id) => api.delete(`/employees/${id}`).then((r) => r.data);

// ── Attendance ────────────────────────────────────────────────────────────────
export const markAttendance = (data) => api.post("/attendance", data).then((r) => r.data);
export const getAttendance = (employeeId, from, to) => {
  const params = {};
  if (from) params.from_date = from;
  if (to) params.to_date = to;
  return api.get(`/attendance/${employeeId}`, { params }).then((r) => r.data);
};

// ── Dashboard ─────────────────────────────────────────────────────────────────
export const getDashboardSummary = () => api.get("/dashboard/summary").then((r) => r.data);
