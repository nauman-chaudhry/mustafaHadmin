"use client"

import { AdminLayout } from "@/components/layout/admin-layout"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { useEffect, useState } from "react"
import { api } from "@/lib/api"
import { toast } from "sonner"
import { Plus, Trash2 } from "lucide-react"

export default function ContactPage() {
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [formData, setFormData] = useState({
    email: "",
    phone: "",
    address: "",
    socialLinks: [{ platform: "", url: "" }],
  })

  useEffect(() => {
    const fetchData = async () => {
      try {
        const data = await api.get("/contact")
        setFormData({
          email: data.email || "",
          phone: data.phone || "",
          address: data.address || "",
          socialLinks: data.socialLinks?.length ? data.socialLinks : [{ platform: "", url: "" }],
        })
      } catch (error: any) {
        toast.error("Failed to load contact data")
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
      await api.put("/contact", formData)
      toast.success("Contact information updated successfully!")
    } catch (error: any) {
      toast.error("Failed to update contact information")
    } finally {
      setSaving(false)
    }
  }

  const addSocialLink = () => {
    setFormData({ ...formData, socialLinks: [...formData.socialLinks, { platform: "", url: "" }] })
  }

  const removeSocialLink = (index: number) => {
    if (formData.socialLinks.length > 1) {
      const newLinks = formData.socialLinks.filter((_, i) => i !== index)
      setFormData({ ...formData, socialLinks: newLinks })
    } else {
      toast.error("At least one social link is required (can be empty)")
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
        <h1 className="text-3xl font-bold mb-8">Edit Contact Information</h1>
        <Card className="p-6">
          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                required
              />
            </div>
            <div>
              <Label htmlFor="phone">Phone</Label>
              <Input
                id="phone"
                value={formData.phone}
                onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
              />
            </div>
            <div>
              <Label htmlFor="address">Address</Label>
              <Input
                id="address"
                value={formData.address}
                onChange={(e) => setFormData({ ...formData, address: e.target.value })}
              />
            </div>
            <div>
              <div className="flex items-center justify-between mb-4">
                <Label>Social Links</Label>
                <Button type="button" variant="outline" size="sm" onClick={addSocialLink}>
                  <Plus className="w-4 h-4 mr-2" />
                  Add Social Link
                </Button>
              </div>
              <div className="space-y-3">
                {formData.socialLinks.map((link, index) => (
                  <div key={index} className="flex gap-3">
                    <div className="flex-1 grid grid-cols-2 gap-3">
                      <Input
                        placeholder="Platform"
                        value={link.platform}
                        onChange={(e) => {
                          const newLinks = [...formData.socialLinks]
                          newLinks[index].platform = e.target.value
                          setFormData({ ...formData, socialLinks: newLinks })
                        }}
                      />
                      <Input
                        placeholder="URL"
                        value={link.url}
                        onChange={(e) => {
                          const newLinks = [...formData.socialLinks]
                          newLinks[index].url = e.target.value
                          setFormData({ ...formData, socialLinks: newLinks })
                        }}
                      />
                    </div>
                    <Button
                      type="button"
                      variant="destructive"
                      size="sm"
                      onClick={() => removeSocialLink(index)}
                      disabled={formData.socialLinks.length === 1}
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
