import { createContext, useState, useEffect } from "react";
import { useAlert } from "../hooks/customHooks";

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [role, setRole] = useState(null);
  const [loading, setLoading] = useState(true);
  const { showAlert } = useAlert();

  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    const storedToken = localStorage.getItem("token");
    if (storedUser && storedToken) {
      const parsedUser = JSON.parse(storedUser);
      setUser(parsedUser);
      setRole(parsedUser.role);
    }
    setLoading(false);
  }, []);

  const login = (userData, token) => {
    localStorage.setItem("user", JSON.stringify(userData));
    if (token) {
      localStorage.setItem("token", token);
    }
    setUser(userData);
    setRole(userData.role);
  };

  const logout = () => {
    const userName = user?.name || "there";
    localStorage.removeItem("user");
    localStorage.removeItem("token");
    sessionStorage.clear();
    showAlert(`See you later, ${userName}! You've been logged out.`, "Logged Out", 2);
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, login, setUser, logout, loading, role }}>
      {!loading && children}
    </AuthContext.Provider>
  );
};
