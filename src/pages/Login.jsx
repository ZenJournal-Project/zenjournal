import React, { useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { useAuth } from "../auth/AuthContext";

export default function Login() {
  const { login, loading, error } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  // If you came from a protected page, we'll go back there after login.
  const from = location.state?.from?.pathname || "/dashboard";

  // controlled inputs
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [localError, setLocalError] = useState("");

  const onSubmit = async (e) => {
    e.preventDefault();
    setLocalError("");

    if (!email.trim() || !password.trim()) {
      setLocalError("Email and password are required.");
      return;
    }

    const res = await login({ email, password });
    if (res.ok) {
      navigate(from, { replace: true });
    } else {
      setLocalError(res.error || "Login failed.");
    }
  };

  return (
    <section className="max-w-md mx-auto bg-white border rounded-2xl p-6 shadow-sm">
      <h1 className="text-2xl font-bold mb-2">Sign in</h1>
      <p className="text-gray-600 mb-4">Use the account you just registered.</p>

      {(localError || error) && (
        <div className="mb-3 text-sm text-red-600">{localError || error}</div>
      )}

      <form onSubmit={onSubmit} className="space-y-3">
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
          {loading ? "Signing in..." : "Sign In"}
        </button>
      </form>

      <p className="text-sm text-gray-600 mt-4">
        No account?{" "}
        <Link to="/register" className="underline">
          Create one
        </Link>
      </p>
    </section>
  );
}
