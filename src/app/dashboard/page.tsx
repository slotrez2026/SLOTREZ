"use client";

// ─────────────────────────────────────────────────────────────
// Slotrez — Dashboard router
// Save to: src/app/dashboard/page.tsx
// ─────────────────────────────────────────────────────────────

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";

export default function DashboardPage() {
  const [status, setStatus] = useState("Loading your account...");

  useEffect(() => {
    async function redirect() {
      try {
        // Get current user from client-side session
        const { data: { session }, error: sessionError } = await supabase.auth.getSession();

        if (sessionError || !session) {
          setStatus("Not logged in — redirecting...");
          setTimeout(() => { window.location.href = "/login"; }, 1000);
          return;
        }

        const user = session.user;
        setStatus(`Welcome${user.user_metadata?.full_name ? ", " + user.user_metadata.full_name.split(" ")[0] : ""}! 👋`);

        // Try to get existing profile
        const { data: profile, error: profileError } = await supabase
          .from("profiles")
          .select("role, onboarding_complete, full_name")
          .eq("id", user.id)
          .single();

        // No profile yet — create one now
        if (profileError || !profile) {
          setStatus("Setting up your account...");

          const { error: insertError } = await supabase
            .from("profiles")
            .upsert({
              id: user.id,
              email: user.email,
              full_name: user.user_metadata?.full_name || user.user_metadata?.name || "",
              role: "client",
              onboarding_complete: false,
            });

          if (insertError) {
            console.error("Profile insert error:", insertError);
          }

          setStatus("Account ready! Redirecting...");
          setTimeout(() => { window.location.href = "/onboarding"; }, 800);
          return;
        }

        // Profile exists — route by role
        const adminEmail = process.env.NEXT_PUBLIC_ADMIN_EMAIL;
        setStatus("Taking you to your dashboard...");

        await new Promise((r) => setTimeout(r, 600));

        if (user.email === adminEmail) {
          window.location.href = "/admin";
        } else if (profile.role === "owner" || profile.role === "staff") {
          if (!profile.onboarding_complete) {
            window.location.href = "/onboarding";
          } else {
            window.location.href = "/portal/business";
          }
        } else {
          window.location.href = "/portal/client";
        }

      } catch (err) {
        console.error("Dashboard error:", err);
        setStatus("Something went wrong. Redirecting...");
        setTimeout(() => { window.location.href = "/login"; }, 1500);
      }
    }

    // Small delay to let session cookie settle
    setTimeout(redirect, 500);
  }, []);

  return (
    <div style={{
      minHeight: "100vh",
      display: "flex",
      flexDirection: "column",
      alignItems: "center",
      justifyContent: "center",
      background: "#f9fafb",
      fontFamily: "system-ui, -apple-system, sans-serif",
      gap: 16,
    }}>
      <div style={{ fontSize: 28, fontWeight: 700, letterSpacing: "-0.5px" }}>
        <span style={{ color: "#1a1a2e" }}>slot</span>
        <span style={{ color: "#2563eb" }}>rez</span>
      </div>
      <div style={{
        width: 32, height: 32,
        border: "3px solid #e5e7eb",
        borderTop: "3px solid #2563eb",
        borderRadius: "50%",
        animation: "spin 0.8s linear infinite",
      }} />
      <p style={{ fontSize: 14, color: "#6b7280" }}>{status}</p>
      <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
    </div>
  );
}
