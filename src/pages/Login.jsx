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
    <div className="relative min-h-[calc(100vh-4rem)] flex items-center justify-center overflow-hidden">
      {/* soft ambient blobs */}
      <div className="pointer-events-none absolute inset-0 -z-10">
        <div className="absolute -top-24 -left-24 h-72 w-72 rounded-full bg-purple-400/20 blur-3xl" />
        <div className="absolute -bottom-24 -right-24 h-80 w-80 rounded-full bg-emerald-300/20 blur-3xl" />
        <div className="absolute bottom-10 left-10 h-64 w-64 rounded-full bg-pink-300/20 blur-3xl" />
      </div>

      <section className="w-full max-w-xl">
        {/* brand */}
        <div className="text-center mb-8">
          <div className="mx-auto h-12 w-12 rounded-full bg-gradient-to-tr from-violet-500 to-teal-400 grid place-items-center shadow-lg shadow-violet-500/10">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              fill="none"
              stroke="white"
              strokeWidth="1.8"
              className="h-6 w-6"
            >
              <path d="M12.001 20.727s-7.5-4.364-7.5-9.545a4.5 4.5 0 0 1 8.142-2.5 4.5 4.5 0 0 1 8.142 2.5c0 5.182-8.784 9.545-8.784 9.545z" />
            </svg>
          </div>
          <h1 className="mt-4 text-3xl font-semibold tracking-tight text-gray-900">ZenJournal</h1>
          <p className="mt-1 text-gray-500">Write. Reflect. Grow.</p>
        </div>

        {/* card */}
        <div className="mx-auto w-full rounded-2xl bg-white/90 shadow-xl shadow-gray-200/40 ring-1 ring-gray-100">
          <div className="p-6 sm:p-8">
            <h2 className="text-xl sm:text-2xl font-bold text-gray-900">Welcome back</h2>
            <p className="mt-1 text-sm text-gray-600">Sign in to continue your mindful journey</p>

            {(localError || error) && (
              <div className="mt-4 rounded-md bg-red-50 px-3 py-2 text-sm text-red-700 ring-1 ring-inset ring-red-200">
                {localError || error}
              </div>
            )}

            <form onSubmit={onSubmit} className="mt-5 space-y-4">
              {/* email */}
              <div className="relative">
                <span className="absolute inset-y-0 left-0 grid w-10 place-items-center text-gray-400">
                  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" className="h-5 w-5"><path d="M4 6h16v12H4z" /><path d="M22 6l-10 7L2 6" /></svg>
                </span>
                <input
                  className="w-full rounded-xl border border-gray-200 pl-10 pr-3 py-2.5 text-gray-900 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-violet-500/60 focus:border-violet-500/60"
                  placeholder="Enter your email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
              </div>

              {/* password */}
              <div className="relative">
                <span className="absolute inset-y-0 left-0 grid w-10 place-items-center text-gray-400">
                  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" className="h-5 w-5"><path d="M17 11H7a2 2 0 0 0-2 2v5h14v-5a2 2 0 0 0-2-2Z" /><path d="M12 11V7a3 3 0 1 1 6 0v4" /></svg>
                </span>
                <input
                  className="w-full rounded-xl border border-gray-200 pl-10 pr-10 py-2.5 text-gray-900 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-violet-500/60 focus:border-violet-500/60"
                  placeholder="Enter your password"
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />
                <span className="absolute inset-y-0 right-0 grid w-10 place-items-center text-gray-400">
                  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" className="h-5 w-5"><path d="M2 12s3.5-6.5 10-6.5S22 12 22 12s-3.5 6.5-10 6.5S2 12 2 12Z" /><circle cx="12" cy="12" r="3.5" /></svg>
                </span>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="mt-1 w-full rounded-xl bg-gradient-to-r from-violet-600 to-teal-500 px-4 py-2.5 font-medium text-white shadow-sm transition focus:outline-none focus:ring-2 focus:ring-violet-500/60 disabled:opacity-60"
              >
                {loading ? "Signing in..." : "Sign In"}
              </button>
            </form>

            <p className="mt-5 text-center text-sm text-gray-600">
              Don't have an account? <Link to="/register" className="font-medium text-violet-700 hover:text-violet-800">Sign up</Link>
            </p>
          </div>

          <div className="px-6 sm:px-8 pb-6">
            <div className="mt-4 rounded-xl bg-gray-50 px-4 py-3 text-center text-xs text-gray-500 ring-1 ring-gray-100">
              Your privacy is our priority. All entries are encrypted and secure.
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
