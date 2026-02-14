"use client"

import { UserNav } from "@/components/auth/user-nav"
import { ThemeToggle } from "@/components/theme-toggle"
import Link from "next/link"
import { Button } from "@/components/ui/button"

export function GrimoireHeader() {
  return (
    <header className="relative bg-card/80 backdrop-blur-md px-6 py-12 text-center border-b-2 border-primary/20 shadow-lg">
      {/* Top Controls */}
      <div className="absolute top-4 right-6 z-20 flex items-center gap-2">
        <ThemeToggle />
        <UserNav />
      </div>

      {/* Top decorative line with gradient */}
      <div
        className="absolute top-4 left-1/2 -translate-x-1/2 w-3/5 h-[2px]"
        style={{
          background: 'linear-gradient(90deg, transparent, hsl(var(--accent)), transparent)',
        }}
        aria-hidden="true"
      />

      {/* Bottom decorative line */}
      <div
        className="absolute bottom-4 left-1/2 -translate-x-1/2 w-3/5 h-[2px]"
        style={{
          background: 'linear-gradient(90deg, transparent, hsl(var(--accent)), transparent)',
        }}
        aria-hidden="true"
      />

      <Link href="/" className="block hover:opacity-90 transition-all duration-300 group">
        <h1 className="font-serif text-4xl md:text-6xl font-black tracking-wider uppercase text-primary leading-tight mb-4 group-hover:scale-[1.02] transition-transform duration-300">
          <span className="inline-block mr-4 opacity-80 drop-shadow-[0_0_12px_rgba(180,120,200,0.6)] dark:drop-shadow-[0_0_20px_rgba(180,120,200,0.8)] animate-mystical-pulse text-5xl md:text-7xl">
            {'\u2726'}
          </span>
          The Enlightened Grimoire
        </h1>
      </Link>

      {/* Decorative underline with glow */}
      <div
        className="mx-auto w-48 h-[2px] mb-4 shadow-[0_0_8px_rgba(180,120,200,0.3)]"
        style={{
          background: 'linear-gradient(90deg, transparent, hsl(var(--primary)), transparent)',
        }}
        aria-hidden="true"
      />

      <p className="font-mono text-lg md:text-xl italic text-muted-foreground tracking-wide mb-6">
        A Compendium of Mystical Rotes for the Awakened
      </p>

      {/* Quick Access Links - Modernized */}
      <div className="flex justify-center gap-3 flex-wrap">
        <Link href="/merits-flaws">
          <Button 
            variant="outline" 
            size="sm" 
            className="gap-2 font-serif hover:bg-primary/10 hover:border-primary hover:scale-105 transition-all duration-300"
          >
            <span className="text-base">{'\u2726'}</span>
            Merits & Flaws
          </Button>
        </Link>
        <Link href="/recommended">
          <Button 
            variant="outline" 
            size="sm" 
            className="gap-2 font-serif hover:bg-primary/10 hover:border-primary hover:scale-105 transition-all duration-300"
          >
            <span className="text-base">{'\u{1F4DA}'}</span>
            Resources
          </Button>
        </Link>
      </div>
    </header>
  )
}
