"use client";

// ─────────────────────────────────────────────────────────────
// Slotrez — Browse / Discover page
// Save to: src/app/browse/page.tsx
// ─────────────────────────────────────────────────────────────

import { useState } from "react";
import Link from "next/link";

const PROS = [
  { initials: "MC", name: "Marcus Carr",    role: "Barber",            location: "Passaic, NJ",     price: "$45/hr", rating: "4.9", reviews: 520, tags: ["Fades","Lineups","Shaves"],   bg: "#faeeda", color: "#854f0b" },
  { initials: "SR", name: "Sofia Reyes",    role: "Hair stylist",      location: "Jersey City, NJ", price: "$90/hr", rating: "4.8", reviews: 340, tags: ["Color","Cuts","Keratin"],      bg: "#e1f5ee", color: "#0f6e56" },
  { initials: "JM", name: "James Mitchell", role: "Personal trainer",  location: "Hoboken, NJ",     price: "$75/hr", rating: "4.9", reviews: 182, tags: ["Strength","HIIT","Nutrition"], bg: "#eff6ff", color: "#2563eb" },
  { initials: "PN", name: "Priya Nair",     role: "Massage therapist", location: "Newark, NJ",      price: "$85/hr", rating: "5.0", reviews: 210, tags: ["Swedish","Deep tissue"],       bg: "#fbeaf0", color: "#993556" },
  { initials: "DK", name: "Derek Kim",      role: "Home cleaner",      location: "Passaic, NJ",     price: "$55/hr", rating: "4.7", reviews: 96,  tags: ["Deep clean","Move-in"],        bg: "#faeeda", color: "#854f0b" },
];

const FILTERS = ["All","Hair","Fitness","Home","Wellness","Pets"];

export default function BrowsePage() {
  const [active, setActive] = useState("All");
  const [search, setSearch] = useState("");

  return (
    <div style={{ minHeight: "100vh", background: "#f9fafb", fontFamily: "system-ui,-apple-system,sans-serif" }}>
      <div style={{ padding: "1.5rem", maxWidth: 700, margin: "0 auto" }}>

        <h1 style={{ fontSize: 22, fontWeight: 700, marginBottom: "1.25rem", color: "#111827" }}>Find a professional</h1>

        {/* Search */}
        <div style={{ display: "flex", gap: 8, marginBottom: ".75rem" }}>
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search services or professionals..."
            style={{ flex: 1, padding: "8px 12px", border: "0.5px solid #d1d5db", borderRadius: 8, fontSize: 13, fontFamily: "inherit", outline: "none" }}
          />
          <select style={{ padding: "8px 10px", border: "0.5px solid #d1d5db", borderRadius: 8, fontSize: 13, fontFamily: "inherit", background: "#fff" }}>
            <option>All categories</option>
            <option>Hair & beauty</option>
            <option>Fitness</option>
            <option>Home services</option>
            <option>Wellness</option>
            <option>Pet care</option>
          </select>
        </div>

        {/* Filter pills */}
        <div style={{ display: "flex", gap: 6, marginBottom: "1.5rem", flexWrap: "wrap" }}>
          {FILTERS.map((f) => (
            <button key={f} onClick={() => setActive(f)}
              style={{ padding: "5px 13px", borderRadius: 20, fontSize: 12, border: "0.5px solid", borderColor: active === f ? "#2563eb" : "#d1d5db", background: active === f ? "#2563eb" : "none", color: active === f ? "#fff" : "#6b7280", cursor: "pointer", fontFamily: "inherit" }}>
              {f}
            </button>
          ))}
        </div>

        {/* Pro cards */}
        <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
          {PROS.map((pro) => (
            <Link key={pro.name} href="/book"
              style={{ background: "#fff", border: "0.5px solid #e5e7eb", borderRadius: 10, padding: "1rem", display: "flex", gap: 12, cursor: "pointer", textDecoration: "none" }}>
              <div style={{ width: 46, height: 46, borderRadius: "50%", background: pro.bg, color: pro.color, display: "flex", alignItems: "center", justifyContent: "center", fontWeight: 700, fontSize: 15, flexShrink: 0 }}>
                {pro.initials}
              </div>
              <div style={{ flex: 1 }}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
                  <div>
                    <p style={{ fontWeight: 600, fontSize: 14, color: "#111827" }}>{pro.name}</p>
                    <p style={{ fontSize: 12, color: "#6b7280" }}>{pro.role} · {pro.location}</p>
                  </div>
                  <div style={{ textAlign: "right" }}>
                    <p style={{ fontSize: 13, fontWeight: 600, color: "#2563eb" }}>{pro.price}</p>
                    <p style={{ fontSize: 11, color: "#9ca3af" }}>★ {pro.rating} ({pro.reviews})</p>
                  </div>
                </div>
                <div style={{ display: "flex", gap: 5, marginTop: 8, flexWrap: "wrap" }}>
                  {pro.tags.map((t) => (
                    <span key={t} style={{ background: "#eff6ff", color: "#1d4ed8", padding: "2px 9px", borderRadius: 20, fontSize: 11, fontWeight: 500 }}>{t}</span>
                  ))}
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}
