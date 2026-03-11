import React from "react";
import { BrowserRouter, Routes, Route, NavLink, useLocation } from "react-router-dom";
import { Toaster } from "react-hot-toast";
import Dashboard from "./pages/Dashboard";
import Employees from "./pages/Employees";
import Attendance from "./pages/Attendance";
import "./index.css";

const NAV_ITEMS = [
  { path: "/", label: "Dashboard", icon: "⬡" },
  { path: "/employees", label: "Employees", icon: "◈" },
  { path: "/attendance", label: "Attendance", icon: "◉" },
];

function Sidebar() {
  const location = useLocation();
  return (
    <aside className="sidebar">
      <div className="sidebar-brand">
        <span className="brand-icon">H</span>
        <div>
          <div className="brand-title">HRMS Lite</div>
          <div className="brand-sub">Admin Portal</div>
        </div>
      </div>
      <nav className="sidebar-nav">
        {NAV_ITEMS.map((item) => (
          <NavLink
            key={item.path}
            to={item.path}
            end={item.path === "/"}
            className={({ isActive }) => `nav-item ${isActive ? "active" : ""}`}
          >
            <span className="nav-icon">{item.icon}</span>
            <span>{item.label}</span>
          </NavLink>
        ))}
      </nav>
      <div className="sidebar-footer">
        <div className="admin-badge">
          <span className="admin-dot" />
          <span>Admin User</span>
        </div>
      </div>
    </aside>
  );
}

function Layout({ children }) {
  const location = useLocation();
  const titles = { "/": "Dashboard", "/employees": "Employee Management", "/attendance": "Attendance Tracker" };
  return (
    <div className="layout">
      <Sidebar />
      <main className="main-content">
        <header className="topbar">
          <h1 className="page-title">{titles[location.pathname] || "HRMS Lite"}</h1>
          <div className="topbar-right">
            <span className="today-badge">{new Date().toLocaleDateString("en-IN", { weekday: "short", day: "numeric", month: "short", year: "numeric" })}</span>
          </div>
        </header>
        <div className="page-body">{children}</div>
      </main>
    </div>
  );
}

export default function App() {
  return (
    <BrowserRouter>
      <Toaster position="top-right" toastOptions={{ style: { fontFamily: "'DM Sans', sans-serif", borderRadius: "10px", background: "#1a1a2e", color: "#e2e8f0", border: "1px solid rgba(99,102,241,0.3)" } }} />
      <Routes>
        <Route path="/" element={<Layout><Dashboard /></Layout>} />
        <Route path="/employees" element={<Layout><Employees /></Layout>} />
        <Route path="/attendance" element={<Layout><Attendance /></Layout>} />
      </Routes>
    </BrowserRouter>
  );
}
