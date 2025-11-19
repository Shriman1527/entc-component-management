import { Outlet } from "react-router-dom";
import AdminNavbar from "./AdminNavbar";

export default function AdminLayout() {
  return (
    <div>
      <AdminNavbar />
      <div className="p-4">
        <Outlet />
      </div>
    </div>
  );
}
