// src/pages/Dashboard.jsx
import React, { useEffect, useState } from "react";
import { JournalAPI } from "../services/apiclient"; // uses your existing axios helper

export default function Dashboard() {
  const [journals, setJournals] = useState([]);
  const [loading, setLoading] = useState(true);
  const [err, setErr] = useState(null);

  useEffect(() => {
    let mounted = true;

    (async () => {
      try {
        setLoading(true);
        setErr(null);
        const { data } = await JournalAPI.list(); // GET /api/journals (requires token)
        if (mounted) setJournals(Array.isArray(data) ? data : []);
      } catch (e) {
        if (mounted) setErr(e?.response?.data?.message || "Failed to load journals");
      } finally {
        if (mounted) setLoading(false);
      }
    })();

    return () => { mounted = false; };
  }, []);

  return (
    <div className="max-w-3xl mx-auto p-6 space-y-6">
      <header>
        <h1 className="text-2xl font-semibold">Dashboard</h1>
        <p className="text-gray-600">Your recent journal entries</p>
      </header>

      <section className="p-4 rounded-xl border shadow-sm">
        <h2 className="text-xl font-medium mb-3">Recent Entries</h2>

        {loading && <p>Loading…</p>}
        {err && <p className="text-red-600">{err}</p>}

        {!loading && !err && journals.length === 0 && (
          <p className="text-gray-600">No entries yet.</p>
        )}

        {!loading && !err && journals.length > 0 && (
          <ul className="space-y-3">
            {journals.map((j) => (
              <li key={j.id || j.entry_id} className="p-3 border rounded-md">
                <div className="text-sm text-gray-500">
                  {new Date(j.createdAt || j.timestamp).toLocaleString()}
                </div>
                <div className="font-medium capitalize">Mood: {j.mood || "—"}</div>
                <p className="mt-1">{j.text}</p>
                {Array.isArray(j.tags) && j.tags.length > 0 && (
                  <div className="mt-1 text-xs text-gray-500">Tags: {j.tags.join(", ")}</div>
                )}
              </li>
            ))}
          </ul>
        )}
      </section>
    </div>
  );
}
