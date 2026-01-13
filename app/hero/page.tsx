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
import { Plus, Trash2 } from "lucide-react"

export default function HeroPage() {
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [formData, setFormData] = useState({
    title: "",
    subtitle: "",
    bio: "",
    image: "",
    badge: "",
    stats: [{ label: "", value: "", icon: "" }],
    specialties: [{ name: "" }],
  })

  useEffect(() => {
    const fetchData = async () => {
      try {
        const data = await api.get("/hero")
        setFormData({
          title: data.title || "",
          subtitle: data.subtitle || "",
          bio: data.bio || "",
          image: data.image || "",
          badge: data.badge || "",
          stats: data.stats?.length ? data.stats : [{ label: "", value: "", icon: "" }],
          specialties: data.specialties?.length ? data.specialties : [{ name: "" }],
        })
      } catch (error: any) {
        toast.error("Failed to load hero data")
      } finally {
        setLoading(false)
      }
    }
    fetchData()
  }, [])

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      const reader = new FileReader()
      reader.onloadend = () => {
        setFormData({ ...formData, image: reader.result as string })
      }
      reader.readAsDataURL(file)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setSaving(true)
    try {
      await api.put("/hero", formData)
      toast.success("Hero section updated successfully!")
    } catch (error: any) {
      toast.error("Failed to update hero section")
    } finally {
      setSaving(false)
    }
  }

  const addStat = () => {
    setFormData({
      ...formData,
      stats: [...formData.stats, { label: "", value: "", icon: "" }],
    })
  }

  const removeStat = (index: number) => {
    if (formData.stats.length > 1) {
      const newStats = formData.stats.filter((_, i) => i !== index)
      setFormData({ ...formData, stats: newStats })
    } else {
      toast.error("At least one stat is required")
    }
  }

  const addSpecialty = () => {
    setFormData({
      ...formData,
      specialties: [...formData.specialties, { name: "" }],
    })
  }

  const removeSpecialty = (index: number) => {
    if (formData.specialties.length > 1) {
      const newSpecialties = formData.specialties.filter((_, i) => i !== index)
      setFormData({ ...formData, specialties: newSpecialties })
    } else {
      toast.error("At least one specialty is required")
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
        <h1 className="text-3xl font-bold mb-8">Edit Hero Section</h1>
        <Card className="p-6">
          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <Label htmlFor="title">Title</Label>
              <Input
                id="title"
                value={formData.title}
                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                required
              />
            </div>
            <div>
              <Label htmlFor="subtitle">Subtitle</Label>
              <Input
                id="subtitle"
                value={formData.subtitle}
                onChange={(e) => setFormData({ ...formData, subtitle: e.target.value })}
                required
              />
            </div>
            <div>
              <Label htmlFor="bio">Bio</Label>
              <Textarea
                id="bio"
                value={formData.bio}
                onChange={(e) => setFormData({ ...formData, bio: e.target.value })}
                rows={3}
                required
              />
            </div>
            <div>
              <Label htmlFor="badge">Badge Text</Label>
              <Input
                id="badge"
                value={formData.badge}
                onChange={(e) => setFormData({ ...formData, badge: e.target.value })}
              />
            </div>
            <div>
              <Label htmlFor="image">Image (Base64)</Label>
              <Input
                id="image"
                type="file"
                accept="image/*"
                onChange={handleImageChange}
              />
              {formData.image && (
                <img src={formData.image} alt="Preview" className="mt-4 max-w-xs rounded" />
              )}
            </div>
            <div>
              <div className="flex items-center justify-between mb-4">
                <Label>Stats</Label>
                <Button type="button" variant="outline" size="sm" onClick={addStat}>
                  <Plus className="w-4 h-4 mr-2" />
                  Add Stat
                </Button>
              </div>
              <div className="space-y-3">
                {formData.stats.map((stat, index) => (
                  <div key={index} className="flex gap-3 items-end">
                    <div className="flex-1 grid grid-cols-3 gap-3">
                      <div>
                        <Label>Label</Label>
                        <Input
                          placeholder="e.g., Years Experience"
                          value={stat.label}
                          onChange={(e) => {
                            const newStats = [...formData.stats]
                            newStats[index].label = e.target.value
                            setFormData({ ...formData, stats: newStats })
                          }}
                        />
                      </div>
                      <div>
                        <Label>Value</Label>
                        <Input
                          placeholder="e.g., 20+"
                          value={stat.value}
                          onChange={(e) => {
                            const newStats = [...formData.stats]
                            newStats[index].value = e.target.value
                            setFormData({ ...formData, stats: newStats })
                          }}
                        />
                      </div>
                      <div>
                        <Label>Icon</Label>
                        <Input
                          placeholder="Clock, Award, Users"
                          value={stat.icon}
                          onChange={(e) => {
                            const newStats = [...formData.stats]
                            newStats[index].icon = e.target.value
                            setFormData({ ...formData, stats: newStats })
                          }}
                        />
                      </div>
                    </div>
                    <Button
                      type="button"
                      variant="destructive"
                      size="sm"
                      onClick={() => removeStat(index)}
                      disabled={formData.stats.length === 1}
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>
                ))}
              </div>
            </div>
            <div>
              <div className="flex items-center justify-between mb-4">
                <Label>Specialties</Label>
                <Button type="button" variant="outline" size="sm" onClick={addSpecialty}>
                  <Plus className="w-4 h-4 mr-2" />
                  Add Specialty
                </Button>
              </div>
              <div className="space-y-3">
                {formData.specialties.map((specialty, index) => (
                  <div key={index} className="flex gap-3">
                    <Input
                      placeholder="Specialty name"
                      value={specialty.name}
                      onChange={(e) => {
                        const newSpecialties = [...formData.specialties]
                        newSpecialties[index].name = e.target.value
                        setFormData({ ...formData, specialties: newSpecialties })
                      }}
                    />
                    <Button
                      type="button"
                      variant="destructive"
                      size="sm"
                      onClick={() => removeSpecialty(index)}
                      disabled={formData.specialties.length === 1}
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
