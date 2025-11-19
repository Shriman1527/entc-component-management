import { Navigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

export default function AdminRoute({ children }) {
  const { user } = useAuth();

  console.log("AUTH IN ADMIN ROUTE:", user);

  if (!user) return <Navigate to="/" />;
  if (user.role !== "admin") return <Navigate to="/student/dashboard" />;

  return children;
}
