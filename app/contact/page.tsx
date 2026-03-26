"use client"

import { useState } from "react"
import { GrimoireHeader } from "@/components/grimoire-header"
import { GrimoireFooter } from "@/components/grimoire-footer"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Mail, Send, CheckCircle } from "lucide-react"
import { useToast } from "@/hooks/use-toast"
import { Toaster } from "@/components/ui/toaster"

export default function ContactPage() {
  const { toast } = useToast()
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [submitted, setSubmitted] = useState(false)
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    subject: "",
    message: ""
  })

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData(prev => ({
      ...prev,
      [e.target.name]: e.target.value
    }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)

    try {
      const response = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      })

      const data = await response.json()

      if (response.ok) {
        setSubmitted(true)
        toast({
          title: "Message Sent!",
          description: "Thanks for reaching out. We'll get back to you soon!",
        })
        // Reset form
        setFormData({ name: "", email: "", subject: "", message: "" })
      } else {
        toast({
          title: "Failed to Send",
          description: data.error || "Something went wrong. Please try again.",
          variant: "destructive",
        })
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to send message. Please try again.",
        variant: "destructive",
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <>
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
            <div className="max-w-2xl mx-auto">
              {/* Header */}
              <div className="text-center mb-8">
                <div className="text-5xl mb-4">⚙</div>
                <h1 className="font-serif text-3xl md:text-4xl font-black text-primary uppercase tracking-wide leading-tight mb-4">
                  Contact Us
                </h1>
                <p className="text-muted-foreground">
                  Have a question, suggestion, or found an issue? We'd love to hear from you!
                </p>
              </div>

              {submitted ? (
                <Card className="border-2 border-primary">
                  <CardContent className="p-12 text-center">
                    <CheckCircle className="w-16 h-16 mx-auto mb-4 text-primary" />
                    <h2 className="font-cinzel text-2xl font-bold text-primary mb-2">
                      Message Sent!
                    </h2>
                    <p className="text-muted-foreground mb-6">
                      Thank you for reaching out. We'll get back to you as soon as possible.
                    </p>
                    <Button 
                      onClick={() => setSubmitted(false)}
                      variant="outline"
                    >
                      Send Another Message
                    </Button>
                  </CardContent>
                </Card>
              ) : (
                <Card className="border-4 border-double border-primary shadow-[inset_0_0_60px_rgba(139,71,38,0.08)]">
                  <CardHeader>
                    <CardTitle className="font-cinzel text-2xl flex items-center gap-2">
                      <Mail className="w-6 h-6" />
                      Send Us a Message
                    </CardTitle>
                    <CardDescription>
                      Fill out the form below and we'll respond as soon as we can
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <form onSubmit={handleSubmit} className="space-y-6">
                      <div className="grid md:grid-cols-2 gap-6">
                        {/* Name */}
                        <div className="space-y-2">
                          <Label htmlFor="name">Your Name *</Label>
                          <Input
                            id="name"
                            name="name"
                            placeholder="John Doe"
                            value={formData.name}
                            onChange={handleChange}
                            required
                            disabled={isSubmitting}
                          />
                        </div>

                        {/* Email */}
                        <div className="space-y-2">
                          <Label htmlFor="email">Your Email *</Label>
                          <Input
                            id="email"
                            name="email"
                            type="email"
                            placeholder="you@example.com"
                            value={formData.email}
                            onChange={handleChange}
                            required
                            disabled={isSubmitting}
                          />
                        </div>
                      </div>

                      {/* Subject */}
                      <div className="space-y-2">
                        <Label htmlFor="subject">Subject *</Label>
                        <Input
                          id="subject"
                          name="subject"
                          placeholder="What is this regarding?"
                          value={formData.subject}
                          onChange={handleChange}
                          required
                          disabled={isSubmitting}
                        />
                      </div>

                      {/* Message */}
                      <div className="space-y-2">
                        <Label htmlFor="message">Message *</Label>
                        <Textarea
                          id="message"
                          name="message"
                          placeholder="Tell us what's on your mind..."
                          value={formData.message}
                          onChange={handleChange}
                          required
                          disabled={isSubmitting}
                          rows={6}
                          className="resize-none"
                        />
                      </div>

                      {/* Submit Button */}
                      <Button
                        type="submit"
                        className="w-full gap-2"
                        disabled={isSubmitting}
                        size="lg"
                      >
                        {isSubmitting ? (
                          <>
                            <span className="animate-spin">⚙</span>
                            Sending...
                          </>
                        ) : (
                          <>
                            <Send className="w-4 h-4" />
                            Send Message
                          </>
                        )}
                      </Button>
                    </form>
                  </CardContent>
                </Card>
              )}

              {/* Additional Info */}
              <div className="mt-8 p-6 bg-accent/10 border-2 border-accent/30 rounded-lg text-center">
                <p className="text-sm text-foreground/80">
                  <strong>Note:</strong> We typically respond within 24-48 hours. 
                  For urgent matters, please include "URGENT" in your subject line.
                </p>
              </div>
            </div>
          </main>

          <GrimoireFooter />
        </div>
      </div>
      <Toaster />
    </>
  )
}
