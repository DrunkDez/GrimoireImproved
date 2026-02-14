"use client"

import { useSiteSettings } from "@/hooks/use-site-settings"

export function GrimoireFooter() {
  const { settings, isLoading } = useSiteSettings()

  // Parse footer text into lines
  const footerLines = isLoading
    ? ["Loading..."]
    : settings.footerText.split('\n').filter(line => line.trim())

  return (
    <footer className="relative bg-card/80 backdrop-blur-md border-t-2 border-primary/20 py-8 px-6 text-center mt-auto">
      {/* Decorative top line */}
      <div
        className="absolute top-0 left-1/2 -translate-x-1/2 w-3/5 h-[2px]"
        style={{
          background: 'linear-gradient(90deg, transparent, hsl(var(--accent)), transparent)',
        }}
        aria-hidden="true"
      />

      <div className="max-w-4xl mx-auto space-y-2">
        {footerLines.map((line, index) => (
          <p 
            key={index}
            className={`font-mono ${
              index === 0 
                ? 'text-lg font-semibold text-primary dark:text-accent' 
                : 'text-sm text-muted-foreground'
            }`}
          >
            {line}
          </p>
        ))}
      </div>

      {/* Decorative Mage symbol */}
      <div className="mt-6 text-3xl text-primary/40 dark:text-accent/40 font-magebats" aria-hidden="true">
        a
      </div>
    </footer>
  )
}
