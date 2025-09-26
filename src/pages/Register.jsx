// src/pages/Register.jsx

import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../auth/AuthContext";

export default function Register() {
  const { register: doRegister, loading, error } = useAuth();
  const navigate = useNavigate();

  // simple controlled inputs (no extra libraries)
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  // local validation message (optional)
  const [localError, setLocalError] = useState("");

  const onSubmit = async (e) => {
    e.preventDefault();
    setLocalError("");

    // minimal client-side checks
    if (!name.trim() || !email.trim() || !password.trim()) {
      setLocalError("All fields are required.");
      return;
    }
    if (password.length < 6) {
      setLocalError("Password must be at least 6 characters.");
      return;
    }

    const res = await doRegister({ name, email, password });
    if (res.ok) {
      // success -> go to login
      navigate("/login");
    } else {
      // API error (e.g., 409 User already exists)
      setLocalError(res.error || "Registration failed.");
    }
  };

  return (
    <section className="max-w-md mx-auto bg-white border rounded-2xl p-6 shadow-sm">
      <h1 className="text-2xl font-bold mb-2">Create account</h1>
      <p className="text-gray-600 mb-4">
        Use your name, email, and a password to register.
      </p>

      {/* error messages */}
      {(localError || error) && (
        <div className="mb-3 text-sm text-red-600">
          {localError || error}
        </div>
      )}

      <form onSubmit={onSubmit} className="space-y-3">
        <input
          className="w-full border rounded-lg p-2"
          placeholder="Name"
          value={name}
          onChange={(e) => setName(e.target.value)}
        />
        <input
          className="w-full border rounded-lg p-2"
          placeholder="Email"
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
        <input
          className="w-full border rounded-lg p-2"
          placeholder="Password"
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />

        <button
          type="submit"
          disabled={loading}
          className="w-full bg-black text-white rounded-lg py-2 disabled:opacity-60"
        >
          {loading ? "Creating..." : "Register"}
        </button>
      </form>

      <p className="text-sm text-gray-600 mt-4">
        Already have an account?{" "}
        <Link to="/login" className="underline">
          Sign in
        </Link>
      </p>
    </section>
  );
}
