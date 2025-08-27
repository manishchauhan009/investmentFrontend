import React, { useState } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import Colors from "../styles/ColorSchema";

// Import icons
import { LayoutDashboard, Building2, LineChart, Gem, Briefcase } from "lucide-react";

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

  const handleLogout = () => {
    localStorage.removeItem("token");
    navigate("/login");
  };

  // Detect mobile width
  const handleNavClick = () => {
    if (window.innerWidth < 1024) {
      setSidebarOpen(false);
    }
  };

  return (
    <div className="flex h-screen w-screen overflow-hidden">
      {/* Sidebar Overlay (mobile only) */}
      <div
        className={`fixed inset-0 z-40 bg-black bg-opacity-50 transition-opacity lg:hidden ${sidebarOpen ? "opacity-100 visible" : "opacity-0 invisible"
          }`}
        onClick={() => setSidebarOpen(false)}
      ></div>

      {/* Sidebar */}
      {/* Sidebar */}
      <aside
        className={`fixed z-50 h-full transition-all duration-300 
    ${sidebarOpen ? "left-0" : "-left-64"} 
    lg:static lg:w-64 w-64 flex-shrink-0 flex flex-col shadow-lg overflow-y-auto`}
        style={{ backgroundColor: Colors.primary }}
      >
        {/* Logo */}
        <div className="flex items-center justify-between p-6 border-b border-white/20 flex-shrink-0">
          <span className="text-white font-extrabold text-2xl tracking-wide">
            Portfolio
          </span>
          <button
            className="text-white text-2xl lg:hidden"
            onClick={() => setSidebarOpen(false)}
          >
            ✕
          </button>
        </div>

        {/* Navigation */}
        <nav className="flex-1 mt-6 space-y-2">
          {links.map((link) => (
            <NavLink
              to={link.path}
              key={link.name}
              className={({ isActive }) =>
                `flex items-center gap-3 py-3 px-6 rounded-lg font-medium transition-colors ${isActive
                  ? "text-white"
                  : "text-gray-200 hover:bg-white/10 hover:text-white"
                }`
              }
              style={({ isActive }) => ({
                backgroundColor: isActive ? Colors.secondary : "transparent",
              })}
              onClick={handleNavClick}
            >
              {link.icon}
              <span>{link.name}</span>
            </NavLink>
          ))}
        </nav>

        {/* Footer */}
        <div className="p-6 border-t border-white/20 flex-shrink-0">
          <button
            onClick={handleLogout}
            className="w-full py-2 rounded-lg text-white font-semibold hover:opacity-90 transition"
            style={{ backgroundColor: Colors.secondary }}
          >
            Logout
          </button>
        </div>
      </aside>


      {/* Main Content */}
      <div className="flex-1 flex flex-col">
        {/* Navbar */}
        <header
          className="flex justify-between items-center p-10 shadow lg:justify-end"
          style={{ backgroundColor: Colors.primary }}
        >
          {/* Hamburger for Mobile */}
          <button
            onClick={() => setSidebarOpen(true)}
            className="font-bold text-white text-2xl lg:hidden"
          >
            ☰
          </button>
        </header>

        {/* Page Content */}
        <main
          className="flex-1 p-6 overflow-auto"
          style={{ backgroundColor: Colors.background, minHeight: "100vh" }}
        >
          {children}
        </main>
      </div>
    </div>
  );
};

export default DashboardLayout;
