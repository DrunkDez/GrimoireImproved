export function GrimoireFooter() {
  return (
    <footer className="relative bg-secondary border-t-4 border-double border-primary px-6 py-8 text-center">
      {/* Top gold line */}
      <div
        className="absolute top-0 left-1/2 -translate-x-1/2 w-48 h-[2px]"
        style={{
          background: 'linear-gradient(90deg, transparent, hsl(42 42% 59%), transparent)',
        }}
        aria-hidden="true"
      />

      <p className="font-mono text-muted-foreground text-sm leading-relaxed mb-1">
        {'\u2726'} The Enlightened Grimoire {'\u2726'}
      </p>
      <p className="font-mono text-muted-foreground text-xs italic leading-relaxed mb-2">
        A Compendium of Awakened Knowledge
      </p>
      <p className="font-mono text-muted-foreground/60 text-xs italic">
        Mage: The Ascension is a trademark of Paradox Interactive AB.
        This is an unofficial fan project.
      </p>
    </footer>
  )
}
