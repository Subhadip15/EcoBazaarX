import { Navigate } from "react-router-dom";

const ProtectedRoute = ({ user, children, isAdmin = false }) => {
  if (!user) {
    return <Navigate to="/login" replace />;
  }

  if (isAdmin && user.role !== "ADMIN") {
    return <Navigate to="/products" replace />;
  }

  return children;
};

export default ProtectedRoute;
