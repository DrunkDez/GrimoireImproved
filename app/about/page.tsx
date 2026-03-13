"use client"

import { useEffect, useState } from "react"
import { GrimoireHeader } from "@/components/grimoire-header"
import { GrimoireFooter } from "@/components/grimoire-footer"
import { Button } from "@/components/ui/button"
import { ArrowLeft } from "lucide-react"
import { useRouter } from "next/navigation"
import { MarkdownRenderer } from "@/components/ui/markdown-renderer"
import Image from "next/image"

interface AboutSettings {
  aboutOwnerTitle: string
  aboutOwnerText: string
  aboutOwnerImage: string
  aboutSiteTitle: string
  aboutSiteText: string
  aboutSectionOrder: string
}

export default function AboutPage() {
  const router = useRouter()
  const [settings, setSettings] = useState<AboutSettings>({
    aboutOwnerTitle: "About the Owner",
    aboutOwnerText: "",
    aboutOwnerImage: "",
    aboutSiteTitle: "About the Site",
    aboutSiteText: "",
    aboutSectionOrder: "owner,site"
  })
  const [isLoading, setIsLoading] = useState(true)
  const [imageError, setImageError] = useState(false)

  useEffect(() => {
    const fetchContent = async () => {
      try {
        const response = await fetch('/api/site-settings')
        if (response.ok) {
          const data = await response.json()
          setSettings({
            aboutOwnerTitle: data.aboutOwnerTitle || "About the Owner",
            aboutOwnerText: data.aboutOwnerText || "",
            aboutOwnerImage: data.aboutOwnerImage || "",
            aboutSiteTitle: data.aboutSiteTitle || "About the Site",
            aboutSiteText: data.aboutSiteText || "",
            aboutSectionOrder: data.aboutSectionOrder || "owner,site"
          })
        }
      } catch (error) {
        console.error('Error fetching about content:', error)
      } finally {
        setIsLoading(false)
      }
    }

    fetchContent()
  }, [])

  // Determine section order
  const sections = settings.aboutSectionOrder === "site,owner" 
    ? ['site', 'owner'] 
    : ['owner', 'site']

  const renderOwnerSection = () => (
    <div className="space-y-6" key="owner">
      <h2 className="font-serif text-2xl md:text-3xl font-black text-primary uppercase tracking-wide leading-tight pb-3 border-b-2 border-primary/30">
        {settings.aboutOwnerTitle}
      </h2>
      
      {settings.aboutOwnerImage && !imageError ? (
        <div className="flex flex-col md:flex-row gap-6 items-start">
          {/* Owner Image */}
          <div className="flex-shrink-0">
            <div className="relative w-32 h-32 md:w-40 md:h-40 rounded-lg overflow-hidden border-2 border-primary shadow-lg">
              <Image
                src={settings.aboutOwnerImage}
                alt="Site Owner"
                fill
                className="object-cover"
                onError={() => setImageError(true)}
              />
            </div>
          </div>
          
          {/* Owner Text */}
          <div className="flex-1 prose prose-sm dark:prose-invert max-w-none">
            <MarkdownRenderer content={settings.aboutOwnerText} />
          </div>
        </div>
      ) : (
        <div className="prose prose-sm dark:prose-invert max-w-none">
          <MarkdownRenderer content={settings.aboutOwnerText} />
        </div>
      )}
    </div>
  )

  const renderSiteSection = () => (
    <div className="space-y-6" key="site">
      <h2 className="font-serif text-2xl md:text-3xl font-black text-primary uppercase tracking-wide leading-tight pb-3 border-b-2 border-primary/30">
        {settings.aboutSiteTitle}
      </h2>
      
      <div className="prose prose-sm dark:prose-invert max-w-none">
        <MarkdownRenderer content={settings.aboutSiteText} />
      </div>
    </div>
  )

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

        <GrimoireHeader />

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

            {/* About content */}
            <div className="bg-card border-4 border-double border-primary rounded-lg p-8 md:p-12 shadow-[inset_0_0_60px_rgba(139,71,38,0.08)] space-y-12">
              <h1 className="font-serif text-3xl md:text-4xl font-black text-primary uppercase tracking-wide leading-tight pb-4 border-b-[3px] border-double border-primary">
                About The Paradox Wheel
              </h1>

              {isLoading ? (
                <div className="flex items-center justify-center py-12">
                  <div className="flex items-center gap-3">
                    <span className="text-2xl text-accent animate-spin">⚙</span>
                    <p className="text-muted-foreground">Loading...</p>
                  </div>
                </div>
              ) : (
                <>
                  {sections.map(section => 
                    section === 'owner' ? renderOwnerSection() : renderSiteSection()
                  )}
                </>
              )}
            </div>
          </div>
        </main>

        <GrimoireFooter />
      </div>
    </div>
  )
}