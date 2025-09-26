// src/auth/AuthContext.jsx
import React, { createContext, useContext, useEffect, useState } from "react";
import { AuthAPI } from "../services/apiClient";

const AuthContext = createContext(null);
export const useAuth = () => useContext(AuthContext);

export function AuthProvider({ children }) {
  const [token, setToken] = useState(localStorage.getItem("zen_token") || null);
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // If a token exists (e.g., after page refresh), load the current user
  useEffect(() => {
    if (!token) return;
    setLoading(true);
    AuthAPI.me()
      .then((res) => setUser(res.data))
      .catch(() => {
        // token invalid → clear it
        localStorage.removeItem("zen_token");
        setToken(null);
        setUser(null);
      })
      .finally(() => setLoading(false));
  }, [token]);

  const login = async ({ email, password }) => {
    try {
      setLoading(true);
      setError(null);
      const { data } = await AuthAPI.login({ email, password });
      localStorage.setItem("zen_token", data.token);
      setToken(data.token);
      setUser(data.user);
      return { ok: true };
    } catch (err) {
      const msg = err?.response?.data?.message || "Login failed";
      setError(msg);
      return { ok: false, error: msg };
    } finally {
      setLoading(false);
    }
  };

  const register = async ({ name, email, password }) => {
    try {
      setLoading(true);
      setError(null);
      await AuthAPI.register({ name, email, password });
      return { ok: true };
    } catch (err) {
      const msg = err?.response?.data?.message || "Register failed";
      setError(msg);
      return { ok: false, error: msg };
    } finally {
      setLoading(false);
    }
  };

  const logout = () => {
    localStorage.removeItem("zen_token");
    setToken(null);
    setUser(null);
  };

  const value = { user, token, loading, error, login, register, logout };
  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}
