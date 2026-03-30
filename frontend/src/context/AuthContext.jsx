import { createContext, useState, useEffect } from "react";
import { jwtDecode } from "jwt-decode"; // 1. Import the library
import { useAlert } from "../hooks/customHooks";

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [credits, setCredits] = useState(null);
  const [role, setRole] = useState(null);
  const [loading, setLoading] = useState(true);
  const { showAlert } = useAlert();

  useEffect(() => {
    const storedToken = localStorage.getItem("token");
    const storedCredits = localStorage.getItem("credits");

    if (storedToken) {
      try {
        const decoded = jwtDecode(storedToken);
        setUser(decoded);
        console.log(decoded);
        setRole(decoded.role);
        if (storedCredits) {
          setCredits(JSON.parse(storedCredits));
        }
      } catch (error) {
        console.error("Invalid token:", error);
        localStorage.removeItem("token");
      }
    }
    setLoading(false);
  }, []);

  useEffect(() => {
    localStorage.setItem("credits", JSON.stringify(credits));
  }, [credits])

  const login = (token) => {
    if (token) {
      localStorage.setItem("token", token);
    }
    const decoded = jwtDecode(token);
    localStorage.setItem("credits", JSON.stringify(decoded.credits));
    setUser(decoded);
    setRole(decoded.role);
    setCredits(decoded.credits);
  };

  const logout = () => {
    const userName = user?.name || "there";
    localStorage.removeItem("user");
    localStorage.removeItem("token");
    localStorage.removeItem("credits");
    sessionStorage.clear();
    showAlert(`See you later, ${userName}! You've been logged out.`, "Logged Out", 2);
    setUser(null);
    setCredits(null);
  };

  return (
    <AuthContext.Provider value={{ user, login, setUser, logout, loading, role, credits, setCredits }}>
      {!loading && children}
    </AuthContext.Provider>
  );
};
