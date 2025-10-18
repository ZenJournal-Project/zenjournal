// src/pages/EntryPage.jsx
import React, { useEffect, useMemo, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { JournalAPI } from "../services/apiclient";

// Fixed set of moods for the chip selector
const moods = ["happy", "neutral", "sad", "angry", "anxious"];

export default function EntryPage() {
  const navigate = useNavigate();
  const { id } = useParams();
  const isEdit = useMemo(() => Boolean(id), [id]);

  // --- form state ---
  const [text, setText] = useState("");
  const [mood, setMood] = useState("");
  const [tags, setTags] = useState("");
  const [loading, setLoading] = useState(false);
  const [err, setErr] = useState("");

  // Keep the original entry only to prefill (not sent back)
  const [original, setOriginal] = useState(null);

  // Prefill the form when editing
  useEffect(() => {
    let mounted = true;
    if (!isEdit) return;

    (async () => {
      try {
        setLoading(true);
        setErr("");
        const { data } = await JournalAPI.get(id); // GET /api/journals/:id
        if (!mounted || !data) return;
        setOriginal(data);
        setText(data.text || "");
        setMood(data.mood || "");
        setTags(Array.isArray(data.tags) ? data.tags.join(", ") : (data.tags || ""));
      } catch (e) {
        if (mounted) {
          console.error("Load entry failed:", e?.response?.data || e);
          setErr(e?.response?.data?.message || "Failed to load entry.");
        }
      } finally {
        if (mounted) setLoading(false);
      }
    })();

    return () => { mounted = false; };
  }, [id, isEdit]);

  // === UPDATED START: PUT-only edit; POST for create (no fallback needed) ===
  const onSubmit = async (e) => {
    e.preventDefault();
    setErr("");

    if (!text.trim()) return setErr("Please write something.");
    if (!mood) return setErr("Please select your mood.");

    const tagsArray = tags.split(",").map(t => t.trim()).filter(Boolean);

    try {
      setLoading(true);

      if (isEdit) {
        // Backend PUT is fixed → send only allowed fields
        await JournalAPI.update(id, { text: text.trim(), mood, tags: tagsArray });
      } else {
        // Create path unchanged
        await JournalAPI.create({
          text: text.trim(),
          mood,
          tags: tagsArray,
          timestamp: Date.now(),
        });
      }

      navigate("/dashboard", { replace: true });
    } catch (e2) {
      console.error("Save entry failed:", e2?.response?.data || e2);
      setErr(e2?.response?.data?.message || "Failed to save entry.");
    } finally {
      setLoading(false);
    }
  };
  // === UPDATED END ===

  return (
    <div className="max-w-3xl mx-auto p-6 space-y-5">
      <header>
        <h1 className="text-2xl font-semibold">
          {isEdit ? "Edit journal entry" : "New journal entry"}
        </h1>
        <p className="text-gray-600">
          {isEdit ? "Update mood, text, or tags." : "Capture your mood and thoughts."}
        </p>
      </header>

      {err && (
        <div className="rounded-md bg-red-50 px-3 py-2 text-sm text-red-700 ring-1 ring-red-200">
          {err}
        </div>
      )}

      <form onSubmit={onSubmit} className="space-y-4">
        {/* mood */}
        <div>
          <label className="block text-sm font-medium mb-1">Mood</label>
          <div className="flex gap-2 flex-wrap">
            {moods.map((m) => (
              <button
                key={m}
                type="button"
                onClick={() => setMood(m)}
                className={
                  "px-3 py-1.5 rounded-lg ring-1 " +
                  (mood === m
                    ? "bg-violet-600 text-white ring-violet-600"
                    : "bg-white text-gray-700 ring-gray-200 hover:bg-gray-50")
                }
                aria-pressed={mood === m}
              >
                {m}
              </button>
            ))}
          </div>
        </div>

        {/* text */}
        <div>
          <label className="block text-sm font-medium mb-1">Entry</label>
          <textarea
            className="w-full min-h-40 rounded-xl border border-gray-200 p-3 focus:outline-none focus:ring-2 focus:ring-violet-500/60"
            placeholder="How are you feeling today?"
            value={text}
            onChange={(e) => setText(e.target.value)}
          />
        </div>

        {/* tags */}
        <div>
          <label className="block text-sm font-medium mb-1">
            Tags <span className="text-gray-400">(comma separated, optional)</span>
          </label>
          <input
            className="w-full rounded-xl border border-gray-200 p-2.5 focus:outline-none focus:ring-2 focus:ring-violet-500/60"
            placeholder="gratitude, work, family"
            value={tags}
            onChange={(e) => setTags(e.target.value)}
          />
        </div>

        <div className="flex gap-3">
          <button
            type="submit"
            disabled={loading}
            className="rounded-xl bg-black text-white px-4 py-2 disabled:opacity-60"
          >
            {loading ? (isEdit ? "Saving…" : "Saving…") : isEdit ? "Save changes" : "Save entry"}
          </button>
          <button
            type="button"
            onClick={() => navigate("/dashboard")}
            className="rounded-xl ring-1 ring-gray-200 px-4 py-2"
          >
            Cancel
          </button>
        </div>
      </form>
    </div>
  );
}
