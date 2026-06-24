// ─────────────────────────────────────────────────────────────
// Slotrez — Send OTP via Supabase + Twilio
// Save to: src/app/api/auth/send-otp/route.ts
// ─────────────────────────────────────────────────────────────

import { createClient } from "@supabase/supabase-js";
import { NextResponse } from "next/server";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

export async function POST(request: Request) {
  try {
    const { phone } = await request.json();

    if (!phone) {
      return NextResponse.json(
        { error: "Phone number is required" },
        { status: 400 }
      );
    }

    // Format to E.164 e.g. +12015550192
    const cleaned = phone.replace(/\D/g, "");
    const formatted = cleaned.startsWith("1")
      ? `+${cleaned}`
      : `+1${cleaned}`;

    const { error } = await supabase.auth.signInWithOtp({
      phone: formatted,
    });

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 400 });
    }

    // Return masked phone for display
    const masked = `(${cleaned.slice(-10, -7)}) ••• ${cleaned.slice(-4)}`;

    return NextResponse.json({
      success: true,
      phone: formatted,
      masked,
    });
  } catch (err) {
    console.error("send-otp error:", err);
    return NextResponse.json(
      { error: "Failed to send verification code" },
      { status: 500 }
    );
  }
}
