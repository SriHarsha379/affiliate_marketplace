import { createContext, useContext, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

const authApi = axios.create({
  baseURL: "",
  withCredentials: true,
});

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    authApi.get("/auth/me")
      .then(res => setUser(res.data))
      .catch(() => setUser(null))
      .finally(() => setLoading(false));
  }, []);

  const login = async (email, password) => {
    const res = await authApi.post("/auth/login", { email, password });
    setUser(res.data);
    return res.data;
  };

  const signup = async (name, email, password, role) => {
    const res = await authApi.post("/auth/signup", { name, email, password, role });
    setUser(res.data);
    return res.data;
  };

  const logout = async () => {
    try {
      await authApi.post("/auth/logout");
    } catch {
      // ignore errors — logout regardless
    } finally {
      setUser(null);
      navigate("/login");  // ← always redirect
    }
  };

  return (
    <AuthContext.Provider value={{ user, loading, login, signup, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => useContext(AuthContext);