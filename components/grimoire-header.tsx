"use client"

import { UserNav } from "@/components/auth/user-nav"
import { ThemeToggle } from "@/components/theme-toggle"
import { ReaderModeToggle } from "@/components/reader-mode-toggle"
import { RandomLogo } from "@/components/random-logo"
import Link from "next/link"
import { Button } from "@/components/ui/button"

export function GrimoireHeader() {
  return (
    <header className="relative bg-card px-3 sm:px-4 md:px-6 py-6 sm:py-8 md:py-12 text-center border-b-2 md:border-b-4 border-double border-primary">
      {/* Theme Toggle, Reader Mode & User Navigation - repositioned for mobile */}
      <div className="absolute top-2 right-2 sm:top-3 sm:right-4 md:top-4 md:right-6 z-20 flex items-center gap-1 sm:gap-2">
        <div className="hidden sm:flex items-center gap-1 sm:gap-2">
          <ReaderModeToggle />
          <ThemeToggle />
        </div>
        <UserNav />
      </div>

      {/* Mobile controls - bottom right to avoid overlap */}
      <div className="sm:hidden absolute bottom-2 right-2 z-20 flex items-center gap-1">
        <ReaderModeToggle />
        <ThemeToggle />
      </div>

      {/* Top gold line */}
      <div
        className="absolute top-2 sm:top-3 md:top-4 left-1/2 -translate-x-1/2 w-3/5 h-[2px] md:h-[3px] reader-hide"
        style={{
          background: 'linear-gradient(90deg, transparent, hsl(42 42% 59%), transparent)',
        }}
        aria-hidden="true"
      />

      {/* Bottom gold line */}
      <div
        className="absolute bottom-2 sm:bottom-3 md:bottom-4 left-1/2 -translate-x-1/2 w-3/5 h-[2px] md:h-[3px] reader-hide"
        style={{
          background: 'linear-gradient(90deg, transparent, hsl(42 42% 59%), transparent)',
        }}
        aria-hidden="true"
      />

      <Link href="/" className="block hover:opacity-80 transition-opacity">
        {/* Title with Wheel Symbol - add padding on mobile for auth buttons */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-3 sm:gap-4 md:gap-6 mb-3 sm:mb-4 pr-20 sm:pr-0">
          {/* Logo - hide on very small screens */}
          <div className="hidden sm:block reader-hide">
            <RandomLogo />
          </div>
          
          {/* Title - adjust size to fit */}
          <div className="flex items-center gap-2 sm:gap-3 md:gap-4 flex-wrap justify-center">
            <h1 className="font-serif text-xl xs:text-2xl sm:text-3xl md:text-4xl lg:text-6xl font-black tracking-wider uppercase text-primary leading-tight">
              The Paradox
            </h1>
            
            {/* Wheel - smaller on mobile */}
            <div className="relative flex items-center justify-center w-[35px] h-[35px] xs:w-[40px] xs:h-[40px] sm:w-[50px] sm:h-[50px] md:w-[60px] md:h-[60px] lg:w-[84px] lg:h-[84px]" aria-hidden="true">
              <div className="absolute inset-0 flex items-center justify-center text-2xl xs:text-3xl sm:text-4xl md:text-5xl lg:text-7xl text-accent animate-spin-slow">
                ⚙
              </div>
            </div>
            
            <h1 className="font-serif text-xl xs:text-2xl sm:text-3xl md:text-4xl lg:text-6xl font-black tracking-wider uppercase text-primary leading-tight">
              Wheel
            </h1>
          </div>
        </div>
      </Link>

      {/* Decorative underline */}
      <div
        className="mx-auto w-32 sm:w-40 md:w-48 h-[1px] md:h-[2px] mb-3 sm:mb-4 reader-hide"
        style={{
          background: 'linear-gradient(90deg, transparent, hsl(300 45% 30%), transparent)',
        }}
        aria-hidden="true"
      />

      {/* Tagline - smaller on mobile */}
      <p className="font-mono text-xs sm:text-sm md:text-lg lg:text-xl italic text-muted-foreground tracking-wide mb-4 sm:mb-5 md:mb-6 px-2">
        Where Reality Bends • Navigate the Spheres
      </p>

      {/* Quick Access Links - FIXED responsive behavior */}
      <div className="flex justify-center gap-2 sm:gap-3 flex-wrap max-w-full px-2">
        <Link href="/about">
          <Button variant="outline" size="sm" className="gap-1 sm:gap-2 font-serif text-xs sm:text-sm min-h-[40px] sm:min-h-[44px] px-2 sm:px-3">
            <span className="text-sm sm:text-base reader-hide">{'\u2139'}</span>
            About
          </Button>
        </Link>
        
        <Link href="/credits">
          <Button variant="outline" size="sm" className="gap-1 sm:gap-2 font-serif text-xs sm:text-sm min-h-[40px] sm:min-h-[44px] px-2 sm:px-3">
            <span className="text-sm sm:text-base reader-hide">{'\u2726'}</span>
            Credits
          </Button>
        </Link>
        
        <Link href="/merits-flaws">
          <Button variant="outline" size="sm" className="gap-1 sm:gap-2 font-serif text-xs sm:text-sm min-h-[40px] sm:min-h-[44px] px-2 sm:px-3">
            <span className="text-sm sm:text-base reader-hide">{'\u2726'}</span>
            Merits & Flaws
          </Button>
        </Link>
        
        <Link href="/wonders">
          <Button variant="outline" size="sm" className="gap-1 sm:gap-2 font-serif text-xs sm:text-sm min-h-[40px] sm:min-h-[44px] px-2 sm:px-3">
            <span className="text-sm sm:text-base reader-hide">{'\u2728'}</span>
            Wonders
          </Button>
        </Link>
        
        <Link href="/recommended">
          <Button variant="outline" size="sm" className="gap-1 sm:gap-2 font-serif text-xs sm:text-sm min-h-[40px] sm:min-h-[44px] px-2 sm:px-3">
            <span className="text-sm sm:text-base reader-hide">{'\u{1F4DA}'}</span>
            Resources
          </Button>
        </Link>
      </div>
    </header>
  )
}
