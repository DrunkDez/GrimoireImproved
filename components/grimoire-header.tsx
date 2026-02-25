"use client"

import { UserNav } from "@/components/auth/user-nav"
import { ThemeToggle } from "@/components/theme-toggle"
import { RandomLogo } from "@/components/random-logo"
import Link from "next/link"
import { Button } from "@/components/ui/button"

export function GrimoireHeader() {
  return (
    <header className="relative bg-card px-6 py-12 text-center border-b-4 border-double border-primary">
      {/* Theme Toggle & User Navigation - Top Right */}
      <div className="absolute top-4 right-6 z-20 flex items-center gap-2">
        <ThemeToggle />
        <UserNav />
      </div>

      {/* Top gold line */}
      <div
        className="absolute top-4 left-1/2 -translate-x-1/2 w-3/5 h-[3px]"
        style={{
          background: 'linear-gradient(90deg, transparent, hsl(42 42% 59%), transparent)',
        }}
        aria-hidden="true"
      />

      {/* Bottom gold line */}
      <div
        className="absolute bottom-4 left-1/2 -translate-x-1/2 w-3/5 h-[3px]"
        style={{
          background: 'linear-gradient(90deg, transparent, hsl(42 42% 59%), transparent)',
        }}
        aria-hidden="true"
      />

      <Link href="/" className="block hover:opacity-80 transition-opacity">
        {/* Random Logo + Title with Wheel Symbol */}
        <div className="flex items-center justify-center gap-6 mb-4">
          <RandomLogo />
          <div className="flex items-center gap-4">
            <h1 className="font-serif text-4xl md:text-6xl font-black tracking-wider uppercase text-primary leading-tight">
              The Paradox
            </h1>
            <div className="text-5xl md:text-7xl text-accent animate-spin-slow" aria-hidden="true">
              ⚙
            </div>
            <h1 className="font-serif text-4xl md:text-6xl font-black tracking-wider uppercase text-primary leading-tight">
              Wheel
            </h1>
          </div>
        </div>
      </Link>

      {/* Decorative underline */}
      <div
        className="mx-auto w-48 h-[2px] mb-4"
        style={{
          background: 'linear-gradient(90deg, transparent, hsl(300 45% 30%), transparent)',
        }}
        aria-hidden="true"
      />

      <p className="font-mono text-lg md:text-xl italic text-muted-foreground tracking-wide mb-6">
        Where Reality Bends • Navigate the Spheres
      </p>

      {/* Quick Access Links */}
      <div className="flex justify-center gap-3 flex-wrap">
        <Link href="/about">
          <Button variant="outline" size="sm" className="gap-2 font-serif">
            <span className="text-base">{'\u2139'}</span>
            About
          </Button>
        </Link>
        <Link href="/credits">
          <Button variant="outline" size="sm" className="gap-2 font-serif">
            <span className="text-base">{'\u2726'}</span>
            Credits
          </Button>
        </Link>
        <Link href="/merits-flaws">
          <Button variant="outline" size="sm" className="gap-2 font-serif">
            <span className="text-base">{'\u2726'}</span>
            Merits & Flaws
          </Button>
        </Link>
        <Link href="/recommended">
          <Button variant="outline" size="sm" className="gap-2 font-serif">
            <span className="text-base">{'\u{1F4DA}'}</span>
            Resources
          </Button>
        </Link>
      </div>
    </header>
  )
}
