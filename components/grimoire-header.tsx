"use client"

import { UserNav } from "@/components/auth/user-nav"
import { ThemeToggle } from "@/components/theme-toggle"
import { RandomLogo } from "@/components/random-logo"
import Link from "next/link"

export function GrimoireHeader() {
  return (
    <header
      className="relative bg-card overflow-hidden"
      style={{ borderBottom: "1px solid hsl(var(--border) / 0.6)" }}
    >
      {/* ── Layered atmospheric background ── */}
      <div className="absolute inset-0 pointer-events-none" aria-hidden="true">
        {/* Purple ember — radiates from behind the logo */}
        <div style={{
          position: "absolute", inset: 0,
          background: `
            radial-gradient(ellipse 60% 75% at 10% 50%,  hsl(272 55% 18% / 0.5) 0%, transparent 65%),
            radial-gradient(ellipse 30% 40% at 85% 20%,  hsl(290 45% 20% / 0.2) 0%, transparent 55%)
          `,
        }} />

        {/* Hex grid texture — faint, same purple tone */}
        <svg
          className="absolute inset-0 w-full h-full opacity-[0.03]"
          xmlns="http://www.w3.org/2000/svg"
          style={{ mixBlendMode: "screen" }}
        >
          <defs>
            <pattern id="hex" x="0" y="0" width="28" height="32" patternUnits="userSpaceOnUse">
              <polygon
                points="14,1 27,8 27,24 14,31 1,24 1,8"
                fill="none"
                stroke="hsl(272 55% 70%)"
                strokeWidth="0.6"
              />
            </pattern>
          </defs>
          <rect width="100%" height="100%" fill="url(#hex)" />
        </svg>

        {/* Ghost wheel bleeding top-right — purple tint */}
        <div
          className="absolute animate-spin-slow select-none"
          style={{
            top: "-80px", right: "-80px",
            fontSize: "320px", lineHeight: 1,
            color: "hsl(272 55% 65% / 0.04)",
            fontFamily: "serif",
          }}
        >
          ⚙
        </div>
      </div>

      {/* ── Controls — top right ── */}
      <div className="absolute top-3 right-4 z-20 flex items-center gap-1.5">
        <ThemeToggle />
        <UserNav />
      </div>

      {/* ── Main content ── */}
      <div className="relative z-10 px-6 md:px-10 pt-8 pb-6">

        {/* Brand row */}
        <Link href="/" className="inline-flex items-start gap-4 group mb-1">
          <div className="mt-1.5 shrink-0 opacity-75 group-hover:opacity-100 transition-opacity duration-300 w-[52px] h-[52px]">
            <RandomLogo />
          </div>

          <div>
            <p className="font-serif text-[10px] uppercase tracking-[0.4em] text-primary/40 mb-0.5 pl-0.5">
              The
            </p>
            <h1
              className="font-serif font-black uppercase leading-[0.88] tracking-[0.07em] text-primary
                group-hover:text-primary/80 transition-colors duration-300"
              style={{ fontSize: "clamp(2.4rem, 5vw, 3.8rem)" }}
            >
              Paradox
            </h1>
            <div className="flex items-center gap-2.5 mt-0.5">
              <h1
                className="font-serif font-black uppercase leading-[0.88] tracking-[0.07em] text-primary
                  group-hover:text-primary/80 transition-colors duration-300"
                style={{ fontSize: "clamp(2.4rem, 5vw, 3.8rem)" }}
              >
                Wheel
              </h1>
              {/* Gold ⚙ — the one gold accent allowed in the header */}
              <span
                className="text-accent animate-spin-slow shrink-0"
                style={{
                  fontSize: "clamp(1.6rem, 3.5vw, 2.6rem)",
                  filter: "drop-shadow(0 0 10px hsl(var(--accent) / 0.5))",
                  display: "inline-block",
                }}
                aria-hidden="true"
              >
                ⚙
              </span>
            </div>
          </div>
        </Link>

        {/* Tagline — right-aligned */}
        <p className="font-mono text-[11px] italic tracking-[0.2em] text-muted-foreground/45
          text-right pr-1 mt-2 mb-5">
          Where Reality Bends&nbsp;·&nbsp;Navigate the Spheres
        </p>

        {/* Hairline rule — purple fade */}
        <div
          className="h-px w-1/2 mb-4"
          aria-hidden="true"
          style={{ background: "linear-gradient(90deg, hsl(var(--primary) / 0.45), transparent)" }}
        />

        {/* Quick-access — ghost chips */}
        <div className="flex items-center gap-1.5 flex-wrap">
          {[
            { href: "/about",        icon: "ℹ",  label: "About"          },
            { href: "/credits",      icon: "✦",  label: "Credits"        },
            { href: "/merits-flaws", icon: "✦",  label: "Merits & Flaws" },
            { href: "/recommended",  icon: "📚", label: "Resources"      },
          ].map(link => (
            <Link
              key={link.href}
              href={link.href}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-md
                font-serif text-[10px] uppercase tracking-[0.14em] font-semibold
                text-muted-foreground/55 hover:text-primary
                transition-all duration-200
                hover:bg-primary/[0.07]
                border border-transparent hover:border-primary/[0.15]"
            >
              <span className="text-[11px]" aria-hidden="true">{link.icon}</span>
              {link.label}
            </Link>
          ))}
        </div>
      </div>

      {/* ── Bottom accent line — purple left-to-right fade + gold spark at origin ── */}
      <div
        className="h-[2px] w-full pointer-events-none"
        aria-hidden="true"
        style={{
          background: "linear-gradient(90deg, hsl(var(--accent) / 0.6) 0%, hsl(var(--primary) / 0.5) 15%, hsl(var(--primary) / 0.2) 50%, transparent 100%)",
          boxShadow:  "0 1px 8px hsl(var(--primary) / 0.1)",
        }}
      />
    </header>
  )
}
