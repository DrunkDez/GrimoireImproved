"use client"

import { useState } from "react"
import type { Rote } from "@/lib/mage-data"
import { Button } from "@/components/ui/button"
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
import { Trash2, RefreshCw } from "lucide-react"
import { useToast } from "@/hooks/use-toast"

interface AdminRotesPanelProps {
  rotes: Rote[]
  onRotesChange: () => void
}

export function AdminRotesPanel({ rotes, onRotesChange }: AdminRotesPanelProps) {
  const [isLoading, setIsLoading] = useState(false)
  const [showDeleteAllDialog, setShowDeleteAllDialog] = useState(false)
  const [showDeleteDialog, setShowDeleteDialog] = useState(false)
  const [roteToDelete, setRoteToDelete] = useState<string | null>(null)
  const { toast } = useToast()

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

  return (
    <div className="space-y-6">
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
