"use client";

// ─────────────────────────────────────────────────────────────
// Slotrez — Client Portal
// Save to: src/app/portal/client/page.tsx
// ─────────────────────────────────────────────────────────────

import { useEffect, useState } from "react";
import Link from "next/link";
import { supabase } from "@/lib/supabase";

type Tab = "upcoming" | "history" | "favorites" | "loyalty" | "profile";

interface Profile {
  full_name: string;
  email: string;
  phone: string;
  avatar_url: string;
}

export default function ClientPortalPage() {
  const [tab, setTab] = useState<Tab>("upcoming");
  const [profile, setProfile] = useState<Profile | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function load() {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) { window.location.href = "/login"; return; }

      const { data } = await supabase
        .from("profiles")
        .select("full_name, email, phone, avatar_url")
        .eq("id", session.user.id)
        .single();

      setProfile(data || {
        full_name: session.user.user_metadata?.full_name || "Guest",
        email: session.user.email || "",
        phone: "",
        avatar_url: "",
      });
      setLoading(false);
    }
    load();
  }, []);

  async function handleSignOut() {
    await supabase.auth.signOut();
    window.location.href = "/";
  }

  const firstName = profile?.full_name?.split(" ")[0] || "there";
  const initials = profile?.full_name
    ? profile.full_name.split(" ").map((n: string) => n[0]).join("").toUpperCase().slice(0, 2)
    : "?";

  const NAV: { id: Tab; label: string; icon: string }[] = [
    { id: "upcoming",  label: "Upcoming rezzes", icon: "📅" },
    { id: "history",   label: "History",         icon: "🕐" },
    { id: "favorites", label: "Favorites",        icon: "❤️" },
    { id: "loyalty",   label: "Loyalty rewards",  icon: "⭐" },
    { id: "profile",   label: "My profile",       icon: "👤" },
  ];

  if (loading) return (
    <div style={{ minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center", background: "#f9fafb", fontFamily: "system-ui,-apple-system,sans-serif", flexDirection: "column", gap: 16 }}>
      <div style={{ fontSize: 24, fontWeight: 700 }}><span style={{ color: "#1a1a2e" }}>slot</span><span style={{ color: "#2563eb" }}>rez</span></div>
      <div style={{ width: 28, height: 28, border: "3px solid #e5e7eb", borderTop: "3px solid #2563eb", borderRadius: "50%", animation: "spin .8s linear infinite" }} />
      <style>{`@keyframes spin{to{transform:rotate(360deg)}}`}</style>
    </div>
  );

  return (
    <div style={{ minHeight: "100vh", background: "#f9fafb", fontFamily: "system-ui,-apple-system,sans-serif" }}>
      <div style={{ maxWidth: 900, margin: "0 auto", padding: "1.5rem" }}>

        {/* Header */}
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "1.5rem" }}>
          <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
            <div style={{ width: 44, height: 44, borderRadius: "50%", background: "#eff6ff", color: "#2563eb", display: "flex", alignItems: "center", justifyContent: "center", fontWeight: 700, fontSize: 16 }}>
              {initials}
            </div>
            <div>
              <p style={{ fontWeight: 700, fontSize: 16, color: "#111827" }}>Hey, {firstName}! 👋</p>
              <p style={{ fontSize: 12, color: "#6b7280" }}>{profile?.email}</p>
            </div>
          </div>
          <div style={{ display: "flex", gap: 8 }}>
            <Link href="/browse" style={{ background: "#2563eb", color: "#fff", padding: "8px 16px", borderRadius: 8, fontSize: 13, fontWeight: 500, textDecoration: "none" }}>
              + Book a rez
            </Link>
            <button onClick={handleSignOut} style={{ background: "none", border: "0.5px solid #d1d5db", padding: "8px 14px", borderRadius: 8, fontSize: 13, cursor: "pointer", fontFamily: "inherit", color: "#374151" }}>
              Sign out
            </button>
          </div>
        </div>

        {/* Tab nav */}
        <div style={{ display: "flex", gap: 6, marginBottom: "1.5rem", flexWrap: "wrap" }}>
          {NAV.map((n) => (
            <button key={n.id} onClick={() => setTab(n.id)}
              style={{ padding: "7px 14px", borderRadius: 20, fontSize: 13, border: "0.5px solid", borderColor: tab === n.id ? "#2563eb" : "#d1d5db", background: tab === n.id ? "#2563eb" : "#fff", color: tab === n.id ? "#fff" : "#6b7280", cursor: "pointer", fontFamily: "inherit", display: "flex", alignItems: "center", gap: 6 }}>
              <span>{n.icon}</span>{n.label}
            </button>
          ))}
        </div>

        {/* Upcoming tab */}
        {tab === "upcoming" && (
          <div>
            <div style={{ background: "#fff", border: "0.5px solid #e5e7eb", borderRadius: 12, padding: "2rem", textAlign: "center" }}>
              <div style={{ fontSize: 48, marginBottom: "1rem" }}>📅</div>
              <p style={{ fontWeight: 600, fontSize: 16, color: "#111827", marginBottom: 8 }}>No upcoming rezzes</p>
              <p style={{ fontSize: 13, color: "#6b7280", marginBottom: "1.5rem", lineHeight: 1.6 }}>
                You don&apos;t have any bookings yet. Find a professional and make your first rez!
              </p>
              <Link href="/browse" style={{ background: "#2563eb", color: "#fff", padding: "10px 24px", borderRadius: 8, fontSize: 13, fontWeight: 500, textDecoration: "none", display: "inline-block" }}>
                Find a professional →
              </Link>
            </div>
          </div>
        )}

        {/* History tab */}
        {tab === "history" && (
          <div style={{ background: "#fff", border: "0.5px solid #e5e7eb", borderRadius: 12, padding: "2rem", textAlign: "center" }}>
            <div style={{ fontSize: 48, marginBottom: "1rem" }}>🕐</div>
            <p style={{ fontWeight: 600, fontSize: 16, color: "#111827", marginBottom: 8 }}>No booking history yet</p>
            <p style={{ fontSize: 13, color: "#6b7280", lineHeight: 1.6 }}>Your completed rezzes will appear here.</p>
          </div>
        )}

        {/* Favorites tab */}
        {tab === "favorites" && (
          <div style={{ background: "#fff", border: "0.5px solid #e5e7eb", borderRadius: 12, padding: "2rem", textAlign: "center" }}>
            <div style={{ fontSize: 48, marginBottom: "1rem" }}>❤️</div>
            <p style={{ fontWeight: 600, fontSize: 16, color: "#111827", marginBottom: 8 }}>No favorites yet</p>
            <p style={{ fontSize: 13, color: "#6b7280", marginBottom: "1.5rem", lineHeight: 1.6 }}>
              Save your favorite professionals for quick rebooking.
            </p>
            <Link href="/browse" style={{ background: "#2563eb", color: "#fff", padding: "10px 24px", borderRadius: 8, fontSize: 13, fontWeight: 500, textDecoration: "none", display: "inline-block" }}>
              Browse professionals →
            </Link>
          </div>
        )}

        {/* Loyalty tab */}
        {tab === "loyalty" && (
          <div>
            <div style={{ background: "#fff", border: "0.5px solid #e5e7eb", borderRadius: 12, padding: "1.5rem", textAlign: "center", marginBottom: 10 }}>
              <div style={{ fontSize: 48, marginBottom: ".75rem" }}>🥈</div>
              <p style={{ fontWeight: 700, fontSize: 18, color: "#111827", marginBottom: 4 }}>Silver tier</p>
              <p style={{ fontSize: 13, color: "#6b7280", marginBottom: "1rem" }}>0 points — make your first rez to start earning!</p>
              <div style={{ background: "#f3f4f6", borderRadius: 4, height: 8, maxWidth: 300, margin: "0 auto 1rem" }}>
                <div style={{ background: "#2563eb", borderRadius: 4, height: 8, width: "0%" }} />
              </div>
              <p style={{ fontSize: 12, color: "#9ca3af" }}>250 points to Gold tier</p>
            </div>
            <div style={{ background: "#fff", border: "0.5px solid #e5e7eb", borderRadius: 12, padding: "1.25rem" }}>
              <p style={{ fontWeight: 600, fontSize: 14, color: "#111827", marginBottom: "1rem" }}>How to earn points</p>
              <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
                {[["Make a rez", "+$1 per point", "📅"],["Leave a review", "+10 pts", "⭐"],["Refer a friend", "+100 pts", "👥"],["Birthday bonus", "+50 pts", "🎂"]].map(([label, pts, icon]) => (
                  <div key={label} style={{ display: "flex", alignItems: "center", gap: 10, padding: "8px 0", borderBottom: "0.5px solid #f3f4f6", fontSize: 13 }}>
                    <span style={{ fontSize: 18 }}>{icon}</span>
                    <span style={{ flex: 1 }}>{label}</span>
                    <span style={{ fontWeight: 600, color: "#2563eb" }}>{pts}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Profile tab */}
        {tab === "profile" && (
          <div style={{ background: "#fff", border: "0.5px solid #e5e7eb", borderRadius: 12, padding: "1.5rem", maxWidth: 480 }}>
            <p style={{ fontWeight: 600, fontSize: 15, color: "#111827", marginBottom: "1.25rem" }}>My profile</p>
            <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: "1.5rem", paddingBottom: "1.25rem", borderBottom: "0.5px solid #e5e7eb" }}>
              <div style={{ width: 52, height: 52, borderRadius: "50%", background: "#eff6ff", color: "#2563eb", display: "flex", alignItems: "center", justifyContent: "center", fontWeight: 700, fontSize: 18 }}>
                {initials}
              </div>
              <div>
                <p style={{ fontWeight: 600, fontSize: 15, color: "#111827" }}>{profile?.full_name || "—"}</p>
                <p style={{ fontSize: 13, color: "#6b7280" }}>{profile?.email}</p>
              </div>
            </div>
            {[["Full name", profile?.full_name || ""],["Email", profile?.email || ""],["Phone", profile?.phone || "Not added yet"]].map(([label, val]) => (
              <div key={label} style={{ marginBottom: "1rem" }}>
                <label style={{ fontSize: 12, color: "#6b7280", display: "block", marginBottom: 3 }}>{label}</label>
                <input defaultValue={val} style={{ width: "100%", padding: "9px 12px", border: "0.5px solid #d1d5db", borderRadius: 8, fontSize: 13, fontFamily: "inherit", outline: "none", boxSizing: "border-box" as const }} />
              </div>
            ))}
            <button style={{ background: "#2563eb", color: "#fff", border: "none", padding: "10px 20px", borderRadius: 8, fontSize: 13, fontWeight: 500, cursor: "pointer", fontFamily: "inherit" }}>
              Save changes
            </button>
            <button onClick={handleSignOut} style={{ background: "none", border: "0.5px solid #d1d5db", padding: "10px 20px", borderRadius: 8, fontSize: 13, cursor: "pointer", fontFamily: "inherit", color: "#374151", marginLeft: 8 }}>
              Sign out
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
