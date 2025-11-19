import { useSelector } from "react-redux";
import { Navigate } from "react-router-dom";

export default function StudentRoute({ children }) {
  const { user } = useSelector((state) => state.auth);

  if (!user) return <Navigate to="/login" />;

  if (user.role !== "student") return <Navigate to="/login" />;

  return children;
}
