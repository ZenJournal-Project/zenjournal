// src/App.jsx
import React from "react";
import ProtectedRoute from "./components/ProtectedRoute";
import { Routes, Route, Navigate } from "react-router-dom";
import Navbar from "./components/Navbar";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Dashboard from "./pages/Dashboard";
import EntryPage from "./pages/EntryPage";

export default function App() {
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Top Nav */}
      <Navbar />

      {/* Page content */}
      <main className="max-w-5xl mx-auto p-6">
        <Routes>
          {/* Default → Dashboard (will redirect to /login if not authed) */}
          <Route path="/" element={<Navigate to="/dashboard" replace />} />

          {/* Public routes */}
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />

          {/* Protected routes (require token) */}
          <Route
            path="/dashboard"
            element={
              <ProtectedRoute>
                <Dashboard />
              </ProtectedRoute>
            }
          />

          {/* Create new */}
          <Route
            path="/entry"
            element={
              <ProtectedRoute>
                <EntryPage />
              </ProtectedRoute>
            }
          />

          {/* === BEGIN: Edit route added === */}
          <Route
            path="/entry/:id"
            element={
              <ProtectedRoute>
                <EntryPage />
              </ProtectedRoute>
            }
          />
          {/* === END: Edit route added === */}

          {/* Fallback */}
          <Route path="*" element={<Navigate to="/dashboard" replace />} />
        </Routes>
      </main>
    </div>
  );
}
