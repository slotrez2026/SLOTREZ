"use client";

// ─────────────────────────────────────────────────────────────
// Slotrez — Book page
// Save to: src/app/book/page.tsx
// ─────────────────────────────────────────────────────────────

import { useState } from "react";
import Link from "next/link";

const SLOTS = ["9:00 am","10:00 am","11:00 am","1:00 pm","2:00 pm","3:00 pm","4:00 pm","5:00 pm"];

export default function BookPage() {
  const [slot, setSlot] = useState("11:00 am");
  const [done, setDone] = useState(false);

  if (done) return (
    <div style={{ minHeight: "100vh", background: "#f9fafb", display: "flex", alignItems: "center", justifyContent: "center", fontFamily: "system-ui,-apple-system,sans-serif" }}>
      <div style={{ background: "#fff", border: "0.5px solid #e5e7eb", borderRadius: 12, padding: "2.5rem", textAlign: "center", maxWidth: 400 }}>
        <div style={{ fontSize: 52, marginBottom: "1rem" }}>🎉</div>
        <h2 style={{ fontSize: 20, fontWeight: 700, marginBottom: ".5rem", color: "#111827" }}>Rez confirmed!</h2>
        <p style={{ fontSize: 13, color: "#6b7280", marginBottom: 4 }}>Marcus Carr · Fade + taper · Jun 24 at {slot}</p>
        <p style={{ fontSize: 13, color: "#3b6d11", fontWeight: 500, marginBottom: "1.5rem" }}>+35 loyalty pts earned ⭐</p>
        <Link href="/browse" style={{ background: "#2563eb", color: "#fff", padding: "9px 20px", borderRadius: 8, fontSize: 13, fontWeight: 500, textDecoration: "none", display: "inline-block" }}>
          Back to browse
        </Link>
      </div>
    </div>
  );

  return (
    <div style={{ minHeight: "100vh", background: "#f9fafb", fontFamily: "system-ui,-apple-system,sans-serif" }}>
      <div style={{ padding: "1.5rem", maxWidth: 520, margin: "0 auto" }}>

        {/* Back */}
        <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: "1.25rem" }}>
          <Link href="/browse" style={{ border: "0.5px solid #d1d5db", color: "#374151", padding: "7px 14px", borderRadius: 8, fontSize: 13, textDecoration: "none", background: "#fff" }}>
            ← Back
          </Link>
          <p style={{ fontSize: 14, fontWeight: 600, color: "#111827" }}>Book with Marcus Carr</p>
        </div>

        {/* Steps */}
        <div style={{ display: "flex", alignItems: "center", gap: 6, marginBottom: "1.5rem" }}>
          {["Service","Intake","Time","Confirm"].map((s, i) => (
            <div key={s} style={{ display: "flex", alignItems: "center", gap: 6, flex: i < 3 ? 1 : undefined }}>
              <div style={{ width: 24, height: 24, borderRadius: "50%", background: i < 2 ? "#2563eb" : i === 2 ? "#eff6ff" : "#f3f4f6", color: i < 2 ? "#fff" : i === 2 ? "#2563eb" : "#9ca3af", border: i === 2 ? "1.5px solid #2563eb" : "none", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 10, fontWeight: 700, flexShrink: 0 }}>
                {i < 2 ? "✓" : i + 1}
              </div>
              <span style={{ fontSize: 10, color: i === 2 ? "#2563eb" : "#9ca3af", fontWeight: i === 2 ? 600 : 400 }}>{s}</span>
              {i < 3 && <div style={{ flex: 1, height: 1, background: "#e5e7eb" }} />}
            </div>
          ))}
        </div>

        {/* Intake summary */}
        <div style={{ background: "#eff6ff", border: "0.5px solid #93c5fd", borderRadius: 12, padding: "1rem", marginBottom: "1rem" }}>
          <p style={{ fontSize: 12, fontWeight: 600, color: "#1d4ed8", marginBottom: 6 }}>📋 Intake answered</p>
          <div style={{ fontSize: 12, color: "#1d4ed8", display: "flex", flexDirection: "column", gap: 3 }}>
            <p>Style: <strong>Fade with taper</strong></p>
            <p>Hair type: <strong>Coarse, thick</strong></p>
            <p>Notes: <strong>Leave length on top</strong></p>
          </div>
        </div>

        {/* Time picker */}
        <div style={{ background: "#fff", border: "0.5px solid #e5e7eb", borderRadius: 12, padding: "1.25rem", marginBottom: "1rem" }}>
          <p style={{ fontSize: 13, fontWeight: 600, marginBottom: ".75rem", color: "#111827" }}>Pick a time — Tue Jun 24</p>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(4,1fr)", gap: 7 }}>
            {SLOTS.map((s) => (
              <button key={s} onClick={() => setSlot(s)}
                style={{ padding: 7, border: "0.5px solid", borderColor: slot === s ? "#2563eb" : "#d1d5db", borderRadius: 7, fontSize: 12, cursor: "pointer", background: slot === s ? "#2563eb" : "none", color: slot === s ? "#fff" : "#374151", fontFamily: "inherit" }}>
                {s}
              </button>
            ))}
          </div>
        </div>

        {/* Price breakdown */}
        <div style={{ background: "#fff", border: "0.5px solid #e5e7eb", borderRadius: 12, padding: "1.25rem", marginBottom: "1rem", fontSize: 13 }}>
          {[["Fade + taper","$35.00","#111827"],["Deposit (due now)","$10.00","#6b7280"],["Loyalty pts earned","+35 pts","#3b6d11"],["Slotrez fee","$1.00","#6b7280"]].map(([l,v,c]) => (
            <div key={l} style={{ display: "flex", justifyContent: "space-between", marginBottom: 7, color: c }}><span>{l}</span><span>{v}</span></div>
          ))}
          <div style={{ borderTop: "0.5px solid #e5e7eb", paddingTop: 8, display: "flex", justifyContent: "space-between", fontWeight: 700, fontSize: 14, color: "#111827" }}>
            <span>Due now</span><span>$11.00</span>
          </div>
        </div>

        {/* Policy */}
        <div style={{ background: "#fff", border: "0.5px solid #e5e7eb", borderRadius: 12, padding: "1rem", marginBottom: "1rem", fontSize: 12, color: "#6b7280", lineHeight: 1.7 }}>
          <p style={{ fontWeight: 600, color: "#111827", marginBottom: 6, fontSize: 13 }}>Booking policy</p>
          <p>📅 Free cancellation up to <strong>24 hrs</strong>. $15 fee after.</p>
          <p>🚫 No-show fee: <strong>$30</strong>.</p>
        </div>

        <button onClick={() => setDone(true)}
          style={{ width: "100%", background: "#2563eb", color: "#fff", border: "none", padding: "12px", borderRadius: 8, fontSize: 14, fontWeight: 500, cursor: "pointer", fontFamily: "inherit" }}>
          Confirm &amp; pay $11.00
        </button>

      </div>
    </div>
  );
}
