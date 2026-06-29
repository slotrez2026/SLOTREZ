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
  id: string;
  full_name: string;
  email: string;
  phone: string;
  avatar_url: string;
}

interface Booking {
  id: string;
  booked_at: string;
  status: string;
  total_amount: number;
  notes: string;
  services: { name: string; duration_mins: number };
  businesses: { name: string };
}

// ── Shared styles ─────────────────────────────────────────────
const card: React.CSSProperties = {
  background: "#fff",
  border: "0.5px solid #e5e7eb",
  borderRadius: 12,
  padding: "1.25rem",
};

const btnPrimary: React.CSSProperties = {
  background: "#2563eb", color: "#fff", border: "none",
  padding: "9px 20px", borderRadius: 8, fontSize: 13,
  fontWeight: 500, cursor: "pointer", fontFamily: "inherit",
};

const btnOutline: React.CSSProperties = {
  background: "#fff", border: "0.5px solid #d1d5db", color: "#374151",
  padding: "9px 20px", borderRadius: 8, fontSize: 13,
  cursor: "pointer", fontFamily: "inherit",
};

const inputStyle: React.CSSProperties = {
  width: "100%", padding: "9px 12px",
  border: "0.5px solid #d1d5db", borderRadius: 8,
  fontSize: 13, fontFamily: "inherit",
  outline: "none", boxSizing: "border-box",
  background: "#fff", color: "#111827",
};

// ── Empty state ───────────────────────────────────────────────
function EmptyState({ icon, title, desc, action, href }: {
  icon: string; title: string; desc: string; action?: string; href?: string;
}) {
  return (
    <div style={{ ...card, textAlign: "center", padding: "3rem 2rem" }}>
      <div style={{ fontSize: 48, marginBottom: "1rem" }}>{icon}</div>
      <p style={{ fontWeight: 600, fontSize: 16, color: "#111827", marginBottom: 8 }}>{title}</p>
      <p style={{ fontSize: 13, color: "#6b7280", lineHeight: 1.7, marginBottom: action ? "1.5rem" : 0, maxWidth: 320, margin: "0 auto" }}>{desc}</p>
      {action && href && (
        <Link href={href} style={{ ...btnPrimary, display: "inline-block", textDecoration: "none", marginTop: "1.5rem" }}>
          {action}
        </Link>
      )}
    </div>
  );
}

