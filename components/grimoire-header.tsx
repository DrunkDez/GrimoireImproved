"use client"

import { UserNav } from "@/components/auth/user-nav"
import Link from "next/link"
import { Button } from "@/components/ui/button"

export function GrimoireHeader() {
  return (
    <header className="relative bg-card px-6 py-12 text-center border-b-4 border-double border-primary">
      {/* User Navigation - Top Right */}
      <div className="absolute top-4 right-6 z-20">
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
        <h1 className="font-serif text-4xl md:text-6xl font-black tracking-wider uppercase text-primary leading-tight mb-4">
          The Enlightened Grimoire
        </h1>
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
        A Compendium of Mystical Rotes for the Awakened
      </p>

      {/* Quick Access Links */}
      <div className="flex justify-center gap-3 flex-wrap">
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
