"use client"

import { useState } from "react"
import type { Rote } from "@/lib/mage-data"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { MageGroupsManager } from "./admin/mage-groups-manager"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog"
import { ShieldAlert, Lock, X, BookOpen, Star, Library, FileText } from "lucide-react"
import { useToast } from "@/hooks/use-toast"
import { GuideContentManager } from "./admin/guide-content-manager"
import { AdminRotesPanel } from "@/components/admin/admin-rotes-panel"
import { AdminMeritsPanel } from "@/components/admin/admin-merits-panel"
import { AdminResourcesPanel } from "@/components/admin/admin-resources-panel"
import { AdminContentPanel } from "@/components/admin/admin-content-panel"

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
            Manage your grimoire's content and settings
          </p>
        </div>
        <Button variant="outline" onClick={onClose} className="gap-2">
          <X className="w-4 h-4" />
          Close Panel
        </Button>
      </div>

      <Tabs defaultValue="content" className="space-y-6">
        <TabsList className="grid w-full grid-cols-6 max-w-3xl">
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
            Merits & Flaws
          </TabsTrigger>
          <TabsTrigger value="resources" className="gap-2">
            <Library className="w-4 h-4" />
            Resources
          </TabsTrigger>
          <TabsTrigger value="guide">Guide Content</TabsTrigger>
          <TabsTrigger value="groups">Mage Groups</TabsTrigger>
        </TabsList>

        <TabsContent value="content">
          <AdminContentPanel />
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
    </TabsContent>
        <TabsContent value="groups">
  <MageGroupsManager />
</TabsContent>
      </Tabs>
    </div>
  )
}
