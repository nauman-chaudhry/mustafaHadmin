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
import { Trash2, Plus } from "lucide-react"

export default function ServicesPage() {
  const [loading, setLoading] = useState(true)
  const [services, setServices] = useState<any[]>([])
  const [editing, setEditing] = useState<string | null>(null)
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    icon: "Brain",
    order: 0,
  })

  useEffect(() => {
    fetchServices()
  }, [])

  const fetchServices = async () => {
    try {
      const data = await api.get("/services")
      setServices(data)
    } catch (error: any) {
      toast.error("Failed to load services")
    } finally {
      setLoading(false)
    }
  }

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault()
    try {
      await api.post("/services", formData)
      toast.success("Service created successfully!")
      setFormData({ title: "", description: "", icon: "Brain", order: 0 })
      fetchServices()
    } catch (error: any) {
      toast.error("Failed to create service")
    }
  }

  const handleUpdate = async (id: string) => {
    try {
      await api.put(`/services/${id}`, formData)
      toast.success("Service updated successfully!")
      setEditing(null)
      setFormData({ title: "", description: "", icon: "Brain", order: 0 })
      fetchServices()
    } catch (error: any) {
      toast.error("Failed to update service")
    }
  }

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this service?")) return
    try {
      await api.delete(`/services/${id}`)
      toast.success("Service deleted successfully!")
      fetchServices()
    } catch (error: any) {
      toast.error("Failed to delete service")
    }
  }

  const startEdit = (service: any) => {
    setEditing(service._id)
    setFormData({
      title: service.title,
      description: service.description,
      icon: service.icon,
      order: service.order,
    })
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
        <h1 className="text-3xl font-bold mb-8">Manage Services</h1>
        <Card className="p-6 mb-6">
          <h2 className="text-xl font-semibold mb-4">
            {editing ? "Edit Service" : "Create New Service"}
          </h2>
          <form onSubmit={editing ? (e) => { e.preventDefault(); handleUpdate(editing) } : handleCreate} className="space-y-4">
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
              <Label htmlFor="description">Description</Label>
              <Textarea
                id="description"
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                rows={3}
                required
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="icon">Icon (Brain, Activity, Moon, Zap, Heart)</Label>
                <Input
                  id="icon"
                  value={formData.icon}
                  onChange={(e) => setFormData({ ...formData, icon: e.target.value })}
                  required
                />
              </div>
              <div>
                <Label htmlFor="order">Order</Label>
                <Input
                  id="order"
                  type="number"
                  value={formData.order}
                  onChange={(e) => setFormData({ ...formData, order: parseInt(e.target.value) })}
                  required
                />
              </div>
            </div>
            <div className="flex gap-2">
              <Button type="submit">{editing ? "Update" : "Create"}</Button>
              {editing && (
                <Button type="button" variant="outline" onClick={() => {
                  setEditing(null)
                  setFormData({ title: "", description: "", icon: "Brain", order: 0 })
                }}>
                  Cancel
                </Button>
              )}
            </div>
          </form>
        </Card>
        <div className="space-y-4">
          {services.map((service) => (
            <Card key={service._id} className="p-6">
              <div className="flex justify-between items-start">
                <div>
                  <h3 className="text-xl font-semibold">{service.title}</h3>
                  <p className="text-gray-600 mt-2">{service.description}</p>
                  <p className="text-sm text-gray-500 mt-2">Icon: {service.icon} | Order: {service.order}</p>
                </div>
                <div className="flex gap-2">
                  <Button variant="outline" size="sm" onClick={() => startEdit(service)}>
                    Edit
                  </Button>
                  <Button variant="destructive" size="sm" onClick={() => handleDelete(service._id)}>
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            </Card>
          ))}
        </div>
      </div>
    </AdminLayout>
  )
}

