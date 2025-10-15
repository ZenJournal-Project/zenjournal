// src/services/apiClient.js
import axios from "axios";

// Use relative base in DEV (Vite proxy will forward /api → backend)
// Use .env VITE_API_URL in PROD builds
const PROD_BASE = (import.meta.env.VITE_API_URL || "").replace(/\/$/, "");
export const API_BASE = import.meta.env.DEV ? "" : PROD_BASE;

const api = axios.create({
  baseURL: API_BASE || "/", // safe default
  withCredentials: true,    // backend also sets an httpOnly cookie
});

// Attach JWT from localStorage to every request (if present)
api.interceptors.request.use((config) => {
  const token = localStorage.getItem("zen_token");
  if (token) config.headers.Authorization = `Bearer ${token}`;
  // Keep content-type explicit for JSON writes
  if (["post", "put", "patch"].includes((config.method || "").toLowerCase())) {
    config.headers["Content-Type"] = "application/json";
  }
  return config;
});

// ---- API helpers (mentor's endpoints) ----
export const AuthAPI = {
  register: (payload) => api.post("/api/auth/register", payload),
  login: (payload) => api.post("/api/auth/login", payload),
  me: () => api.get("/api/auth/user"),
};

export const JournalAPI = {
  list: () => api.get("/api/journals"),
  create: (payload) => api.post("/api/journals", payload),
  get: (id) => api.get(`/api/journals/${id}`),

  // UPDATED START: force the PUT body to be exactly { text, mood, tags }
  update: (id, payload) => {
    const clean = {
      text: String(payload?.text ?? "").trim(),
      mood: String(payload?.mood ?? "").trim(),
      tags: Array.isArray(payload?.tags) ? payload.tags : [],
    };
    return api.put(`/api/journals/${id}`, clean);
  },
  // UPDATED END

  remove: (id) => api.delete(`/api/journals/${id}`),
};

export const MoodAPI = {
  list: () => api.get("/api/moods"),
  create: (payload) => api.post("/api/moods", payload),
  get: (id) => api.get(`/api/moods/${id}`),
  remove: (id) => api.delete(`/api/moods/${id}`),
};

export default api;
