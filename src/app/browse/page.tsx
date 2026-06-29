"use client";

import { useState } from "react";
import Link from "next/link";

const PROS = [
  { initials: "JM", name: "James Mitchell", role: "Personal trainer",   location: "Hoboken, NJ",     price: "$75/hr", rating: "4.9", reviews: 182, tags: ["Strength", "HIIT", "Nutrition"],      bg: "#eff6ff", color: "#2563eb" },
  { initials: "PN", name: "Priya Nair",     role: "Massage therapist",  location: "Newark, NJ",      price: "$85/hr", rating: "5.0", reviews: 210, tags: ["Swedish", "Deep tissue", "Sports"],    bg: "#fbeaf0", color: "#993556" },
  { initials: "SR", name: "Sofia Reyes",    role: "Yoga instructor",     location: "Jersey City, NJ", price: "$65/hr", rating: "4.8", reviews: 340, tags: ["Vinyasa", "Meditation", "Breathwork"],  bg: "#e1f5ee", color: "#0f6e56" },
  { initials: "DK", name: "Derek Kim",      role: "Home cleaner",        location: "Passaic, NJ",     price: "$55/hr", rating: "4.7", reviews: 96,  tags: ["Deep clean", "Move-in", "Weekly"],     bg: "#faeeda", color: "#854f0b" },
  { initials: "AL", name: "Ana Lopez",      role: "Dog groomer",         location: "Clifton, NJ",     price: "$60/hr", rating: "4.9", reviews: 158, tags: ["Bath & brush", "Trim", "Nail care"], bg: "#f3f0fc", color: "#6d28d9" },
  { initials: "RT", name: "Ryan Torres",    role: "Accountant",          location: "Passaic, NJ",     price: "$120/hr", rating: "4.8", reviews: 74, tags: ["Tax prep", "Bookkeeping", "LLCs"],     bg: "#eff6ff", color: "#1d4ed8" },
];

const CATEGORIES = [
  { label: "All",         icon: "🔍" },
  { label: "Fitness",     icon: "💪" },
  { label: "Wellness",    icon: "🧘" },
  { label: "Home",        icon: "🏠" },
  { label: "Pets",        icon: "🐾" },
  { label: "Beauty",      icon: "💅" },
  { label: "Finance",     icon: "💼" },
  { label: "Education",   icon: "📚" },
];

export default function BrowsePage() {
  const [active, setActive] = useState("All");
  const [search, setSearch] = useState("");

  const filtered = PROS.filter((p) => {
    const matchSearch = !search || p.name.toLowerCase().includes(search.toLowerCase()) || p.role.toLowerCase().includes(search.toLowerCase()) || p.tags.some((t) => t.toLowerCase().includes(search.toLowerCase()));
    return matchSearch;
  });

  return (
    <div style={{ minHeight: "100vh", background: "#f9fafb", fontFamily: "system-ui,-apple-system,sans-serif" }}>
      <div style={{ padding: "1.5rem", maxWidth: 700, margin: "0 auto" }}>

        <h1 style={{ fontSize: 22, fontWeight: 700, marginBottom: ".5rem", color: "#111827" }}>Find a professional</h1>
        <p style={{ fontSize: 13, color: "#6b7280", marginBottom: "1.25rem" }}>Book any service from any professional — all in one place.</p>

        {/* Search */}
        <div style={{ display: "flex", gap: 8, marginBottom: ".75rem" }}>
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search by name, service, or specialty..."
            style={{ flex: 1, padding: "9px 12px", border: "0.5px solid #d1d5db", borderRadius: 8, fontSize: 13, fontFamily: "inherit", outline: "none", background: "#fff" }}
          />
          <select style={{ padding: "9px 10px", border: "0.5px solid #d1d5db", borderRadius: 8, fontSize: 13, fontFamily: "inherit", background: "#fff" }}>
            <option>All categories</option>
            <option>Fitness & Training</option>
            <option>Wellness & Therapy</option>
            <option>Home Services</option>
            <option>Pet Care</option>
            <option>Beauty & Grooming</option>
            <option>Finance & Legal</option>
            <option>Education & Tutoring</option>
          </select>
        </div>

        {/* Category pills */}
        <div style={{ display: "flex", gap: 6, marginBottom: "1.5rem", flexWrap: "wrap" }}>
          {CATEGORIES.map((c) => (
            <button key={c.label} onClick={() => setActive(c.label)}
              style={{ padding: "5px 13px", borderRadius: 20, fontSize: 12, border: "0.5px solid", borderColor: active === c.label ? "#2563eb" : "#d1d5db", background: active === c.label ? "#2563eb" : "#fff", color: active === c.label ? "#fff" : "#6b7280", cursor: "pointer", fontFamily: "inherit", display: "flex", alignItems: "center", gap: 5 }}>
              <span>{c.icon}</span>{c.label}
            </button>
          ))}
        </div>

        {/* Results count */}
        <p style={{ fontSize: 12, color: "#9ca3af", marginBottom: "1rem" }}>
          {filtered.length} professional{filtered.length !== 1 ? "s" : ""} available
        </p>

        {/* Pro cards */}
        {filtered.length === 0 ? (
          <div style={{ background: "#fff", border: "0.5px solid #e5e7eb", borderRadius: 12, padding: "3rem", textAlign: "center" }}>
            <div style={{ fontSize: 48, marginBottom: "1rem" }}>🔍</div>
            <p style={{ fontWeight: 600, fontSize: 15, color: "#111827", marginBottom: 8 }}>No results for &ldquo;{search}&rdquo;</p>
            <p style={{ fontSize: 13, color: "#6b7280", lineHeight: 1.7 }}>
              Try a different search term or browse all categories.
            </p>
            <button onClick={() => setSearch("")}
              style={{ marginTop: "1rem", background: "#2563eb", color: "#fff", border: "none", padding: "8px 20px", borderRadius: 8, fontSize: 13, cursor: "pointer", fontFamily: "inherit" }}>
              Clear search
            </button>
          </div>
        ) : (
          <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
            {filtered.map((pro) => (
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
                      <span key={t} style={{ background: "#f3f4f6", color: "#374151", padding: "2px 9px", borderRadius: 20, fontSize: 11, fontWeight: 500 }}>{t}</span>
                    ))}
                  </div>
                </div>
              </Link>
            ))}
          </div>
        )}

        {/* CTA for businesses */}
        <div style={{ marginTop: "2rem", background: "linear-gradient(135deg,#1a1a2e,#1e3a8a)", borderRadius: 12, padding: "1.25rem", color: "#fff", display: "flex", alignItems: "center", justifyContent: "space-between", gap: 12, flexWrap: "wrap" }}>
          <div>
            <p style={{ fontWeight: 600, fontSize: 14, marginBottom: 4 }}>Are you a professional?</p>
            <p style={{ fontSize: 12, opacity: .8 }}>List your services and start accepting bookings for free.</p>
          </div>
          <Link href="/register" style={{ background: "#2563eb", color: "#fff", padding: "8px 18px", borderRadius: 8, fontSize: 13, fontWeight: 500, textDecoration: "none", whiteSpace: "nowrap" as const }}>
            Get started free →
          </Link>
        </div>

      </div>
    </div>
  );
}
