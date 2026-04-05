"use client"

import { UserNav } from "@/components/auth/user-nav"
import { ThemeToggle } from "@/components/theme-toggle"
import { RandomLogo } from "@/components/random-logo"
import Link from "next/link"
import { Button } from "@/components/ui/button"

export function GrimoireHeader() {
  return (
    <header className="relative bg-card overflow-hidden border-b-4 border-double border-primary">

      {/* ── Atmospheric background layers ── */}
      <div
        className="absolute inset-0 pointer-events-none"
        aria-hidden="true"
        style={{
          background: `
            radial-gradient(ellipse 70% 80% at 15% 50%, hsl(var(--glow-primary, 8 55% 20%) / 0.12) 0%, transparent 65%),
            radial-gradient(ellipse 40% 60% at 85% 20%, hsl(var(--arcane-purple, 290 35% 25%) / 0.08) 0%, transparent 55%)
          `,
        }}
      />

      {/* ── Oversized wheel — bleeds top-right, purely atmospheric ── */}
      <div
        className="absolute -top-12 -right-12 text-[220px] md:text-[300px] leading-none
          text-primary/[0.04] dark:text-accent/[0.05]
          animate-spin-slow select-none pointer-events-none"
        aria-hidden="true"
        style={{ fontFamily: 'serif' }}
      >
        ⚙
      </div>

      {/* ── Top ornamental line ── */}
      <div
        className="absolute top-0 left-0 right-0 h-[2px] pointer-events-none"
        aria-hidden="true"
        style={{
          background: 'linear-gradient(90deg, hsl(var(--accent)) 0%, hsl(var(--accent) / 0.4) 40%, transparent 75%)',
        }}
      />

      {/* ── Controls — top right ── */}
      <div className="absolute top-4 right-5 z-20 flex items-center gap-2">
        <ThemeToggle />
        <UserNav />
      </div>

      {/* ── Main header content — asymmetric ── */}
      <div className="relative z-10 px-6 md:px-10 pt-10 pb-8">

        {/* Row 1: logo + stacked title (left-anchored) */}
        <Link href="/" className="inline-flex items-start gap-5 group mb-1">
          {/* Random logo sits high-left */}
          <div className="mt-1 shrink-0 opacity-80 group-hover:opacity-100 transition-opacity">
            <RandomLogo />
          </div>

          <div>
            {/* Superscript "THE" in small caps above the main title */}
            <p className="font-serif text-xs md:text-sm uppercase tracking-[0.35em] text-accent/70 mb-0.5 pl-0.5">
              The
            </p>

            {/* Main title: large, left-anchored */}
            <h1
              className="font-serif text-5xl md:text-7xl font-black uppercase leading-[0.9] tracking-[0.08em] text-primary
                group-hover:text-primary/80 transition-colors"
              style={{
                textShadow: 'var(--tw-shadow, 0 2px 12px rgba(0,0,0,0.4))',
              }}
            >
              Paradox
            </h1>

            {/* "Wheel" on next line with the spinning glyph inline */}
            <div className="flex items-center gap-3">
              <h1 className="font-serif text-5xl md:text-7xl font-black uppercase leading-[0.9] tracking-[0.08em] text-primary
                group-hover:text-primary/80 transition-colors">
                Wheel
              </h1>
              {/* Active, correctly-sized wheel symbol */}
              <span
                className="text-4xl md:text-5xl text-accent animate-spin-slow drop-shadow-[0_0_12px_hsl(var(--accent)/0.6)]"
                aria-hidden="true"
              >
                ⚙
              </span>
            </div>
          </div>
        </Link>

        {/* Row 2: tagline — pushed right to break axis */}
        <p
          className="font-mono text-sm md:text-base italic text-muted-foreground tracking-[0.18em]
            text-right pr-2 mt-3 mb-6"
          style={{ letterSpacing: '0.18em' }}
        >
          Where Reality Bends&nbsp;•&nbsp;Navigate the Spheres
        </p>

        {/* Bottom ornamental rule — partial width, left-anchored */}
        <div
          className="h-[1px] w-2/3 mb-5"
          aria-hidden="true"
          style={{
            background: 'linear-gradient(90deg, hsl(var(--accent) / 0.7), hsl(var(--accent) / 0.2), transparent)',
          }}
        />

        {/* Row 3: quick-access links */}
        <div className="flex items-center gap-2 flex-wrap">
          <Link href="/about">
            <Button variant="outline" size="sm" className="gap-1.5 font-serif text-xs uppercase tracking-widest">
              <span className="text-sm" aria-hidden="true">ℹ</span>
              About
            </Button>
          </Link>
          <Link href="/credits">
            <Button variant="outline" size="sm" className="gap-1.5 font-serif text-xs uppercase tracking-widest">
              <span className="text-sm" aria-hidden="true">✦</span>
              Credits
            </Button>
          </Link>
          <Link href="/merits-flaws">
            <Button variant="outline" size="sm" className="gap-1.5 font-serif text-xs uppercase tracking-widest">
              <span className="text-sm" aria-hidden="true">✦</span>
              Merits & Flaws
            </Button>
          </Link>
          <Link href="/recommended">
            <Button variant="outline" size="sm" className="gap-1.5 font-serif text-xs uppercase tracking-widest">
              <span className="text-sm" aria-hidden="true">📚</span>
              Resources
            </Button>
          </Link>
        </div>
      </div>

      {/* ── Bottom ornamental border ── */}
      <div
        className="h-[3px] w-full pointer-events-none"
        aria-hidden="true"
        style={{
          background: `linear-gradient(90deg,
            hsl(var(--accent)) 0%,
            hsl(var(--accent) / 0.6) 20%,
            hsl(290 35% 40% / 0.4) 50%,
            hsl(var(--accent) / 0.6) 80%,
            transparent 100%
          )`,
          boxShadow: '0 1px 4px hsl(var(--accent) / 0.25)',
        }}
      />
    </header>
  )
}
