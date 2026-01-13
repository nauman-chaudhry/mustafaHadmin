"use client"

import { AdminLayout } from "@/components/layout/admin-layout"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Input } from "@/components/ui/input"
import { useEffect, useState } from "react"
import { api } from "@/lib/api"
import { toast } from "sonner"
import { Plus, Trash2 } from "lucide-react"

export default function AboutPage() {
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [formData, setFormData] = useState({
    fullBio: "",
    professionalBackground: "",
    clinicalExperience: [""],
  })

  useEffect(() => {
    const fetchData = async () => {
      try {
        const data = await api.get("/about")
        setFormData({
          fullBio: data.fullBio || "",
          professionalBackground: data.professionalBackground || "",
          clinicalExperience: data.clinicalExperience?.length ? data.clinicalExperience.map((exp: any) => exp.text) : [""],
        })
      } catch (error: any) {
        toast.error("Failed to load about data")
      } finally {
        setLoading(false)
      }
    }
    fetchData()
  }, [])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setSaving(true)
    try {
      await api.put("/about", {
        ...formData,
        clinicalExperience: formData.clinicalExperience.map((text) => ({ text })),
      })
      toast.success("About section updated successfully!")
    } catch (error: any) {
      toast.error("Failed to update about section")
    } finally {
      setSaving(false)
    }
  }

  const addExperience = () => {
    setFormData({ ...formData, clinicalExperience: [...formData.clinicalExperience, ""] })
  }

  const removeExperience = (index: number) => {
    if (formData.clinicalExperience.length > 1) {
      const newExp = formData.clinicalExperience.filter((_, i) => i !== index)
      setFormData({ ...formData, clinicalExperience: newExp })
    } else {
      toast.error("At least one experience item is required")
    }
  }

  if (loading) {
    return (
      <AdminLayout>
        <div>Loading...</div>
      </AdminLayout>
    )
  }

  return (
    <AdminLayout>
      <div>
        <h1 className="text-3xl font-bold mb-8">Edit About Section</h1>
        <Card className="p-6">
          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <Label htmlFor="fullBio">Full Bio</Label>
              <Textarea
                id="fullBio"
                value={formData.fullBio}
                onChange={(e) => setFormData({ ...formData, fullBio: e.target.value })}
                rows={6}
                required
              />
            </div>
            <div>
              <Label htmlFor="professionalBackground">Professional Background</Label>
              <Textarea
                id="professionalBackground"
                value={formData.professionalBackground}
                onChange={(e) => setFormData({ ...formData, professionalBackground: e.target.value })}
                rows={6}
                required
              />
            </div>
            <div>
              <div className="flex items-center justify-between mb-4">
                <Label>Clinical Experience</Label>
                <Button type="button" variant="outline" size="sm" onClick={addExperience}>
                  <Plus className="w-4 h-4 mr-2" />
                  Add Experience
                </Button>
              </div>
              <div className="space-y-3">
                {formData.clinicalExperience.map((exp, index) => (
                  <div key={index} className="flex gap-3">
                    <Input
                      value={exp}
                      onChange={(e) => {
                        const newExp = [...formData.clinicalExperience]
                        newExp[index] = e.target.value
                        setFormData({ ...formData, clinicalExperience: newExp })
                      }}
                      placeholder="Enter clinical experience item"
                    />
                    <Button
                      type="button"
                      variant="destructive"
                      size="sm"
                      onClick={() => removeExperience(index)}
                      disabled={formData.clinicalExperience.length === 1}
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>
                ))}
              </div>
            </div>
            <Button type="submit" disabled={saving}>
              {saving ? "Saving..." : "Save Changes"}
            </Button>
          </form>
        </Card>
      </div>
    </AdminLayout>
  )
}
