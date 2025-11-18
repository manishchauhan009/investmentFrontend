import { useState } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import Colors from "../styles/ColorSchema";

import {
  LayoutDashboard,
  Building2,
  LineChart,
  Gem,
  Briefcase,
  LogOut,
  Menu,
  X,
} from "lucide-react";

const links = [
  { name: "Dashboard", path: "/", icon: <LayoutDashboard size={20} /> },
  { name: "Real Estate", path: "/real-estate", icon: <Building2 size={20} /> },
  { name: "Stocks", path: "/stocks", icon: <LineChart size={20} /> },
  { name: "Commodities", path: "/commodities", icon: <Gem size={20} /> },
  { name: "Businesses", path: "/businesses", icon: <Briefcase size={20} /> },
];

const DashboardLayout = ({ children }) => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const navigate = useNavigate();

  const storedUser = localStorage.getItem("user");
  const user = storedUser ? JSON.parse(storedUser) : null;
  const displayName = user?.name || user?.email || "Guest";
  const initials =
    displayName
      ?.split(" ")
      .map((p) => p[0])
      .join("")
      .slice(0, 2)
      .toUpperCase() || "G";

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    navigate("/login");
  };

  const handleNavClick = () => {
    if (window.innerWidth < 1024) {
      setSidebarOpen(false);
    }
  };

  return (
    <div
      className="flex h-screen w-screen overflow-hidden"
      style={{ backgroundColor: Colors.background }}
    >
      {/* Overlay for mobile */}
      <div
        className={`fixed inset-0 z-30 bg-black/50 backdrop-blur-sm transition-opacity duration-300 lg:hidden ${
          sidebarOpen ? "opacity-100 visible" : "opacity-0 invisible"
        }`}
        onClick={() => setSidebarOpen(false)}
      />

      {/* Sidebar */}
      <aside
        className={`fixed z-40 h-full transition-all duration-300 
          ${sidebarOpen ? "left-0" : "-left-72"} 
          lg:static lg:left-0 lg:w-64 w-72 flex-shrink-0 flex flex-col
          shadow-xl border-r border-white/10`}
        style={{ backgroundColor: Colors.primary }}
      >
        {/* Logo & Close */}
        <div className="flex items-center justify-between px-5 py-4 border-b border-white/10">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-2xl flex items-center justify-center"
              style={{ backgroundColor: Colors.card }}
            >
              <LayoutDashboard size={18} className="text-white" />
            </div>
            <div className="flex flex-col leading-tight">
              <span className="text-white font-extrabold text-lg tracking-wide">
                Portfolio
              </span>
              <span className="text-[11px] text-gray-300 uppercase tracking-[0.18em]">
                Overview
              </span>
            </div>
          </div>
          <button
            className="text-white text-2xl lg:hidden"
            onClick={() => setSidebarOpen(false)}
          >
            <X />
          </button>
        </div>

        {/* Nav Links */}
        <nav className="flex-1 mt-4 space-y-1 px-2 overflow-y-auto scrollbar-thin scrollbar-thumb-white/10 scrollbar-track-transparent">
          {links.map((link) => (
            <NavLink
              to={link.path}
              key={link.name}
              onClick={handleNavClick}
              className={({ isActive }) =>
                `flex items-center gap-3 py-3 px-4 mx-1 rounded-xl font-medium text-sm transition-all duration-200
                ${
                  isActive
                    ? "text-white shadow-md"
                    : "text-gray-300 hover:text-white hover:bg-slate-700/60"
                }`
              }
              style={({ isActive }) => ({
                borderLeft: `3px solid ${
                  isActive ? Colors.secondary : "transparent"
                }`,
                backgroundColor: isActive ? "rgba(59,130,246,0.12)" : "transparent",
              })}
            >
              <span
                className="flex items-center justify-center w-8 h-8 rounded-lg"
                style={{
                  backgroundColor: "rgba(15,23,42,0.7)", // slightly darker than primary
                }}
              >
                {link.icon}
              </span>
              <span>{link.name}</span>
            </NavLink>
          ))}
        </nav>

        {/* User + Logout */}
        <div className="p-4 border-t border-white/10">
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-3">
              <div
                className="w-9 h-9 rounded-full flex items-center justify-center text-sm font-semibold text-white"
                style={{
                  backgroundColor: Colors.card,
                  border: `2px solid ${Colors.secondary}`,
                }}
              >
                {initials}
              </div>
              <div className="flex flex-col">
                <span className="text-xs" style={{ color: Colors.textSecondary }}>
                  Logged in as
                </span>
                <span
                  className="text-sm font-semibold truncate max-w-[130px]"
                  style={{ color: Colors.textPrimary }}
                >
                  {displayName}
                </span>
              </div>
            </div>
            <span
              className="text-[10px] px-2 py-1 rounded-full uppercase tracking-wide"
              style={{
                backgroundColor: "rgba(16,185,129,0.15)",
                color: Colors.success,
                border: `1px solid ${Colors.success}55`,
              }}
            >
              Investor
            </span>
          </div>

          <button
            onClick={handleLogout}
            className="w-full flex items-center justify-center gap-2 py-2.5 rounded-xl text-sm font-semibold hover:opacity-95 transition shadow-md"
            style={{ backgroundColor: Colors.secondary, color: "#ffffff" }}
          >
            <LogOut size={18} />
            Logout
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <div className="flex-1 flex flex-col">
        {/* Navbar */}
        <header
          className="flex items-center justify-between px-4 sm:px-6 py-3 sm:py-4 shadow-md lg:justify-end border-b border-white/10"
          style={{ backgroundColor: Colors.primary }}
        >
          {/* Hamburger for mobile */}
          <button
            onClick={() => setSidebarOpen(true)}
            className="text-white text-2xl lg:hidden"
          >
            <Menu />
          </button>

          {/* Right user area */} 
          <div className="flex items-center gap-3 sm:gap-4 text-white ml-auto pt-3">
            <div className="hidden sm:flex flex-col items-end leading-tight">
              <span className="text-xs" style={{ color: Colors.textSecondary }}>
                Welcome back,
              </span>
              <span className="text-sm font-semibold" style={{ color: Colors.textPrimary }}>
                {displayName}
              </span>
            </div>
            <div
              className="w-9 h-9 rounded-full flex items-center justify-center text-xs font-semibold"
              style={{
                backgroundColor: Colors.card,
                border: `2px solid ${Colors.secondary}`,
              }}
            >
              {initials}
            </div>
          </div>
        </header>

        {/* Page Content */}
        <main
          className="flex-1 overflow-y-auto px-4 sm:px-6 py-4 sm:py-6"
          style={{ backgroundColor: Colors.background }}
        >
          <div className="max-w-6xl mx-auto">{children}</div>
        </main>
      </div>
    </div>
  );
};

export default DashboardLayout;
