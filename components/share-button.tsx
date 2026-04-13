"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Share2, Check, Loader2 } from "lucide-react"
import { useToast } from "@/hooks/use-toast"

interface ShareButtonProps {
  url: string
  title: string
  variant?: "default" | "outline" | "ghost"
  size?: "default" | "sm" | "lg" | "icon"
  className?: string
}

export function ShareButton({ 
  url, 
  title, 
  variant = "outline", 
  size = "default",
  className = ""
}: ShareButtonProps) {
  const { toast } = useToast()
  const [status, setStatus] = useState<"idle" | "loading" | "success">("idle")

  const handleShare = async () => {
    // Prevent multiple simultaneous actions
    if (status === "loading") return

    // Build absolute URL safely (always runs on client)
    const fullUrl = `${window.location.origin}${url.startsWith("/") ? url : `/${url}`}`

    setStatus("loading")

    try {
      // Prefer native Web Share API if available (mobile/desktop supported)
      if (navigator.share && window.isSecureContext) {
        await navigator.share({
          title: title,
          url: fullUrl,
        })
        // User completed share – no toast needed (browser handles feedback)
      } else {
        // Fallback: copy to clipboard
        await navigator.clipboard.writeText(fullUrl)
        toast({
          title: "Link Copied!",
          description: `${title} can now be shared.`,
        })
      }
      
      setStatus("success")
      // Reset after 2 seconds
      setTimeout(() => setStatus("idle"), 2000)
    } catch (error) {
      // User cancelled share or copy failed – not a fatal error
      console.error("Share failed:", error)
      if (error instanceof Error && error.name !== "AbortError") {
        toast({
          title: "Sharing Failed",
          description: "Please try again or copy the link manually.",
          variant: "destructive",
        })
      }
      setStatus("idle")
    }
  }

  return (
    <Button
      variant={variant}
      size={size}
      onClick={handleShare}
      disabled={status === "loading"}
      className={`gap-2 ${className}`}
    >
      {status === "loading" && <Loader2 className="w-4 h-4 animate-spin" />}
      {status === "success" && <Check className="w-4 h-4" />}
      {status === "idle" && <Share2 className="w-4 h-4" />}
      
      {status === "loading" && "Sharing..."}
      {status === "success" && "Copied!"}
      {status === "idle" && "Share Rote"}
    </Button>
  )
}
