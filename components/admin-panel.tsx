"use client"

import { useState } from "react"
import type { Rote } from "@/lib/mage-data"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { MageGroupsManager } from "./admin/mage-groups-manager"
import { ContentManager } from "./admin/content-manager"
import { ShieldAlert, Lock, X, BookOpen, Star, Library, FileText, Users } from "lucide-react"
import { useToast } from "@/hooks/use-toast"
import { GuideContentManager } from "./admin/guide-content-manager"
import { AdminRotesPanel } from "@/components/admin/admin-rotes-panel"
import { AdminMeritsPanel } from "@/components/admin/admin-merits-panel"
import { AdminResourcesPanel } from "@/components/admin/admin-resources-panel"
import { CharacterCreationManager } from "./admin/character-creation-manager"

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

  if (!isAuthenticated) {
    return (
      <div className="flex items-center justify-center min-h-[500px] p-6">
        <Card className="w-full max-w-md border-2 border-primary/30 shadow-2xl">
          <CardContent className="pt-6">
            <form onSubmit={handleLogin} className="space-y-6">
              <div className="text-center space-y-2">
                <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-primary/10 mb-4">
                  <Lock className="w-8 h-8 text-primary" />
                </div>
                <h2 className="text-2xl font-cinzel font-bold text-primary">
                  Admin Access
                </h2>
                <p className="text-sm text-muted-foreground">
                  Enter password to access the admin panel
                </p>
              </div>

              <div className="space-y-2">
                <Input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Admin password"
                  disabled={isLoading}
                  className="text-center"
                  autoFocus
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <Button
                  type="submit"
                  disabled={isLoading || !password}
                  className="w-full"
                >
                  {isLoading ? "Verifying..." : "Access Panel"}
                </Button>
                <Button
                  type="button"
                  variant="outline"
                  onClick={onClose}
                  disabled={isLoading}
                >
                  Cancel
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-3xl font-cinzel font-bold text-primary flex items-center gap-2">
            <ShieldAlert className="w-8 h-8" />
            Admin Panel
          </h1>
          <p className="text-muted-foreground">
            Manage The Paradox Wheel's content and settings
          </p>
        </div>
        <Button variant="outline" onClick={onClose} className="gap-2">
          <X className="w-4 h-4" />
          Close Panel
        </Button>
      </div>

      <Tabs defaultValue="content" className="space-y-6">
        <TabsList className="grid w-full grid-cols-7 max-w-3xl">
          <TabsTrigger value="content" className="gap-2">
            <FileText className="w-4 h-4" />
            Content
          </TabsTrigger>
          <TabsTrigger value="rotes" className="gap-2">
            <BookOpen className="w-4 h-4" />
            Rotes
          </TabsTrigger>
          <TabsTrigger value="merits" className="gap-2">
            <Star className="w-4 h-4" />
            Merits
          </TabsTrigger>
          <TabsTrigger value="resources" className="gap-2">
            <Library className="w-4 h-4" />
            Resources
          </TabsTrigger>
          <TabsTrigger value="guide" className="gap-2">
            <BookOpen className="w-4 h-4" />
            Guide
          </TabsTrigger>
          <TabsTrigger value="groups" className="gap-2">
            <Users className="w-4 h-4" />
            Groups
          </TabsTrigger>
          <TabsTrigger value="chargen">Char Creation</TabsTrigger> 
        </TabsList>

        <TabsContent value="content">
          <ContentManager />
        </TabsContent>

        <TabsContent value="rotes">
          <AdminRotesPanel rotes={rotes} onRotesChange={onRotesChange} />
        </TabsContent>

        <TabsContent value="merits">
          <AdminMeritsPanel />
        </TabsContent>

        <TabsContent value="resources">
          <AdminResourcesPanel />
        </TabsContent>

        <TabsContent value="guide">
          <GuideContentManager />
        </TabsContent>

        <TabsContent value="groups">
          <MageGroupsManager />
        </TabsContent>
        <TabsContent value="chargen">
         <CharacterCreationManager />
        </TabsContent>
      </Tabs>
    </div>
  )
}
