import {
  createContext,
  useContext,
  useEffect,
  useState,
  ReactNode,
} from "react";

// -------------------------------
// CONFIG
// -------------------------------
const API_URL = import.meta.env.VITE_API_URL || "http://localhost:5000"; // your backend base URL

interface User {
  id: string;
  email: string;
}

interface AuthContextType {
  user: User | null;
  loading: boolean;
  signUp: (email: string, password: string) => Promise<{ error?: string }>;
  signIn: (email: string, password: string) => Promise<{ error?: string }>;
  signOut: () => void;
}

// -------------------------------
// CONTEXT INITIALIZATION
// -------------------------------
const AuthContext = createContext<AuthContextType | undefined>(undefined);

// -------------------------------
// PROVIDER COMPONENT
// -------------------------------
export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  // -------------------------------
  // Helper: Save / Load token
  // -------------------------------
  const getStoredUser = () => {
    const token = localStorage.getItem("token");
    if (!token) return null;
    try {
      const payload = JSON.parse(atob(token.split(".")[1]));
      return { id: payload.id, email: payload.email };
    } catch {
      return null;
    }
  };

  useEffect(() => {
    const storedUser = getStoredUser();
    if (storedUser) setUser(storedUser);
    setLoading(false);
  }, []);

  // -------------------------------
  // Sign Up
  // -------------------------------
  const signUp = async (email: string, password: string) => {
    try {
      const res = await fetch(`${API_URL}/api/auth/register`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });
      if (!res.ok) {
        const data = await res.json();
        return { error: data.message || "Failed to register" };
      }
      return {};
    } catch (err: any) {
      return { error: err.message || "Network error" };
    }
  };

  // -------------------------------
  // Sign In
  // -------------------------------
  const signIn = async (email: string, password: string) => {
    try {
      const res = await fetch(`${API_URL}/api/auth/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      const data = await res.json();
      if (!res.ok || !data.token) {
        return { error: data.message || "Invalid credentials" };
      }

      localStorage.setItem("token", data.token);
      setUser({ id: data.user.id, email: data.user.email });
      return {};
    } catch (err: any) {
      return { error: err.message || "Network error" };
    }
  };

  // -------------------------------
  // Sign Out
  // -------------------------------
  const signOut = () => {
    localStorage.removeItem("token");
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, loading, signUp, signIn, signOut }}>
      {children}
    </AuthContext.Provider>
  );
}

// -------------------------------
// HOOK
// -------------------------------
export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}
