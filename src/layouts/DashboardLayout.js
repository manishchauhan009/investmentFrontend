import React, { useState } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import Colors from "../styles/ColorSchema";

// Import icons
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

  const handleLogout = () => {
    localStorage.removeItem("token");
    navigate("/login");
  };

  const handleNavClick = () => {
    if (window.innerWidth < 1024) {
      setSidebarOpen(false);
    }
  };

  return (
    <div className="flex h-screen w-screen">
      {/* Overlay for mobile */}
      <div
        className={`fixed inset-0 z-40 bg-black/50 backdrop-blur-sm transition-opacity lg:hidden 
          ${sidebarOpen ? "opacity-100 visible" : "opacity-0 invisible"}`}
        onClick={() => setSidebarOpen(false)}
      ></div>

      {/* Sidebar */}
      <aside
        className={`fixed z-50 h-full transition-all duration-300 
          ${sidebarOpen ? "left-0" : "-left-72"} 
          lg:static lg:w-64 w-72 flex-shrink-0 flex flex-col 
          shadow-xl backdrop-blur-md border-r border-white/20`}
        style={{ backgroundColor: Colors.primary }}
      >
        {/* Logo & Close */}
        <div className="flex items-center justify-between px-5 py-3 border-b border-white/20">
          <span className="text-white font-extrabold text-xl tracking-wide">
            Portfolio
          </span>
          <button
            className="text-white text-2xl lg:hidden"
            onClick={() => setSidebarOpen(false)}
          >
            <X />
          </button>
        </div>

        {/* Nav Links */}
        <nav className="flex-1 mt-6 space-y-1">
          {links.map((link) => (
            <NavLink
              to={link.path}
              key={link.name}
              onClick={handleNavClick}
              className={({ isActive }) =>
                `flex items-center gap-3 py-3 px-6 mx-3 rounded-xl font-medium transition-all duration-200 
                ${
                  isActive
                    ? "bg-white/20 text-white shadow-md"
                    : "text-gray-300 hover:bg-white/10 hover:text-white"
                }`
              }
            >
              {link.icon}
              <span>{link.name}</span>
            </NavLink>
          ))}
        </nav>

        {/* Logout */}
        <div className="p-6 border-t border-white/20">
          <button
            onClick={handleLogout}
            className="w-full flex items-center justify-center gap-2 py-2 rounded-xl text-white font-semibold hover:opacity-90 transition shadow-md"
            style={{ backgroundColor: Colors.secondary }}
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
          className="flex justify-between items-center px-6 py-4 shadow-md lg:justify-end"
          style={{ backgroundColor: Colors.primary }}
        >
          {/* Hamburger */}
          <button
            onClick={() => setSidebarOpen(true)}
            className="text-white text-2xl lg:hidden"
          >
            <Menu />
          </button>

          {/* Right Section (Profile / Notifications) */}
          <div className="hidden lg:flex items-center gap-4 text-white">
            <span className="font-medium">Hi, Shree Rimake Holdings</span>
            {/* <img
              src="%PUBLIC_URL%/favicon.png "
              alt="avatar"
              className="w-9 h-9 rounded-full border-2 border-white/30"
            /> */}
          </div>
        </header>

        {/* Page Content */}
        <main
          className="flex-1 p-6 overflow-y-auto"
          style={{ backgroundColor: Colors.background }}
        >
          {children}
        </main>
      </div>
    </div>
  );
};

export default DashboardLayout;
