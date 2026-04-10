import { Wonder, getCategoryIcon, formatWonderSpheres } from '@/lib/wonder-data'
import { Button } from '@/components/ui/button'
import { ShareButton } from '@/components/share-button'
import { ExternalLink } from 'lucide-react'
import Link from 'next/link'

interface WonderCardProps {
  wonder: Wonder
  onSelect?: (wonder: Wonder) => void
}

export function WonderCard({ wonder, onSelect }: WonderCardProps) {
  const categoryIcon = getCategoryIcon(wonder.category)
  const spheresText = formatWonderSpheres(wonder.spheres)

  return (
    <div className="bg-card border-2 border-primary/30 rounded-lg p-4 hover:border-primary/60 transition-colors">
      {/* Header */}
      <div className="flex items-start justify-between mb-3">
        <div className="flex-1">
          <div className="flex items-center gap-2 mb-1">
            <span className="text-xl" aria-hidden="true">{categoryIcon}</span>
            <h3 className="font-serif text-lg font-semibold text-foreground">
              {wonder.name}
            </h3>
          </div>
          <div className="flex flex-wrap items-center gap-2 text-sm text-muted-foreground">
            <span className="font-medium">{wonder.category}</span>
            {wonder.arete && (
              <>
                <span>•</span>
                <span>Arete {wonder.arete}</span>
              </>
            )}
            {wonder.backgroundCost && (
              <>
                <span>•</span>
                <span>Background {wonder.backgroundCost}</span>
              </>
            )}
          </div>
        </div>
      </div>

      {/* Spheres */}
      {wonder.spheres && (
        <div className="mb-3">
          <div className="text-sm text-muted-foreground">
            <span className="font-medium">Required Spheres:</span> {spheresText}
          </div>
        </div>
      )}

      {/* Quintessence */}
      {wonder.quintessence !== null && (
        <div className="mb-3 text-sm text-muted-foreground">
          <span className="font-medium">Quintessence:</span> {wonder.quintessence}
        </div>
      )}

      {/* Description Preview */}
      <p className="text-sm text-muted-foreground line-clamp-3 mb-4">
        {wonder.description}
      </p>

      {/* Actions */}
      <div className="flex items-center gap-2">
        <Link href={`/wonders/${wonder.id}`}>
          <Button variant="outline" size="sm" className="gap-2">
            <ExternalLink className="w-3 h-3" />
            View Details
          </Button>
        </Link>
        <ShareButton
          url={`${typeof window !== 'undefined' ? window.location.origin : ''}/wonders/${wonder.id}`}
          title={`Check out this wonder: ${wonder.name}`}
        />
      </div>

      {/* Page Reference */}
      {wonder.pageRef && (
        <div className="mt-3 pt-3 border-t border-primary/20 text-xs text-muted-foreground">
          {wonder.pageRef}
        </div>
      )}
    </div>
  )
}