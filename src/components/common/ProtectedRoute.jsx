import { useContext } from "react";
import { Navigate, useLocation } from "react-router-dom";
import { AuthContext } from "../../context/AuthContext";
import Alert from "./Alert"; // Optional: Or redirect immediately

export default function ProtectedRoute({ children }) {
    const { user } = useContext(AuthContext);
    const location = useLocation();

    if (!user) {
        // Redirect to login page if not logged in
        // We pass the current state so we can redirect back after login
        return <Navigate to="/login" state={{ from: location }} replace />;
    }

    return children;
}