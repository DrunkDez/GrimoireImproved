"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { Save, RefreshCw, Edit2, X } from "lucide-react"

interface ExpandedContent {
  [key: string]: string
}

const GUIDE_STEPS = [
  { id: 'concept', title: 'Concept & Tradition', subtitle: 'Character concept and Tradition selection' },
  { id: 'attributes', title: 'Attributes', subtitle: 'Physical, Social, Mental (7/5/3)' },
  { id: 'abilities', title: 'Abilities', subtitle: 'Talents, Skills, Knowledges (13/9/5)' },
  { id: 'spheres', title: 'Spheres', subtitle: 'Six dots among the Nine Spheres' },
  { id: 'backgrounds', title: 'Backgrounds', subtitle: 'Avatar, Resources, etc. (7 dots)' },
  { id: 'freebies', title: 'Freebie Points', subtitle: '15 points to customize' }
]

export function GuideContentManager() {
  const [content, setContent] = useState<ExpandedContent>({})
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState<string | null>(null)
  const [editingStep, setEditingStep] = useState<string | null>(null)
  const [tempContent, setTempContent] = useState<string>('')

  useEffect(() => {
    fetchContent()
  }, [])

  const fetchContent = async () => {
    try {
      const response = await fetch('/api/guide-expanded-content')
      if (response.ok) {
        const data = await response.json()
        setContent(data)
      }
    } catch (error) {
      console.error('Error fetching content:', error)
    } finally {
      setLoading(false)
    }
  }

  const startEdit = (stepId: string) => {
    setEditingStep(stepId)
    setTempContent(content[stepId] || '')
  }

  const cancelEdit = () => {
    setEditingStep(null)
    setTempContent('')
  }

  const saveContent = async (step: string) => {
    setSaving(step)
    try {
      const response = await fetch('/api/guide-expanded-content', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ step, content: tempContent })
      })

      if (response.ok) {
        setContent(prev => ({ ...prev, [step]: tempContent }))
        setEditingStep(null)
        setTempContent('')
      } else {
        alert('Failed to save')
      }
    } catch (error) {
      console.error('Error saving:', error)
      alert('Error saving content')
    } finally {
      setSaving(null)
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center p-8">
        <RefreshCw className="w-6 h-6 animate-spin text-primary" />
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-cinzel font-bold text-primary">
          Character Guide - Expanded Content
        </h2>
        <p className="text-sm text-muted-foreground mt-2">
          Edit the detailed text that appears when users click to expand each step on the character creation guide page
        </p>
      </div>

      <div className="grid gap-4">
        {GUIDE_STEPS.map(step => (
          <Card key={step.id} className="border-2">
            <CardHeader className="pb-3">
              <div className="flex items-start justify-between">
                <div>
                  <CardTitle className="text-lg">{step.title}</CardTitle>
                  <CardDescription className="text-xs">{step.subtitle}</CardDescription>
                </div>
                {editingStep !== step.id && (
                  <Button 
                    size="sm"
                    variant="outline"
                    onClick={() => startEdit(step.id)}
                    className="gap-2"
                  >
                    <Edit2 className="w-3 h-3" />
                    Edit
                  </Button>
                )}
              </div>
            </CardHeader>
            <CardContent>
              {editingStep === step.id ? (
                <div className="space-y-4">
                  <div>
                    <Label className="text-sm">Expanded Content</Label>
                    <Textarea
                      value={tempContent}
                      onChange={(e) => setTempContent(e.target.value)}
                      rows={6}
                      placeholder="Enter the detailed content that appears when users expand this step..."
                      className="mt-2 font-sans"
                    />
                    <p className="text-xs text-muted-foreground mt-2">
                      This text appears when the user clicks the step to expand it.
                    </p>
                  </div>

                  <div className="flex gap-2">
                    <Button 
                      onClick={() => saveContent(step.id)}
                      disabled={saving === step.id}
                      size="sm"
                      className="gap-2"
                    >
                      {saving === step.id ? (
                        <RefreshCw className="w-3 h-3 animate-spin" />
                      ) : (
                        <Save className="w-3 h-3" />
                      )}
                      Save
                    </Button>
                    <Button 
                      size="sm"
                      variant="outline"
                      onClick={cancelEdit}
                      className="gap-2"
                    >
                      <X className="w-3 h-3" />
                      Cancel
                    </Button>
                  </div>
                </div>
              ) : (
                <div>
                  {content[step.id] ? (
                    <div className="p-3 bg-muted/50 rounded-md border">
                      <p className="text-sm whitespace-pre-wrap leading-relaxed">
                        {content[step.id]}
                      </p>
                    </div>
                  ) : (
                    <div className="p-4 bg-muted/30 rounded-md border-2 border-dashed text-center">
                      <p className="text-sm text-muted-foreground italic">
                        No expanded content set - click Edit to add content
                      </p>
                    </div>
                  )}
                </div>
              )}
            </CardContent>
          </Card>
        ))}
      </div>

      <Card className="border-2 border-primary/20 bg-primary/5">
        <CardHeader>
          <CardTitle className="text-sm">💡 How This Works</CardTitle>
        </CardHeader>
        <CardContent className="text-sm space-y-2">
          <p>
            <strong>1.</strong> Users see the short subtitle when viewing the character creation guide
          </p>
          <p>
            <strong>2.</strong> When they click a step, it expands to show the detailed content you set here
          </p>
          <p>
            <strong>3.</strong> Edit each step to provide helpful, detailed explanations for new players
          </p>
        </CardContent>
      </Card>
    </div>
  )
}
