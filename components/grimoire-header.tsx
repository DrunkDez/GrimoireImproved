"use client"

import { UserNav } from "@/components/auth/user-nav"
import { ThemeToggle } from "@/components/theme-toggle"
import { ReaderModeToggle } from "@/components/reader-mode-toggle"
import { RandomLogo } from "@/components/random-logo"
import Link from "next/link"

// Safe decorative symbols — these render as text glyphs, not emoji
// ✦ (U+2726) is a text symbol, not in the emoji range — safe
// ℹ (U+2139) can go emoji on iOS — replaced with · below
const NAV_LINKS = [
  { href: "/about",   label: "About",   icon: "·"  },
  { href: "/credits", label: "Credits", icon: "✦"  },
  { href: "/wonders", label: "Wonders", icon: "✦"  },
]

export function GrimoireHeader() {
  return (
    <header className="relative bg-card overflow-hidden">

      {/* ── Atmospheric background ── */}
      <div className="absolute inset-0 pointer-events-none" aria-hidden="true">
        <div style={{
          position: "absolute", inset: 0,
          background: `
            radial-gradient(ellipse 55% 80% at 8% 50%,  hsl(280 55% 18% / 0.5) 0%, transparent 65%),
            radial-gradient(ellipse 30% 45% at 88% 20%, hsl(300 40% 20% / 0.15) 0%, transparent 55%)
          `,
        }} />

        {/* Hex grid */}
        <svg
          className="absolute inset-0 w-full h-full reader-hide"
          xmlns="http://www.w3.org/2000/svg"
          style={{ opacity: 0.03, mixBlendMode: "screen" }}
        >
          <defs>
            <pattern id="grimoire-hex" x="0" y="0" width="28" height="32" patternUnits="userSpaceOnUse">
              <polygon
                points="14,1 27,8 27,24 14,31 1,24 1,8"
                fill="none" stroke="hsl(280 70% 75%)" strokeWidth="0.6"
              />
            </pattern>
          </defs>
          <rect width="100%" height="100%" fill="url(#grimoire-hex)" />
        </svg>

        {/* Ghost wheel — desktop only, hidden on mobile to avoid emoji issues */}
        <div
          className="absolute animate-spin-slow select-none reader-hide hidden md:block"
          style={{
            top: "-90px", right: "-90px",
            fontSize: "340px", lineHeight: 1,
            color: "hsl(280 55% 65% / 0.04)",
            fontFamily: "serif",
            /* Force text rendering — prevent emoji substitution */
            fontVariantEmoji: "text",
          } as React.CSSProperties}
          aria-hidden="true"
        >
          {/* Unicode variation selector \uFE0E forces text rendering */}
          ⚙&#xFE0E;
        </div>
      </div>

      {/* ── Controls top-right ── */}
      <div className="absolute top-3 right-3 sm:top-4 sm:right-4 z-20 flex items-center gap-1 sm:gap-1.5">
        <div className="hidden sm:flex items-center gap-1 sm:gap-1.5">
          <ReaderModeToggle />
          <ThemeToggle />
        </div>
        <UserNav />
      </div>

      {/* Mobile controls */}
      <div className="sm:hidden absolute bottom-3 right-3 z-20 flex items-center gap-1">
        <ReaderModeToggle />
        <ThemeToggle />
      </div>

      {/* ── Main content ── */}
      <div className="relative z-10 px-5 sm:px-7 md:px-10 pt-7 sm:pt-9 pb-5 sm:pb-6">

        {/* Brand */}
        <Link href="/" className="inline-flex items-start gap-3 sm:gap-4 group mb-0.5">
          <div className="mt-1.5 shrink-0 opacity-70 group-hover:opacity-100 transition-opacity duration-300
            w-[44px] h-[44px] sm:w-[52px] sm:h-[52px] reader-hide">
            <RandomLogo />
          </div>

          <div>
            <p className="font-serif text-[9px] sm:text-[10px] uppercase tracking-[0.4em] text-primary/50 mb-0.5 pl-0.5 reader-hide">
              The
            </p>
            <h1
              className="font-serif font-black uppercase leading-[0.88] tracking-[0.07em] text-primary
                group-hover:text-primary/80 transition-colors duration-300"
              style={{ fontSize: "clamp(2rem, 5vw, 3.8rem)" }}
            >
              Paradox
            </h1>
            <div className="flex items-center gap-2 sm:gap-3 mt-0.5">
              <h1
                className="font-serif font-black uppercase leading-[0.88] tracking-[0.07em] text-primary
                  group-hover:text-primary/80 transition-colors duration-300"
                style={{ fontSize: "clamp(2rem, 5vw, 3.8rem)" }}
              >
                Wheel
              </h1>
              {/*
                ⚙ + \uFE0E variation selector forces text rendering on all platforms.
                font-variant-emoji: text does the same for modern browsers.
                The explicit width/height + line-height stops iOS from inflating it.
              */}
              <span
                className="text-accent animate-spin-slow shrink-0 reader-hide"
                style={{
                  fontSize:          "clamp(1.4rem, 3.2vw, 2.5rem)",
                  filter:            "drop-shadow(0 0 10px hsl(var(--accent) / 0.5))",
                  display:           "inline-block",
                  lineHeight:        1,
                  width:             "1em",
                  height:            "1em",
                  fontVariantEmoji:  "text",
                } as React.CSSProperties}
                aria-hidden="true"
              >
                ⚙&#xFE0E;
              </span>
            </div>
          </div>
        </Link>

        {/* Tagline */}
        <p
          className="font-mono text-[10px] sm:text-[11px] italic tracking-[0.18em]
            text-right pr-1 mt-2 mb-4 sm:mb-5 reader-hide"
          style={{ color: "hsl(var(--foreground) / 0.55)" }}
        >
          Where Reality Bends&nbsp;·&nbsp;Navigate the Spheres
        </p>

        {/* Hairline */}
        <div
          className="h-px mb-3 sm:mb-4 reader-hide"
          style={{
            width: "45%",
            background: "linear-gradient(90deg, hsl(var(--accent) / 0.5), hsl(var(--primary) / 0.3), transparent)",
          }}
          aria-hidden="true"
        />

        {/* Quick-access links — NO emoji, constrained icon size */}
        <div className="flex items-center gap-1.5 sm:gap-2 flex-wrap">
          {NAV_LINKS.map(link => (
            <Link
              key={link.href}
              href={link.href}
              className="inline-flex items-center gap-1 sm:gap-1.5 px-2.5 sm:px-3 py-1.5 rounded-md
                font-serif text-[10px] sm:text-[11px] uppercase tracking-[0.12em] font-semibold
                transition-all duration-200
                hover:bg-primary/[0.08]
                border border-transparent hover:border-primary/[0.18]"
              style={{ color: "hsl(var(--foreground) / 0.65)" }}
            >
              {/*
                Icon span: explicit 12px size + text rendering forces it to
                behave as a glyph, not an emoji on iOS/Android.
              */}
              <span
                aria-hidden="true"
                className="reader-hide"
                style={{
                  fontSize:         "12px",
                  lineHeight:       1,
                  width:            "12px",
                  height:           "12px",
                  display:          "inline-block",
                  fontVariantEmoji: "text",
                } as React.CSSProperties}
              >
                {link.icon}&#xFE0E;
              </span>
              {link.label}
            </Link>
          ))}
        </div>
      </div>

      {/* Bottom accent line */}
      <div
        className="h-[2px] w-full pointer-events-none"
        aria-hidden="true"
        style={{
          background: "linear-gradient(90deg, hsl(var(--accent) / 0.65) 0%, hsl(var(--primary) / 0.5) 12%, hsl(var(--primary) / 0.2) 50%, transparent 100%)",
          boxShadow: "0 1px 6px hsl(var(--primary) / 0.1)",
        }}
      />
    </header>
  )
}
