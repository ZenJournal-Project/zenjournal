import React from "react";
import { Link, NavLink, useNavigate } from "react-router-dom";
import { useAuth } from "../auth/AuthContext";

const linkBase =
  "px-3 py-2 rounded-lg text-sm font-medium transition";
const linkInactive = "text-gray-600 hover:bg-gray-100";
const linkActive = "bg-black text-white";

export default function Navbar() {
  const navigate = useNavigate();
  const { user, token, loading, logout } = useAuth();

  const handleLogout = () => {
    logout();
    navigate("/login", { replace: true });
  };

  return (
    <header className="border-b bg-white">
      <div className="max-w-5xl mx-auto px-6 h-16 flex items-center justify-between">
        <Link to="/dashboard" className="text-xl font-bold">
          ZenJournal
        </Link>

        {/* Left nav (only when logged in) */}
        <nav className="flex items-center gap-2">
          {token ? (
            <>
              <NavLink
                to="/dashboard"
                className={({ isActive }) =>
                  `${linkBase} ${isActive ? linkActive : linkInactive}`
                }
              >
                Dashboard
              </NavLink>
              <NavLink
                to="/entry"
                className={({ isActive }) =>
                  `${linkBase} ${isActive ? linkActive : linkInactive}`
                }
              >
                New Entry
              </NavLink>
            </>
          ) : null}
        </nav>

        {/* Right side: auth actions */}
        <div className="flex items-center gap-2">
          {token ? (
            <>
              <span className="text-sm text-gray-600 mr-1">
                {loading ? "..." : `Hi, ${user?.name ?? "user"}`}
              </span>
              <button
                onClick={handleLogout}
                className="px-3 py-2 rounded-lg bg-black text-white text-sm"
              >
                Logout
              </button>
            </>
          ) : (
            <>
              <NavLink
                to="/login"
                className={({ isActive }) =>
                  `${linkBase} ${isActive ? linkActive : linkInactive}`
                }
              >
                Login
              </NavLink>
              <NavLink
                to="/register"
                className={({ isActive }) =>
                  `${linkBase} ${isActive ? linkActive : linkInactive}`
                }
              >
                Register
              </NavLink>
            </>
          )}
        </div>
      </div>
    </header>
  );
}
