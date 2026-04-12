"use client"

import { useSiteSettings } from "@/hooks/use-site-settings"
import { MarkdownRenderer } from "@/components/ui/markdown-renderer"
import Link from "next/link"

export function GrimoireFooter() {
  const { settings, isLoading } = useSiteSettings()

  return (
    <footer className="relative bg-card/80 backdrop-blur-md border-t-2 border-primary/20 py-4 sm:py-6 md:py-8 px-3 sm:px-4 md:px-6 text-center mt-auto">
      {/* Decorative top line */}
      <div
        className="absolute top-0 left-1/2 -translate-x-1/2 w-3/5 h-[1px] md:h-[2px]"
        style={{
          background: 'linear-gradient(90deg, transparent, hsl(var(--accent)), transparent)',
        }}
        aria-hidden="true"
      />

      <div className="max-w-4xl mx-auto space-y-3 sm:space-y-4">
        {isLoading ? (
          <p className="font-mono text-xs sm:text-sm text-muted-foreground">
            Turning the Wheel...
          </p>
        ) : (
          <div className="prose prose-xs sm:prose-sm dark:prose-invert mx-auto text-center">
            <MarkdownRenderer content={settings.footerText} />
          </div>
        )}
        
        {/* Contact Link */}
        <div className="pt-1 sm:pt-2">
          <Link 
            href="/contact" 
            className="text-xs sm:text-sm text-muted-foreground hover:text-primary transition-colors underline"
          >
            Contact Us
          </Link>
        </div>
      </div>

      {/* Decorative Wheel symbol - smaller on mobile */}
      <div className="mt-4 sm:mt-6 flex items-center justify-center gap-2 sm:gap-3">
        <span className="text-xl sm:text-2xl md:text-3xl text-primary/40 dark:text-accent/40 font-magebats" aria-hidden="true">
          a
        </span>
        <span className="text-xl sm:text-2xl md:text-3xl text-primary/40 dark:text-accent/40 animate-spin-slow" aria-hidden="true">
          ⚙
        </span>
        <span className="text-xl sm:text-2xl md:text-3xl text-primary/40 dark:text-accent/40 font-magebats" aria-hidden="true">
          a
        </span>
      </div>
    </footer>
  )
}
