import React, { useContext } from "react";
import { Navigate } from "react-router-dom";
import { AuthContext } from "../../context/AuthContext";

const AdminRoute = ({ children }) => {
  const { user, login, loading } = useContext(AuthContext);
  if (loading) return <div>Loading...</div>;
  if (!user || user.role !== "admin") {
    console.error("Access Denied: Role is", user?.role);
    return <Navigate to="/" replace />;
  }

  return children;
};

export default AdminRoute;
