// import React from "react";

export default function EntryPage() {
  return (
    <section className="bg-white border rounded-2xl p-6 shadow-sm">
      <h1 className="text-2xl font-bold mb-4">New Journal Entry</h1>
      <textarea
        className="w-full border rounded-lg p-3 min-h-[140px]"
        placeholder="Write your thoughts here…"
      />
      <button className="mt-4 bg-black text-white rounded-lg px-4 py-2">Save Entry</button>
    </section>
  );
}
