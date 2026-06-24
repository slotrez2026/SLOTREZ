"use client";

// ─────────────────────────────────────────────────────────────
// Slotrez — Auth callback client page
// Save to: src/app/auth/callback/page.tsx
// ─────────────────────────────────────────────────────────────

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";

export default function AuthCallbackPage() {
  const [status, setStatus] = useState("Signing you in...");

  useEffect(() => {
    async function handleCallback() {
      try {
        // Handle hash fragment from Google OAuth
        const hashParams = new URLSearchParams(
          window.location.hash.substring(1)
        );
        const accessToken = hashParams.get("access_token");
        const refreshToken = hashParams.get("refresh_token");

        if (accessToken && refreshToken) {
          setStatus("Setting up your session...");
          
          // Set the session using the tokens from the hash
          const { error } = await supabase.auth.setSession({
            access_token: accessToken,
            refresh_token: refreshToken,
          });

          if (error) {
            setStatus("Something went wrong. Redirecting...");
            setTimeout(() => { window.location.href = "/login"; }, 1500);
            return;
          }

          setStatus("Welcome to Slotrez! 🎉");
          
          // Use window.location.href instead of router.push
          // This forces a full page reload so the proxy picks up the new cookie
          setTimeout(() => { window.location.href = "/dashboard"; }, 800);
          return;
        }

        // No hash params — check if session already exists
        const { data: { session } } = await supabase.auth.getSession();
        
        if (session) {
          setStatus("Welcome back! 🎉");
          setTimeout(() => { window.location.href = "/dashboard"; }, 800);
          return;
        }

        // Nothing worked — back to login
        setStatus("Redirecting to login...");
        setTimeout(() => { window.location.href = "/login"; }, 1000);

      } catch (err) {
        console.error("Auth callback error:", err);
        window.location.href = "/login";
      }
    }

    handleCallback();
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
