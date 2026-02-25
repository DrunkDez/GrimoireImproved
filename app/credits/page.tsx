"use client"

import { useEffect, useState } from "react"
import { ParadoxWheelHeader } from "@/components/paradox-wheel-header"
import { ParadoxWheelFooter } from "@/components/paradox-wheel-footer"
import { Button } from "@/components/ui/button"
import { ArrowLeft } from "lucide-react"
import { useRouter } from "next/navigation"

export default function CreditsPage() {
  const router = useRouter()
  const [content, setContent] = useState("")
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const fetchContent = async () => {
      try {
        const response = await fetch('/api/site-settings')
        if (response.ok) {
          const settings = await response.json()
          setContent(settings.creditsPage || "Created with passion for the Mage: The Ascension community.")
        }
      } catch (error) {
        console.error('Error fetching credits content:', error)
      } finally {
        setIsLoading(false)
      }
    }

    fetchContent()
  }, [])

  return (
    <div className="min-h-screen relative z-[1] py-6 px-3 md:py-8 md:px-4">
      <div className="max-w-[1400px] mx-auto bg-background border-[3px] border-primary rounded-lg overflow-hidden relative shadow-[0_0_0_1px_hsl(42_42%_59%),0_0_0_8px_hsl(36_42%_88%),0_0_0_11px_hsl(300_45%_20%),inset_0_0_80px_rgba(139,71,38,0.08),0_14px_40px_rgba(26,21,16,0.25)]">
        
        {/* Top ornamental border */}
        <div
          className="h-1 w-full"
          style={{
            background: 'linear-gradient(90deg, transparent 0%, hsl(42 42% 59%) 10%, hsl(300 45% 30%) 30%, hsl(42 42% 59%) 50%, hsl(300 45% 30%) 70%, hsl(42 42% 59%) 90%, transparent 100%)',
            boxShadow: '0 1px 3px rgba(107,45,107,0.5)',
          }}
          aria-hidden="true"
        />

        <ParadoxWheelHeader />

        <main className="min-h-[500px] p-6 md:p-10">
          <div className="max-w-4xl mx-auto">
            {/* Back button */}
            <Button
              variant="ghost"
              onClick={() => router.back()}
              className="mb-6"
            >
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back
            </Button>

            {/* Credits content */}
            <div className="bg-card border-4 border-double border-primary rounded-lg p-8 md:p-12 shadow-[inset_0_0_60px_rgba(139,71,38,0.08)]">
              <h1 className="font-serif text-3xl md:text-4xl font-black text-primary uppercase tracking-wide leading-tight mb-8 pb-4 border-b-[3px] border-double border-primary">
                Credits & Acknowledgments
              </h1>

              {isLoading ? (
                <div className="flex items-center justify-center py-12">
                  <div className="flex items-center gap-3">
                    <span className="text-2xl text-accent animate-spin">⚙</span>
                    <p className="text-muted-foreground">Loading...</p>
                  </div>
                </div>
              ) : (
                <div className="prose prose-lg max-w-none">
                  {content.split('\n\n').map((paragraph, index) => (
                    <p key={index} className="font-mono text-foreground text-base leading-relaxed mb-4">
                      {paragraph}
                    </p>
                  ))}
                </div>
              )}
            </div>
          </div>
        </main>

        <ParadoxWheelFooter />
      </div>
    </div>
  )
}
