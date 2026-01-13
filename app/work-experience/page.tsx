"use client"

import { AdminLayout } from "@/components/layout/admin-layout"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { useEffect, useState } from "react"
import { api } from "@/lib/api"
import { toast } from "sonner"
import { Plus, Trash2, Edit2 } from "lucide-react"

interface WorkExperience {
  _id?: string
  title: string
  organization: string
  location?: string
  yearFrom: string
  yearTo?: string
  isCurrent: boolean
  description?: string
}

export default function WorkExperiencePage() {
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [experiences, setExperiences] = useState<WorkExperience[]>([])
  const [editingIndex, setEditingIndex] = useState<number | null>(null)
  const [formData, setFormData] = useState<WorkExperience>({
    title: "",
    organization: "",
    location: "",
    yearFrom: "",
    yearTo: "",
    isCurrent: false,
    description: "",
  })

  useEffect(() => {
    fetchExperiences()
  }, [])

  const fetchExperiences = async () => {
    try {
      const data = await api.get("/work-experience")
      setExperiences(data)
    } catch (error: any) {
      toast.error("Failed to load work experience")
    } finally {
      setLoading(false)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setSaving(true)
    try {
      if (editingIndex !== null) {
        const experience = experiences[editingIndex]
        await api.put(`/work-experience/${experience._id}`, formData)
        toast.success("Work experience updated successfully!")
      } else {
        await api.post("/work-experience", formData)
        toast.success("Work experience added successfully!")
      }
      resetForm()
      fetchExperiences()
    } catch (error: any) {
      toast.error("Failed to save work experience")
    } finally {
      setSaving(false)
    }
  }

  const handleEdit = (index: number) => {
    const experience = experiences[index]
    setFormData(experience)
    setEditingIndex(index)
  }

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this work experience?")) return
    try {
      await api.delete(`/work-experience/${id}`)
      toast.success("Work experience deleted successfully!")
      fetchExperiences()
    } catch (error: any) {
      toast.error("Failed to delete work experience")
    }
  }

  const resetForm = () => {
    setFormData({
      title: "",
      organization: "",
      location: "",
      yearFrom: "",
      yearTo: "",
      isCurrent: false,
      description: "",
    })
    setEditingIndex(null)
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
        <h1 className="text-3xl font-bold mb-8">Work Experience</h1>
        <Card className="p-6 mb-6">
          <h2 className="text-xl font-semibold mb-4">
            {editingIndex !== null ? "Edit Work Experience" : "Add New Work Experience"}
          </h2>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label>Title</Label>
                <Input
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  required
                />
              </div>
              <div>
                <Label>Organization</Label>
                <Input
                  value={formData.organization}
                  onChange={(e) => setFormData({ ...formData, organization: e.target.value })}
                  required
                />
              </div>
              <div>
                <Label>Location (Optional)</Label>
                <Input
                  value={formData.location}
                  onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                />
              </div>
              <div>
                <Label>Year From</Label>
                <Input
                  type="text"
                  value={formData.yearFrom}
                  onChange={(e) => setFormData({ ...formData, yearFrom: e.target.value })}
                  required
                />
              </div>
              <div>
                <Label>Year To (Leave empty if current)</Label>
                <Input
                  type="text"
                  value={formData.yearTo}
                  onChange={(e) => setFormData({ ...formData, yearTo: e.target.value, isCurrent: !e.target.value })}
                  disabled={formData.isCurrent}
                />
              </div>
              <div className="flex items-center gap-2">
                <input
                  type="checkbox"
                  id="isCurrent"
                  checked={formData.isCurrent}
                  onChange={(e) => {
                    setFormData({ ...formData, isCurrent: e.target.checked, yearTo: e.target.checked ? "" : formData.yearTo })
                  }}
                  className="w-4 h-4"
                />
                <Label htmlFor="isCurrent">Current Position</Label>
              </div>
            </div>
            <div>
              <Label>Description (Optional)</Label>
              <Textarea
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                rows={3}
              />
            </div>
            <div className="flex gap-2">
              <Button type="submit" disabled={saving}>
                {saving ? "Saving..." : editingIndex !== null ? "Update" : "Add Experience"}
              </Button>
              {editingIndex !== null && (
                <Button type="button" variant="outline" onClick={resetForm}>
                  Cancel
                </Button>
              )}
            </div>
          </form>
        </Card>

        <Card className="p-6">
          <h2 className="text-xl font-semibold mb-4">All Work Experiences</h2>
          <div className="space-y-4">
            {experiences.length === 0 ? (
              <p className="text-muted-foreground">No work experiences added yet.</p>
            ) : (
              experiences.map((exp, index) => (
                <div key={exp._id || index} className="border rounded-lg p-4">
                  <div className="flex justify-between items-start">
                    <div className="flex-1">
                      <h3 className="font-semibold text-lg">{exp.title}</h3>
                      <p className="text-[#0074C7] font-medium">{exp.organization}</p>
                      {exp.location && <p className="text-sm text-muted-foreground">{exp.location}</p>}
                      <p className="text-sm text-muted-foreground mt-1">
                        {exp.yearFrom} - {exp.isCurrent || !exp.yearTo ? "Present" : exp.yearTo}
                        {exp.isCurrent && (
                          <span className="ml-2 px-2 py-0.5 text-xs font-medium rounded-full bg-green-100 text-green-800">
                            Current
                          </span>
                        )}
                      </p>
                      {exp.description && <p className="text-sm text-muted-foreground mt-2">{exp.description}</p>}
                    </div>
                    <div className="flex gap-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleEdit(index)}
                      >
                        <Edit2 className="w-4 h-4" />
                      </Button>
                      <Button
                        variant="destructive"
                        size="sm"
                        onClick={() => exp._id && handleDelete(exp._id)}
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        </Card>
      </div>
    </AdminLayout>
  )
}

