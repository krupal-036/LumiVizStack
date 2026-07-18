import { createContext, useState, useEffect, Dispatch, SetStateAction, type ReactNode } from "react";
import { jwtDecode, JwtPayload } from "jwt-decode"; 
import { useAlert } from "../hooks/customHooks";

// 1. Explicitly define what your JWT payload contains
export interface CustomJwtPayload extends JwtPayload {
  id?: string;
  name?: string;
  role?: string;
  credits?: number;
  [key: string]: any; // Fallback for other custom claims
}

// 2. Align type definition with all variables passed into your Provider
export type AuthContextType = { 
  user: CustomJwtPayload | null; 
  setUser: Dispatch<SetStateAction<CustomJwtPayload | null>>;
  login: (token: string) => void; 
  logout: () => void; 
  loading: boolean; 
  role: string | null; 
  credits: number | null; 
  setCredits: Dispatch<SetStateAction<number | null>>; 
  token: string | null;
};

const DefaultAuthContext: AuthContextType = {
  user: null,
  setUser: () => {},
  login: () => {},
  logout: () => {},
  loading: false,
  role: null,
  credits: null,
  setCredits: () => {},
  token: null,
};

export const AuthContext = createContext<AuthContextType>(DefaultAuthContext);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  // Give generic state arguments to handle both the data type and the initial null state
  const [user, setUser] = useState<CustomJwtPayload | null>(null);
  const [credits, setCredits] = useState<number | null>(null);
  const [role, setRole] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [token, setToken] = useState<string | null>(() => localStorage.getItem("token"));
  
  const { showAlert } = useAlert() as { showAlert: (message: string, title?: string, type?: number) => void } ;

  useEffect(() => {
    const storedToken = localStorage.getItem("token");
    const storedCredits = localStorage.getItem("credits");

    if (storedToken) {
      try {
        // Enforce the expected shape of the token values via type assertion
        const decoded = jwtDecode<CustomJwtPayload>(storedToken);
        setUser(decoded);
        setRole(decoded.role ?? null);
        
        if (storedCredits) {
          setCredits(JSON.parse(storedCredits));
        }
      } catch (error) {
        console.error("Invalid token:", error);
        localStorage.removeItem("token");
        localStorage.removeItem("credits");
      }
    }
    setLoading(false);
  }, []);

  useEffect(() => {
    if (credits !== null) {
      localStorage.setItem("credits", JSON.stringify(credits));
    }
  }, [credits]);

  // Typed parameter explicitly and decoupled decoding process
  const login = (tokenval: string) => {
    if (tokenval) {
      localStorage.setItem("token", tokenval);
    }
    
    const decoded = jwtDecode<CustomJwtPayload>(tokenval);
    const userCredits = decoded.credits ?? 0;
    
    localStorage.setItem("credits", JSON.stringify(userCredits));
    setUser(decoded);
    setRole(decoded.role ?? null);
    setCredits(userCredits);
    setToken(tokenval);
  };

  const logout = () => {
    const userName = user?.name || "there";
    localStorage.removeItem("user");
    localStorage.removeItem("token");
    localStorage.removeItem("credits");
    sessionStorage.clear();
    
    showAlert(`See you later, ${userName}! You've been logged out.`, "Logged Out", 2);
    setUser(null);
    setRole(null);
    setCredits(null);
    setToken(null);
  };

  return (
    <AuthContext.Provider value={{ user, login, setUser, logout, loading, role, credits, setCredits, token }}>
      {!loading && children}
    </AuthContext.Provider>
  );
};
