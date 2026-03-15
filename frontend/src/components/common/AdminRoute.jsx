import React, { useContext } from "react";
import { Navigate, useLocation } from "react-router-dom";
import { AuthContext } from "../../context/AuthContext";
import Loader from "./Loader";
import Alert from "./Alert";
const AdminRoute = ({ children }) => {
  const { user, loading } = useContext(AuthContext);
  const location = useLocation();
  if (loading) {
    return (
      <Loader data={"Loading Admin Panel..."} />
    );
  }

  if (!user) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  if (user.role !== "admin") {
    return ( <>
    <Navigate to="/" replace />
    <Alert message={"You cant access Admin panel wit user credentials"} />
    </>
  );
  }

  return children;
};

export default AdminRoute;
