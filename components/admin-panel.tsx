"use client"

import { useState, useEffect } from "react"
import type { Rote } from "@/lib/mage-data"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
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
import { Trash2, ShieldAlert, RefreshCw, Lock } from "lucide-react"
import { useToast } from "@/hooks/use-toast"

interface AdminPanelProps {
  rotes: Rote[]
  onRotesChange: () => void
  onClose: () => void
}

export function AdminPanel({ rotes, onRotesChange, onClose }: AdminPanelProps) {
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [password, setPassword] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [showDeleteAllDialog, setShowDeleteAllDialog] = useState(false)
  const [showDeleteDialog, setShowDeleteDialog] = useState(false)
  const [roteToDelete, setRoteToDelete] = useState<string | null>(null)
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

  const handleDeleteAll = async () => {
    setIsLoading(true)

    try {
      const response = await fetch('/api/admin/delete-all', {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ password: 'TruthUntilParadox' }),
      })

      const data = await response.json()

      if (response.ok) {
        toast({
          title: "All Rotes Deleted",
          description: `${data.deletedCount} rotes have been removed`,
        })
        onRotesChange()
      } else {
        throw new Error(data.error)
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to delete rotes",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
      setShowDeleteAllDialog(false)
    }
  }

  const handleDeleteRote = async (id: string) => {
    setIsLoading(true)

    try {
      const response = await fetch(`/api/rotes/${id}`, {
        method: 'DELETE',
      })

      if (response.ok) {
        toast({
          title: "Rote Deleted",
          description: "The rote has been removed",
        })
        onRotesChange()
      } else {
        throw new Error('Failed to delete')
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to delete rote",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
      setShowDeleteDialog(false)
      setRoteToDelete(null)
    }
  }

  const handleSeedDatabase = async () => {
    setIsLoading(true)

    try {
      const response = await fetch('/api/admin/seed', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ password: 'TruthUntilParadox' }),
      })

      const data = await response.json()

      if (response.ok) {
        toast({
          title: "Database Seeded",
          description: `${data.count} sample rotes have been added`,
        })
        onRotesChange()
      } else {
        throw new Error(data.error)
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to seed database",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

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
                className="text-center font-mono"
                disabled={isLoading}
              />
              <div className="flex gap-2">
                <Button
                  type="submit"
                  className="flex-1"
                  disabled={isLoading || !password}
                >
                  {isLoading ? "Verifying..." : "Enter"}
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
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-cinzel text-primary font-bold flex items-center gap-2">
            <ShieldAlert className="w-8 h-8" />
            Admin Panel
          </h2>
          <p className="text-muted-foreground mt-1">
            Manage your grimoire's mystical knowledge
          </p>
        </div>
        <Button variant="outline" onClick={onClose}>
          Close Panel
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Total Rotes</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-4xl font-bold text-primary">{rotes.length}</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Quick Actions</CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            <Button
              variant="outline"
              className="w-full"
              onClick={handleSeedDatabase}
              disabled={isLoading}
            >
              <RefreshCw className="w-4 h-4 mr-2" />
              Seed Sample Rotes
            </Button>
          </CardContent>
        </Card>

        <Card className="border-destructive/50">
          <CardHeader>
            <CardTitle className="text-lg text-destructive">Danger Zone</CardTitle>
          </CardHeader>
          <CardContent>
            <Button
              variant="destructive"
              className="w-full"
              onClick={() => setShowDeleteAllDialog(true)}
              disabled={isLoading || rotes.length === 0}
            >
              <Trash2 className="w-4 h-4 mr-2" />
              Delete All Rotes
            </Button>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>All Rotes</CardTitle>
          <CardDescription>Manage individual rotes</CardDescription>
        </CardHeader>
        <CardContent>
          {rotes.length === 0 ? (
            <p className="text-center text-muted-foreground py-8">
              No rotes in the database. Click "Seed Sample Rotes" to add some.
            </p>
          ) : (
            <div className="rounded-md border">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Name</TableHead>
                    <TableHead>Tradition</TableHead>
                    <TableHead>Level</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {rotes.map((rote) => (
                    <TableRow key={rote.id}>
                      <TableCell className="font-medium">{rote.name}</TableCell>
                      <TableCell>{rote.tradition}</TableCell>
                      <TableCell>{rote.level}</TableCell>
                      <TableCell className="text-right">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => {
                            setRoteToDelete(rote.id)
                            setShowDeleteDialog(true)
                          }}
                          disabled={isLoading}
                        >
                          <Trash2 className="w-4 h-4 text-destructive" />
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Delete All Confirmation Dialog */}
      <AlertDialog open={showDeleteAllDialog} onOpenChange={setShowDeleteAllDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. This will permanently delete all {rotes.length} rotes
              from the database.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDeleteAll}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              Delete All Rotes
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      {/* Delete Single Rote Confirmation Dialog */}
      <AlertDialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete this rote?</AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. This will permanently delete the rote from the database.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={() => roteToDelete && handleDeleteRote(roteToDelete)}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              Delete Rote
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  )
}
