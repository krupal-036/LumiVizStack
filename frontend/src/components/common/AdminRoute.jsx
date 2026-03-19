import React, { useContext, useEffect } from "react";
import { Navigate, useLocation } from "react-router-dom";
import { AuthContext } from "../../context/AuthContext";
import Loader from "./Loader";
import { useAlert } from "../../hooks/customHooks"
const AdminRoute = ({ children }) => {
  const { user, loading } = useContext(AuthContext);
  const { showAlert } = useAlert();
  const location = useLocation();
  useEffect(() => {
    if (!loading && user && user.role !== "admin") {
      showAlert("You can't access Admin panel with user credentials", "Invalid User...");
    }
  }, [user, loading, showAlert]);

  if (loading) {
    return (
      <Loader data={"Loading Admin Panel..."} />
    );
  }

  if (!user) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  if (user.role !== "admin") {
    return (<>
      <Navigate to="/" replace />
    </>
    );
  }

  return children;
};

export default AdminRoute;