export default function ClientPortalPage() {
  const [tab, setTab] = useState<Tab>("upcoming");
  const [profile, setProfile] = useState<Profile | null>(null);
  const [upcomingBookings, setUpcomingBookings] = useState<Booking[]>([]);
  const [pastBookings, setPastBookings] = useState<Booking[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);

  // Editable profile fields
  const [fullName, setFullName] = useState("");
  const [phone, setPhone] = useState("");

  useEffect(() => {
    async function load() {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) { window.location.href = "/login"; return; }

      // Load profile
      const { data: profileData } = await supabase
        .from("profiles")
        .select("id, full_name, email, phone, avatar_url")
        .eq("id", session.user.id)
        .single();

      const prof = profileData || {
        id: session.user.id,
        full_name: session.user.user_metadata?.full_name || "",
        email: session.user.email || "",
        phone: "",
        avatar_url: "",
      };

      setProfile(prof);
      setFullName(prof.full_name || "");
      setPhone(prof.phone || "");

      // Load bookings
      const now = new Date().toISOString();

      const { data: upcoming } = await supabase
        .from("bookings")
        .select("id, booked_at, status, total_amount, notes, services(name, duration_mins), businesses(name)")
        .eq("client_id", session.user.id)
        .gte("booked_at", now)
        .order("booked_at", { ascending: true });

      const { data: past } = await supabase
        .from("bookings")
        .select("id, booked_at, status, total_amount, notes, services(name, duration_mins), businesses(name)")
        .eq("client_id", session.user.id)
        .lt("booked_at", now)
        .order("booked_at", { ascending: false })
        .limit(20);

      setUpcomingBookings((upcoming as Booking[]) || []);
      setPastBookings((past as Booking[]) || []);
      setLoading(false);
    }
    load();
  }, []);

  async function handleSaveProfile() {
    if (!profile) return;
    setSaving(true);
    await supabase
      .from("profiles")
      .update({ full_name: fullName, phone })
      .eq("id", profile.id);
    setSaving(false);
    setSaved(true);
    setTimeout(() => setSaved(false), 2500);
  }

  async function handleSignOut() {
    await supabase.auth.signOut();
    window.location.href = "/";
  }

  const firstName = profile?.full_name?.split(" ")[0] || "there";
  const initials = profile?.full_name
    ? profile.full_name.split(" ").map((n: string) => n[0]).join("").toUpperCase().slice(0, 2)
    : "?";

  const TABS: { id: Tab; label: string; icon: string }[] = [
    { id: "upcoming",  label: "Upcoming",  icon: "📅" },
    { id: "history",   label: "History",   icon: "🕐" },
    { id: "favorites", label: "Favorites", icon: "❤️" },
    { id: "loyalty",   label: "Loyalty",   icon: "⭐" },
    { id: "profile",   label: "Profile",   icon: "👤" },
  ];

  if (loading) return (
    <div style={{ minHeight: "100vh", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", background: "#f9fafb", fontFamily: "system-ui,-apple-system,sans-serif", gap: 16 }}>
      <div style={{ fontSize: 24, fontWeight: 700 }}><span style={{ color: "#1a1a2e" }}>slot</span><span style={{ color: "#2563eb" }}>rez</span></div>
      <div style={{ width: 28, height: 28, border: "3px solid #e5e7eb", borderTop: "3px solid #2563eb", borderRadius: "50%", animation: "spin .8s linear infinite" }} />
      <style>{`@keyframes spin{to{transform:rotate(360deg)}}`}</style>
    </div>
  );

  return (
    <div style={{ minHeight: "100vh", background: "#f9fafb", fontFamily: "system-ui,-apple-system,sans-serif" }}>
      <div style={{ maxWidth: 860, margin: "0 auto", padding: "1.5rem" }}>

        {/* ── Header ── */}
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "1.5rem", flexWrap: "wrap", gap: 10 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
            <div style={{ width: 44, height: 44, borderRadius: "50%", background: "#eff6ff", color: "#2563eb", display: "flex", alignItems: "center", justifyContent: "center", fontWeight: 700, fontSize: 16, flexShrink: 0 }}>
              {initials}
            </div>
            <div>
              <p style={{ fontWeight: 700, fontSize: 16, color: "#111827" }}>Hey, {firstName}! 👋</p>
              <p style={{ fontSize: 12, color: "#6b7280" }}>{profile?.email}</p>
            </div>
          </div>
          <div style={{ display: "flex", gap: 8 }}>
            <Link href="/browse" style={{ ...btnPrimary, textDecoration: "none", display: "inline-block" }}>
              + Book a rez
            </Link>
            <button onClick={handleSignOut} style={btnOutline}>Sign out</button>
          </div>
        </div>

        {/* ── Tab nav ── */}
        <div style={{ display: "flex", gap: 6, marginBottom: "1.5rem", flexWrap: "wrap" }}>
          {TABS.map((t) => (
            <button key={t.id} onClick={() => setTab(t.id)}
              style={{ padding: "7px 14px", borderRadius: 20, fontSize: 13, border: "0.5px solid", borderColor: tab === t.id ? "#2563eb" : "#d1d5db", background: tab === t.id ? "#2563eb" : "#fff", color: tab === t.id ? "#fff" : "#6b7280", cursor: "pointer", fontFamily: "inherit", display: "flex", alignItems: "center", gap: 6 }}>
              <span>{t.icon}</span>{t.label}
            </button>
          ))}
        </div>

        {/* ── Upcoming tab ── */}
        {tab === "upcoming" && (
          <div>
            {upcomingBookings.length === 0 ? (
              <EmptyState
                icon="📅"
                title="No upcoming rezzes"
                desc="You don't have any bookings yet. Find a professional and make your first rez!"
                action="Find a professional →"
                href="/browse"
              />
            ) : (
              <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
                {upcomingBookings.map((b) => (
                  <div key={b.id} style={{ ...card, borderLeft: "3px solid #2563eb", borderRadius: "0 12px 12px 0" }}>
                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 10 }}>
                      <div>
                        <p style={{ fontWeight: 600, fontSize: 15, color: "#111827" }}>{b.services?.name}</p>
                        <p style={{ fontSize: 12, color: "#6b7280", marginTop: 2 }}>{b.businesses?.name}</p>
                        <p style={{ fontSize: 12, color: "#6b7280", marginTop: 4 }}>
                          {new Date(b.booked_at).toLocaleDateString("en-US", { weekday: "short", month: "short", day: "numeric" })} at {new Date(b.booked_at).toLocaleTimeString("en-US", { hour: "numeric", minute: "2-digit" })}
                        </p>
                      </div>
                      <div style={{ textAlign: "right" }}>
                        <span style={{ background: b.status === "confirmed" ? "#eaf3de" : "#faeeda", color: b.status === "confirmed" ? "#3b6d11" : "#854f0b", padding: "3px 10px", borderRadius: 20, fontSize: 11, fontWeight: 500 }}>
                          {b.status}
                        </span>
                        <p style={{ fontSize: 15, fontWeight: 600, color: "#111827", marginTop: 6 }}>${b.total_amount}</p>
                      </div>
                    </div>
                    <div style={{ display: "flex", gap: 8 }}>
                      <button style={{ ...btnOutline, fontSize: 12, padding: "6px 12px" }}>Reschedule</button>
                      <button style={{ ...btnOutline, fontSize: 12, padding: "6px 12px", color: "#ef4444", borderColor: "#fca5a5" }}>Cancel</button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* ── History tab ── */}
        {tab === "history" && (
          <div>
            {pastBookings.length === 0 ? (
              <EmptyState
                icon="🕐"
                title="No booking history yet"
                desc="Your completed rezzes will show up here after your first appointment."
                action="Book your first rez →"
                href="/browse"
              />
            ) : (
              <div style={{ ...card, padding: 0, overflow: "hidden" }}>
                <table style={{ width: "100%", borderCollapse: "collapse", fontSize: 13 }}>
                  <thead>
                    <tr style={{ borderBottom: "0.5px solid #e5e7eb", background: "#f9fafb" }}>
                      <th style={{ textAlign: "left", padding: "10px 16px", fontSize: 11, color: "#6b7280", fontWeight: 500 }}>Service</th>
                      <th style={{ textAlign: "left", padding: "10px 16px", fontSize: 11, color: "#6b7280", fontWeight: 500 }}>Business</th>
                      <th style={{ textAlign: "left", padding: "10px 16px", fontSize: 11, color: "#6b7280", fontWeight: 500 }}>Date</th>
                      <th style={{ textAlign: "left", padding: "10px 16px", fontSize: 11, color: "#6b7280", fontWeight: 500 }}>Amount</th>
                      <th style={{ padding: "10px 16px" }}></th>
                    </tr>
                  </thead>
                  <tbody>
                    {pastBookings.map((b) => (
                      <tr key={b.id} style={{ borderBottom: "0.5px solid #f3f4f6" }}>
                        <td style={{ padding: "10px 16px", fontWeight: 500, color: "#111827" }}>{b.services?.name}</td>
                        <td style={{ padding: "10px 16px", color: "#6b7280" }}>{b.businesses?.name}</td>
                        <td style={{ padding: "10px 16px", color: "#6b7280" }}>{new Date(b.booked_at).toLocaleDateString()}</td>
                        <td style={{ padding: "10px 16px", fontWeight: 500 }}>${b.total_amount}</td>
                        <td style={{ padding: "10px 16px" }}>
                          <button style={{ ...btnPrimary, fontSize: 11, padding: "5px 12px" }}>Rebook</button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        )}

        {/* ── Favorites tab ── */}
        {tab === "favorites" && (
          <EmptyState
            icon="❤️"
            title="No favorites yet"
            desc="Save your favorite professionals for quick rebooking. Heart any pro on the Discover page to add them here."
            action="Browse professionals →"
            href="/browse"
          />
        )}

        {/* ── Loyalty tab ── */}
        {tab === "loyalty" && (
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
            <div>
              <div style={{ ...card, textAlign: "center", marginBottom: 10 }}>
                <div style={{ fontSize: 52, marginBottom: ".75rem" }}>🥈</div>
                <p style={{ fontWeight: 700, fontSize: 20, color: "#111827", marginBottom: 4 }}>Silver tier</p>
                <p style={{ fontSize: 13, color: "#6b7280", marginBottom: "1rem" }}>Start booking to earn points!</p>
                <div style={{ fontSize: 32, fontWeight: 700, color: "#2563eb", marginBottom: 4 }}>0 pts</div>
                <div style={{ background: "#f3f4f6", borderRadius: 4, height: 8, margin: "0 auto 8px", maxWidth: 200 }}>
                  <div style={{ background: "#2563eb", borderRadius: 4, height: 8, width: "0%" }} />
                </div>
                <p style={{ fontSize: 12, color: "#9ca3af" }}>250 points to Gold tier</p>
              </div>
              <div style={{ ...card }}>
                <p style={{ fontWeight: 600, fontSize: 13, color: "#111827", marginBottom: "1rem" }}>How to earn</p>
                {[["Make a rez", "+$1 = 1 pt", "📅"], ["Leave a review", "+10 pts", "⭐"], ["Refer a friend", "+100 pts", "👥"], ["Birthday bonus", "+50 pts", "🎂"]].map(([l, v, i]) => (
                  <div key={l} style={{ display: "flex", alignItems: "center", gap: 10, padding: "8px 0", borderBottom: "0.5px solid #f3f4f6", fontSize: 13 }}>
                    <span style={{ fontSize: 18 }}>{i}</span>
                    <span style={{ flex: 1, color: "#374151" }}>{l}</span>
                    <span style={{ fontWeight: 600, color: "#2563eb" }}>{v}</span>
                  </div>
                ))}
              </div>
            </div>
            <div style={{ ...card }}>
              <p style={{ fontWeight: 600, fontSize: 13, color: "#111827", marginBottom: "1rem" }}>Loyalty tiers</p>
              {[
                { icon: "🥈", name: "Silver", range: "0–249 pts", perk: "5% off all rezzes", current: true },
                { icon: "🥇", name: "Gold", range: "250–599 pts", perk: "10% off + priority booking", current: false },
                { icon: "💎", name: "Platinum", range: "600+ pts", perk: "15% off + VIP waitlist", current: false },
              ].map((tier) => (
                <div key={tier.name} style={{ display: "flex", gap: 12, alignItems: "center", padding: "12px", borderRadius: 9, background: tier.current ? "#eff6ff" : "var(--color-background-secondary, #f9fafb)", marginBottom: 8, border: tier.current ? "0.5px solid #93c5fd" : "0.5px solid #e5e7eb" }}>
                  <span style={{ fontSize: 28, flexShrink: 0 }}>{tier.icon}</span>
                  <div style={{ flex: 1 }}>
                    <p style={{ fontWeight: 600, fontSize: 13, color: "#111827" }}>{tier.name} — {tier.range}</p>
                    <p style={{ fontSize: 12, color: "#6b7280", marginTop: 2 }}>{tier.perk}</p>
                  </div>
                  {tier.current && <span style={{ background: "#2563eb", color: "#fff", padding: "2px 8px", borderRadius: 20, fontSize: 10, fontWeight: 500, whiteSpace: "nowrap" }}>Current</span>}
                </div>
              ))}
            </div>
          </div>
        )}

        {/* ── Profile tab ── */}
        {tab === "profile" && (
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
            <div style={{ ...card }}>
              <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: "1.5rem", paddingBottom: "1.25rem", borderBottom: "0.5px solid #e5e7eb" }}>
                <div style={{ width: 52, height: 52, borderRadius: "50%", background: "#eff6ff", color: "#2563eb", display: "flex", alignItems: "center", justifyContent: "center", fontWeight: 700, fontSize: 18, flexShrink: 0 }}>
                  {initials}
                </div>
                <div>
                  <p style={{ fontWeight: 600, fontSize: 15, color: "#111827" }}>{profile?.full_name || "—"}</p>
                  <p style={{ fontSize: 12, color: "#6b7280" }}>Slotrez client</p>
                </div>
              </div>

              <div style={{ marginBottom: ".85rem" }}>
                <label style={{ fontSize: 12, color: "#6b7280", display: "block", marginBottom: 3 }}>Full name</label>
                <input value={fullName} onChange={(e) => setFullName(e.target.value)} style={inputStyle} />
              </div>
              <div style={{ marginBottom: ".85rem" }}>
                <label style={{ fontSize: 12, color: "#6b7280", display: "block", marginBottom: 3 }}>Email</label>
                <input value={profile?.email || ""} disabled style={{ ...inputStyle, background: "#f9fafb", color: "#9ca3af" }} />
              </div>
              <div style={{ marginBottom: "1.25rem" }}>
                <label style={{ fontSize: 12, color: "#6b7280", display: "block", marginBottom: 3 }}>Phone</label>
                <input value={phone} onChange={(e) => setPhone(e.target.value)} placeholder="(201) 555-0192" style={inputStyle} />
              </div>

              {saved && (
                <div style={{ background: "#eaf3de", border: "0.5px solid #b2d98a", borderRadius: 8, padding: "9px 12px", fontSize: 12, color: "#3b6d11", marginBottom: "1rem" }}>
                  ✓ Profile saved successfully!
                </div>
              )}

              <div style={{ display: "flex", gap: 8 }}>
                <button onClick={handleSaveProfile} disabled={saving} style={{ ...btnPrimary, opacity: saving ? 0.7 : 1 }}>
                  {saving ? "Saving..." : "Save changes"}
                </button>
                <button onClick={handleSignOut} style={btnOutline}>Sign out</button>
              </div>
            </div>

            <div style={{ ...card }}>
              <p style={{ fontWeight: 600, fontSize: 13, color: "#111827", marginBottom: "1rem" }}>Notification settings</p>
              {[
                ["SMS booking reminders", true],
                ["Email confirmations", true],
                ["Waitlist alerts", true],
                ["Loyalty updates", true],
                ["Promotional offers", false],
              ].map(([label, defaultOn]) => (
                <div key={label as string} style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "10px 0", borderBottom: "0.5px solid #f3f4f6", fontSize: 13 }}>
                  <span style={{ color: "#374151" }}>{label}</span>
                  <div style={{ width: 36, height: 20, borderRadius: 10, background: defaultOn ? "#2563eb" : "#e5e7eb", cursor: "pointer", position: "relative", flexShrink: 0 }}>
                    <div style={{ width: 14, height: 14, borderRadius: "50%", background: "#fff", position: "absolute", top: 3, left: defaultOn ? 19 : 3, transition: "left .15s" }} />
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
