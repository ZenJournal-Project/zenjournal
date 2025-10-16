// // src/pages/Dashboard.jsx
// import React, { useEffect, useState } from "react";
// import { JournalAPI } from "../services/apiclient";
// import { Link } from "react-router-dom"; // === Added for Edit link ===

// // --- helpers to read/sort/format dates from various shapes ---
// function extractDate(j) {
//   const raw =
//     j?.timestamp ??
//     j?.createdAt ??
//     j?.created_at ??
//     (j?.created && j.created) ??
//     (j?.date && j.date) ??
//     null;

//   if (!raw) return null;

//   if (typeof raw === "object" && raw.seconds) return new Date(raw.seconds * 1000);
//   if (typeof raw === "number") return new Date(raw < 1e12 ? raw * 1000 : raw);
//   if (typeof raw === "string") return new Date(raw);

//   return null;
// }

// function fmtDate(j) {
//   const d = extractDate(j);
//   return d ? d.toLocaleString() : "—";
// }

// export default function Dashboard() {
//   const [journals, setJournals] = useState([]);
//   const [loading, setLoading] = useState(true);
//   const [err, setErr] = useState(null);
//   const [busyId, setBusyId] = useState(null); // deleting state

//   useEffect(() => {
//     let mounted = true;

//     (async () => {
//       try {
//         setLoading(true);
//         setErr(null);
//         const { data } = await JournalAPI.list(); // GET /api/journals
//         const arr = Array.isArray(data) ? data : [];
//         // newest → oldest
//         arr.sort(
//           (a, b) =>
//             (extractDate(b)?.getTime?.() || 0) - (extractDate(a)?.getTime?.() || 0)
//         );
//         if (mounted) setJournals(arr);
//       } catch (e) {
//         if (mounted) setErr(e?.response?.data?.message || "Failed to load journals");
//       } finally {
//         if (mounted) setLoading(false);
//       }
//     })();

//     return () => {
//       mounted = false;
//     };
//   }, []);

//   async function handleDelete(j) {
//     const id = j.id || j.entry_id || j._id;
//     if (!id) return alert("Entry id missing.");
//     if (!confirm("Delete this entry?")) return;

//     try {
//       setBusyId(id);
//       await JournalAPI.remove(id);
//       setJournals((prev) =>
//         prev.filter((x) => (x.id || x.entry_id || x._id) !== id)
//       );
//     } catch (e) {
//       alert(e?.response?.data?.message || "Failed to delete entry.");
//     } finally {
//       setBusyId(null);
//     }
//   }

//   return (
//     <div className="max-w-3xl mx-auto p-6 space-y-6">
//       <header>
//         <h1 className="text-2xl font-semibold">Dashboard</h1>
//         <p className="text-gray-600">Your recent journal entries</p>
//       </header>

//       <section className="p-4 rounded-xl border shadow-sm">
//         <h2 className="text-xl font-medium mb-3">Recent Entries</h2>

//         {loading && <p>Loading…</p>}
//         {err && <p className="text-red-600">{err}</p>}

//         {!loading && !err && journals.length === 0 && (
//           <p className="text-gray-600">No entries yet.</p>
//         )}

//         {!loading && !err && journals.length > 0 && (
//           <ul className="space-y-3">
//             {journals.map((j) => {
//               const id = j.id || j.entry_id || j._id;
//               const isBusy = busyId === id;
//               return (
//                 <li key={id} className="p-3 border rounded-md">
//                   <div className="flex items-center justify-between text-sm text-gray-500">
//                     <span>{fmtDate(j)}</span>

//                     {/* === BEGIN: Edit button added (link to /entry/:id) === */}
//                     <div className="flex items-center gap-2">
//                       <Link
//                         to={`/entry/${id}`}
//                         className="rounded-md px-2 py-1 text-xs ring-1 ring-gray-300 hover:bg-gray-50"
//                         title="Edit entry"
//                       >
//                         Edit
//                       </Link>
//                       {/* existing Delete button */}
//                       <button
//                         onClick={() => handleDelete(j)}
//                         disabled={isBusy}
//                         className="rounded-md px-2 py-1 text-xs ring-1 ring-red-300 text-red-700 hover:bg-red-50 disabled:opacity-50"
//                         title="Delete entry"
//                       >
//                         {isBusy ? "Deleting…" : "Delete"}
//                       </button>
//                     </div>
//                     {/* === END: Edit button added === */}
//                   </div>

