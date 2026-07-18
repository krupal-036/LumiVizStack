import { useContext, useState, useEffect } from "react";
import { Navigate, useLocation } from "react-router-dom";
import { AuthContext } from "../../context/AuthContext";
import Loader from "./Loader";

const ProtectedRoute = ({ children }: { children: React.ReactNode }) => {
  const { user, loading } = useContext(AuthContext);
  const location = useLocation();
  const [shouldRedirect, setShouldRedirect] = useState(false);

  useEffect(() => {
    if (!loading && !user) {
      const timer = setTimeout(() => {
        setShouldRedirect(true);
      }, 2000);

      return () => clearTimeout(timer);
    }
  }, [loading, user]);

  if (loading) {
    return <Loader />;
  }

  if (!user) {
    if (!shouldRedirect) {
      return <Loader />;
    }

    return (
      <Navigate
        to="/login"
        state={{
          from: location.pathname,
          error: "You must be logged in to access this page.",
        }}
        replace
      />
    );
  }

  return children;
};

export default ProtectedRoute;
