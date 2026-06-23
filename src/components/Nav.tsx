"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

const NAV_LINKS = [
  { href: "/",        label: "Home"     },
  { href: "/browse",  label: "Discover" },
  { href: "/pricing", label: "Pricing"  },
  { href: "/about",   label: "About"    },
  { href: "/support", label: "Support"  },
  { href: "/ai",      label: "AI"       },
];

export default function Nav() {
  const pathname = usePathname();

  return (
    <nav
      style={{
        height: 52,
        background: "#fff",
        borderBottom: "0.5px solid #e5e7eb",
        display: "flex",
        alignItems: "center",
        padding: "0 1.5rem",
        gap: 4,
        position: "sticky",
        top: 0,
        zIndex: 50,
      }}
    >
      {/* Logo */}
      <Link
        href="/"
        style={{
          fontSize: 18,
          fontWeight: 700,
          letterSpacing: "-0.5px",
          textDecoration: "none",
          marginRight: 6,
        }}
      >
        <span style={{ color: "#1a1a2e" }}>slot</span>
        <span style={{ color: "#2563eb" }}>rez</span>
      </Link>

      {/* Links */}
      {NAV_LINKS.map((link) => {
        const active = pathname === link.href;
        return (
          <Link
            key={link.href}
            href={link.href}
            style={{
              background: active ? "#eff6ff" : "none",
              color: active ? "#2563eb" : "#6b7280",
              fontSize: 13,
              padding: "6px 10px",
              borderRadius: 7,
              textDecoration: "none",
              fontWeight: active ? 500 : 400,
            }}
          >
            {link.label}
          </Link>
        );
      })}

      {/* Auth buttons */}
      <div style={{ marginLeft: "auto", display: "flex", gap: 8 }}>
        <Link
          href="/login"
          style={{
            border: "0.5px solid #d1d5db",
            background: "none",
            padding: "7px 14px",
            borderRadius: 8,
            fontSize: 13,
            color: "#374151",
            textDecoration: "none",
          }}
        >
          Log in
        </Link>
        <Link
          href="/register"
          style={{
            background: "#1a1a2e",
            color: "#fff",
            padding: "7px 14px",
            borderRadius: 8,
            fontSize: 13,
            fontWeight: 500,
            textDecoration: "none",
          }}
        >
          Get started free
        </Link>
      </div>
    </nav>
  );
}
