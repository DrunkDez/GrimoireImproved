"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { Save, RefreshCw } from "lucide-react"

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

export default function GuideExpandedContentEditor() {
  const [content, setContent] = useState<ExpandedContent>({})
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState<string | null>(null)
  const [editingStep, setEditingStep] = useState<string | null>(null)

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

  const saveContent = async (step: string, text: string) => {
    setSaving(step)
    try {
      const response = await fetch('/api/guide-expanded-content', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ step, content: text })
      })

      if (response.ok) {
        setContent(prev => ({ ...prev, [step]: text }))
        setEditingStep(null)
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
          Guide Expanded Content
        </h2>
        <p className="text-sm text-muted-foreground mt-2">
          Edit the text that appears when users click to expand each guide step
        </p>
      </div>

      <div className="grid gap-4">
        {GUIDE_STEPS.map(step => (
          <Card key={step.id} className="border-2 border-primary/20">
            <CardHeader>
              <CardTitle className="font-cinzel text-lg">{step.title}</CardTitle>
              <CardDescription>{step.subtitle}</CardDescription>
            </CardHeader>
            <CardContent>
              {editingStep === step.id ? (
                <div className="space-y-4">
                  <div>
                    <Label>Expanded Content</Label>
                    <Textarea
                      value={content[step.id] || ''}
                      onChange={(e) => setContent(prev => ({ ...prev, [step.id]: e.target.value }))}
                      rows={8}
                      placeholder="Enter the detailed content that appears when users expand this step..."
                      className="mt-2"
                    />
                    <p className="text-xs text-muted-foreground mt-2">
                      This text appears below the subtitle when the user clicks to expand.
                    </p>
                  </div>

                  <div className="flex gap-2">
                    <Button 
                      onClick={() => saveContent(step.id, content[step.id] || '')}
                      disabled={saving === step.id}
                      className="gap-2"
                    >
                      {saving === step.id ? (
                        <RefreshCw className="w-4 h-4 animate-spin" />
                      ) : (
                        <Save className="w-4 h-4" />
                      )}
                      Save
                    </Button>
                    <Button 
                      variant="outline"
                      onClick={() => {
                        setEditingStep(null)
                        fetchContent() // Reset to saved content
                      }}
                    >
                      Cancel
                    </Button>
                  </div>
                </div>
              ) : (
                <div>
                  {content[step.id] ? (
                    <div className="p-4 bg-muted/30 rounded-md mb-4">
                      <p className="text-sm whitespace-pre-wrap">{content[step.id]}</p>
                    </div>
                  ) : (
                    <div className="p-4 bg-muted/30 rounded-md mb-4 text-center">
                      <p className="text-sm text-muted-foreground italic">
                        No expanded content set
                      </p>
                    </div>
                  )}
                  <Button 
                    variant="outline" 
                    onClick={() => setEditingStep(step.id)}
                    size="sm"
                  >
                    Edit
                  </Button>
                </div>
              )}
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  )
}
