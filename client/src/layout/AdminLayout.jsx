import { NavLink, Outlet } from "react-router-dom";
import { useAuth } from "../context/AuthContext.jsx";
import { LogOut, LayoutDashboard, Boxes, Users, ClipboardList } from "lucide-react";

export default function AdminLayout() {
  const { logout } = useAuth();

  const linkClass =
    "flex items-center gap-3 px-4 py-3 rounded-xl text-white/80 hover:bg-white/20 transition";

  const activeClass =
    "bg-white/25 text-white shadow-lg";

  return (
    <div className="flex min-h-screen bg-gradient-to-br from-blue-600 to-indigo-700">
      
      {/* SIDEBAR */}
      <aside className="w-72 p-6 bg-white/10 backdrop-blur-xl border-r border-white/20 flex flex-col">
        <h2 className="text-2xl font-bold text-white mb-6">ENTC Admin</h2>

        <nav className="flex flex-col gap-2 flex-grow">

          <NavLink
            to="/admin/dashboard"
            className={({ isActive }) =>
              `${linkClass} ${isActive ? activeClass : ""}`
            }
          >
            <LayoutDashboard size={20} /> Dashboard
          </NavLink>

          <NavLink
            to="/admin/components"
            className={({ isActive }) =>
              `${linkClass} ${isActive ? activeClass : ""}`
            }
          >
            <Boxes size={20} /> Components
          </NavLink>

          <NavLink
            to="/admin/students"
            className={({ isActive }) =>
              `${linkClass} ${isActive ? activeClass : ""}`
            }
          >
            <Users size={20} /> Students
          </NavLink>

          <NavLink
            to="/admin/issues"
            className={({ isActive }) =>
              `${linkClass} ${isActive ? activeClass : ""}`
            }
          >
            <ClipboardList size={20} /> Issues
          </NavLink>
        </nav>

        <button
          onClick={logout}
          className="mt-4 flex items-center gap-3 px-4 py-3 rounded-xl bg-red-500/80 hover:bg-red-600 text-white transition"
        >
          <LogOut size={20} /> Logout
        </button>
      </aside>

      {/* MAIN CONTENT */}
      <main className="flex-1 p-8 text-white/90 overflow-y-auto">
        <Outlet />
      </main>
    </div>
  );
}
