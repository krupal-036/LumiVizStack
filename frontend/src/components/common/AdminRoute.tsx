import { useContext, useEffect, useState } from "react";
import { Navigate, useLocation } from "react-router-dom";
import { AuthContext } from "../../context/AuthContext";
import Loader from "./Loader";
import { useAlert } from "../../hooks/customHooks";

const AdminRoute = ({ children }: { children: React.ReactNode }) => {
  const { user, loading } = useContext(AuthContext);
  const { showAlert } = useAlert();
  const location = useLocation();
  const [shouldRedirect, setShouldRedirect] = useState(false);

  useEffect(() => {
    if (!loading && user && user.role !== "admin") {
      showAlert("You can't access Admin panel with user credentials", "Invalid User...", 1);

      const timer = setTimeout(() => {
        setShouldRedirect(true);
      }, 2000);

      return () => clearTimeout(timer);
    }
  }, [user, loading, showAlert]);

  if (loading) {
    return <Loader data={"Loading Admin Panel..."} />;
  }

  if (!user) {
    return <Navigate to="/login" state={{ from: location, error: "You must be logged in to Access Admin Panel." }} replace />;
  }

  if (user.role !== "admin") {
    if (!shouldRedirect) {
      return <Loader data={"Restricted Access. Redirecting..."} />;
    }
    return <Navigate to="/" replace />;
  }

  return children;
};

export default AdminRoute;
