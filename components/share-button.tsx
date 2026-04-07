"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Share2, Check } from "lucide-react"
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
  const [copied, setCopied] = useState(false)

  const handleShare = async () => {
    // Get full URL
    const fullUrl = typeof window !== 'undefined' 
      ? `${window.location.origin}${url}`
      : url

    try {
      // Copy to clipboard
      await navigator.clipboard.writeText(fullUrl)
      
      setCopied(true)
      toast({
        title: "Link Copied!",
        description: `${title} can now be shared.`,
      })

      // Reset after 2 seconds
      setTimeout(() => setCopied(false), 2000)
    } catch (error) {
      toast({
        title: "Failed to Copy",
        description: "Please try again.",
        variant: "destructive",
      })
    }
  }

  return (
    <Button
      variant={variant}
      size={size}
      onClick={handleShare}
      className={`gap-2 ${className}`}
    >
      {copied ? (
        <>
          <Check className="w-4 h-4" />
          Copied!
        </>
      ) : (
        <>
          <Share2 className="w-4 h-4" />
          Share Rote
        </>
      )}
    </Button>
  )
}
