"use client"

import { useState } from "react"
import type { Rote } from "@/lib/mage-data"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Lock, X, BookOpen, Star, Library } from "lucide-react"
import { useToast } from "@/hooks/use-toast"
import { AdminMeritsPanel } from "@/components/admin/admin-merits-panel"
import { AdminResourcesPanel } from "@/components/admin/admin-resources-panel"
import { AdminRotesPanel } from "@/components/admin/admin-rotes-panel"

interface AdminPanelProps {
  rotes: Rote[]
  onRotesChange: () => void
  onClose: () => void
}

export function AdminPanel({ rotes, onRotesChange, onClose }: AdminPanelProps) {
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [password, setPassword] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const { toast } = useToast()

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)

    try {
      const response = await fetch('/api/admin/auth', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ password }),
      })

      const data = await response.json()

      if (data.authenticated) {
        setIsAuthenticated(true)
        toast({
          title: "Access Granted",
          description: "Welcome to the Admin Panel",
        })
      } else {
        toast({
          title: "Access Denied",
          description: "Invalid password",
          variant: "destructive",
        })
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Authentication failed",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
      setPassword("")
    }
  }

  // Login screen
  if (!isAuthenticated) {
    return (
      <div className="p-6 max-w-md mx-auto">
        <Card className="border-2 border-primary shadow-lg">
          <CardHeader className="text-center">
            <div className="mx-auto mb-4 w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center">
              <Lock className="w-8 h-8 text-primary" />
            </div>
            <CardTitle className="text-2xl font-cinzel">Admin Access</CardTitle>
            <CardDescription>Enter the password to access the Admin Panel</CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleLogin} className="space-y-4">
              <Input
                type="password"
                placeholder="Enter admin password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                disabled={isLoading}
                className="font-mono"
              />
              <Button type="submit" disabled={isLoading} className="w-full">
                {isLoading ? "Verifying..." : "Access Admin Panel"}
              </Button>
            </form>
          </CardContent>
        </Card>
      </div>
    )
  }

  // Main admin panel with tabs
  return (
    <div className="p-6 md:p-10">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-3xl font-cinzel font-bold text-primary">
            Admin Panel
          </h1>
          <p className="text-muted-foreground">
            Manage your grimoire's mystical knowledge
          </p>
        </div>
        <Button variant="outline" onClick={onClose} className="gap-2">
          <X className="w-4 h-4" />
          Close Panel
        </Button>
      </div>

      <Tabs defaultValue="rotes" className="space-y-6">
        <TabsList className="grid w-full grid-cols-3 max-w-2xl">
          <TabsTrigger value="rotes" className="gap-2">
            <BookOpen className="w-4 h-4" />
            Rotes
          </TabsTrigger>
          <TabsTrigger value="merits" className="gap-2">
            <Star className="w-4 h-4" />
            Merits & Flaws
          </TabsTrigger>
          <TabsTrigger value="resources" className="gap-2">
            <Library className="w-4 h-4" />
            Resources
          </TabsTrigger>
        </TabsList>

        <TabsContent value="rotes">
          <AdminRotesPanel rotes={rotes} onRotesChange={onRotesChange} />
        </TabsContent>

        <TabsContent value="merits">
          <AdminMeritsPanel />
        </TabsContent>

        <TabsContent value="resources">
          <AdminResourcesPanel />
        </TabsContent>
      </Tabs>
    </div>
  )
}