//                   <div className="mt-1 font-medium capitalize">
//                     Mood: {j.mood || "—"}
//                   </div>
//                   <p className="mt-1">{j.text}</p>
//                   {Array.isArray(j.tags) && j.tags.length > 0 && (
//                     <div className="mt-1 text-xs text-gray-500">
//                       Tags: {j.tags.join(", ")}
//                     </div>
//                   )}
//                 </li>
//               );
//             })}
//           </ul>
//         )}
//       </section>
//     </div>
//   );
// }


// src/pages/Dashboard.jsx
import React, { useEffect, useState } from "react";
import { JournalAPI } from "../services/apiclient";
import { Link } from "react-router-dom"; // Added for Edit link

// --- helpers to read/sort/format dates from various shapes ---
function extractDate(j) {
  const raw =
    j?.timestamp ??
    j?.createdAt ??
    j?.created_at ??
    (j?.created && j.created) ??
    (j?.date && j.date) ??
    null;

  if (!raw) return null;

  if (typeof raw === "object" && raw.seconds) return new Date(raw.seconds * 1000);
  if (typeof raw === "number") return new Date(raw < 1e12 ? raw * 1000 : raw);
  if (typeof raw === "string") return new Date(raw);

  return null;
}

function fmtDate(j) {
  const d = extractDate(j);
  return d ? d.toLocaleString() : "—";
}

export default function Dashboard() {
  const [journals, setJournals] = useState([]);
  const [loading, setLoading] = useState(true);
  const [err, setErr] = useState(null);
  const [busyId, setBusyId] = useState(null); // deleting state

  useEffect(() => {
    let mounted = true;

    (async () => {
      try {
        setLoading(true);
        setErr(null);
        const { data } = await JournalAPI.list(); // GET /api/journals
        const arr = Array.isArray(data) ? data : [];
        // newest → oldest
        arr.sort(
          (a, b) =>
            (extractDate(b)?.getTime?.() || 0) - (extractDate(a)?.getTime?.() || 0)
        );
        if (mounted) setJournals(arr);
      } catch (e) {
        if (mounted) setErr(e?.response?.data?.message || "Failed to load journals");
      } finally {
        if (mounted) setLoading(false);
      }
    })();

    return () => {
      mounted = false;
    };
  }, []);

  async function handleDelete(j) {
    const id = j.id || j.entry_id || j._id;
    if (!id) return alert("Entry id missing.");
    if (!confirm("Delete this entry?")) return;

    try {
      setBusyId(id);
      await JournalAPI.remove(id);
      setJournals((prev) =>
        prev.filter((x) => (x.id || x.entry_id || x._id) !== id)
      );
    } catch (e) {
      alert(e?.response?.data?.message || "Failed to delete entry.");
    } finally {
      setBusyId(null);
    }
  }

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
            {journals.map((j) => {
              const id = j.id || j.entry_id || j._id;
              const isBusy = busyId === id;
              return (
                <li key={id} className="p-3 border rounded-md">
                  <div className="flex items-center justify-between text-sm text-gray-500">
                    <span>{fmtDate(j)}</span>

                    {/* === UPDATED START: Edit button/link added === */}
                    <div className="flex items-center gap-2">
                      <Link
                        to={`/entry/${id}`}
                        className="rounded-md px-2 py-1 text-xs ring-1 ring-gray-300 hover:bg-gray-50"
                        title="Edit entry"
                      >
                        Edit
                      </Link>
                      {/* existing Delete button */}
                      <button
                        onClick={() => handleDelete(j)}
                        disabled={isBusy}
                        className="rounded-md px-2 py-1 text-xs ring-1 ring-red-300 text-red-700 hover:bg-red-50 disabled:opacity-50"
                        title="Delete entry"
                      >
                        {isBusy ? "Deleting…" : "Delete"}
                      </button>
                    </div>
                    {/* === UPDATED END === */}
                  </div>

                  <div className="mt-1 font-medium capitalize">
                    Mood: {j.mood || "—"}
                  </div>
                  <p className="mt-1">{j.text}</p>
                  {Array.isArray(j.tags) && j.tags.length > 0 && (
                    <div className="mt-1 text-xs text-gray-500">
                      Tags: {j.tags.join(", ")}
                    </div>
                  )}
                </li>
              );
            })}
          </ul>
        )}
      </section>
    </div>
  );
}
