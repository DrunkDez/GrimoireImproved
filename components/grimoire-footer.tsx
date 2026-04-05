"use client"

import { useSiteSettings } from "@/hooks/use-site-settings"
import { MarkdownRenderer } from "@/components/ui/markdown-renderer"
import Link from "next/link"

export function GrimoireFooter() {
  const { settings, isLoading } = useSiteSettings()

  return (
    <footer
      className="relative mt-auto px-6 py-8 text-center overflow-hidden"
      style={{
        background: 'linear-gradient(180deg, transparent 0%, hsl(var(--card) / 0.5) 100%)',
        backdropFilter: 'blur(8px)',
        WebkitBackdropFilter: 'blur(8px)',
        borderTop: '1px solid hsl(var(--border) / 0.5)',
      }}
    >
      {/* Top gradient rule */}
      <div
        className="absolute top-0 left-1/2 -translate-x-1/2 w-2/5 h-px pointer-events-none"
        aria-hidden="true"
        style={{
          background: 'linear-gradient(90deg, transparent, hsl(var(--accent) / 0.4), transparent)',
        }}
      />

      {/* Ambient corner glow */}
      <div
        className="absolute bottom-0 left-1/2 -translate-x-1/2 w-64 h-24 pointer-events-none"
        aria-hidden="true"
        style={{
          background: 'radial-gradient(ellipse, hsl(var(--accent) / 0.04) 0%, transparent 70%)',
        }}
      />

      <div className="relative z-10 max-w-2xl mx-auto space-y-4">
        {isLoading ? (
          <p className="font-serif text-xs text-muted-foreground tracking-widest uppercase animate-pulse">
            Turning the Wheel…
          </p>
        ) : (
          <div className="prose prose-sm dark:prose-invert mx-auto text-center opacity-70">
            <MarkdownRenderer content={settings.footerText} />
          </div>
        )}

        {/* Contact */}
        <div>
          <Link
            href="/contact"
            className="inline-flex items-center gap-1.5 text-xs text-muted-foreground/60
              hover:text-accent transition-colors duration-200 font-serif tracking-wider uppercase"
          >
            Contact Us
          </Link>
        </div>

        {/* Wheel mark — small, refined */}
        <div className="flex items-center justify-center gap-3 pt-1 opacity-30">
          <span className="text-lg font-magebats text-primary" aria-hidden="true">a</span>
          <span className="text-lg text-accent animate-spin-slow" aria-hidden="true">⚙</span>
          <span className="text-lg font-magebats text-primary" aria-hidden="true">a</span>
        </div>
      </div>
    </footer>
  )
}
