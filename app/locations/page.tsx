"use client"

import { AdminLayout } from "@/components/layout/admin-layout"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Checkbox } from "@/components/ui/checkbox"
import { useEffect, useState } from "react"
import { api } from "@/lib/api"
import { toast } from "sonner"
import { Trash2 } from "lucide-react"

export default function LocationsPage() {
  const [loading, setLoading] = useState(true)
  const [locations, setLocations] = useState<any[]>([])
  const [editing, setEditing] = useState<string | null>(null)
  const [formData, setFormData] = useState({
    name: "",
    address: "",
    city: "",
    state: "",
    country: "",
    phone: "",
    email: "",
    isActive: true,
  })

  useEffect(() => {
    fetchLocations()
  }, [])

  const fetchLocations = async () => {
    try {
      const data = await api.get("/locations")
      setLocations(data)
    } catch (error: any) {
      toast.error("Failed to load locations")
    } finally {
      setLoading(false)
    }
  }

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault()
    try {
      await api.post("/locations", formData)
      toast.success("Location created successfully!")
      setFormData({
        name: "",
        address: "",
        city: "",
        state: "",
        country: "",
        phone: "",
        email: "",
        isActive: true,
      })
      fetchLocations()
    } catch (error: any) {
      toast.error("Failed to create location")
    }
  }

  const handleUpdate = async (id: string) => {
    try {
      await api.put(`/locations/${id}`, formData)
      toast.success("Location updated successfully!")
      setEditing(null)
      setFormData({
        name: "",
        address: "",
        city: "",
        state: "",
        country: "",
        phone: "",
        email: "",
        isActive: true,
      })
      fetchLocations()
    } catch (error: any) {
      toast.error("Failed to update location")
    }
  }

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this location?")) return
    try {
      await api.delete(`/locations/${id}`)
      toast.success("Location deleted successfully!")
      fetchLocations()
    } catch (error: any) {
      toast.error("Failed to delete location")
    }
  }

  const startEdit = (location: any) => {
    setEditing(location._id)
    setFormData({
      name: location.name,
      address: location.address,
      city: location.city,
      state: location.state || "",
      country: location.country,
      phone: location.phone || "",
      email: location.email || "",
      isActive: location.isActive,
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
        <h1 className="text-3xl font-bold mb-8">Manage Locations</h1>
        <Card className="p-6 mb-6">
          <h2 className="text-xl font-semibold mb-4">
            {editing ? "Edit Location" : "Create New Location"}
          </h2>
          <form
            onSubmit={editing ? (e) => { e.preventDefault(); handleUpdate(editing) } : handleCreate}
            className="space-y-4"
          >
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="name">Name</Label>
                <Input
                  id="name"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  required
                />
              </div>
              <div>
                <Label htmlFor="country">Country</Label>
                <Input
                  id="country"
                  value={formData.country}
                  onChange={(e) => setFormData({ ...formData, country: e.target.value })}
                  required
                />
              </div>
            </div>
            <div>
              <Label htmlFor="address">Address</Label>
              <Input
                id="address"
                value={formData.address}
                onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                required
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="city">City</Label>
                <Input
                  id="city"
                  value={formData.city}
                  onChange={(e) => setFormData({ ...formData, city: e.target.value })}
                  required
                />
              </div>
              <div>
                <Label htmlFor="state">State</Label>
                <Input
                  id="state"
                  value={formData.state}
                  onChange={(e) => setFormData({ ...formData, state: e.target.value })}
                />
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="phone">Phone</Label>
                <Input
                  id="phone"
                  value={formData.phone}
                  onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                />
              </div>
              <div>
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                />
              </div>
            </div>
            <div className="flex items-center space-x-2">
              <Checkbox
                id="isActive"
                checked={formData.isActive}
                onCheckedChange={(checked) => setFormData({ ...formData, isActive: !!checked })}
              />
              <Label htmlFor="isActive">Active</Label>
            </div>
            <div className="flex gap-2">
              <Button type="submit">{editing ? "Update" : "Create"}</Button>
              {editing && (
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => {
                    setEditing(null)
                    setFormData({
                      name: "",
                      address: "",
                      city: "",
                      state: "",
                      country: "",
                      phone: "",
                      email: "",
                      isActive: true,
                    })
                  }}
                >
                  Cancel
                </Button>
              )}
            </div>
          </form>
        </Card>
        <div className="space-y-4">
          {locations.map((location) => (
            <Card key={location._id} className="p-6">
              <div className="flex justify-between items-start">
                <div>
                  <h3 className="text-xl font-semibold">{location.name}</h3>
                  <p className="text-gray-600 mt-2">
                    {location.address}, {location.city}
                    {location.state && `, ${location.state}`}, {location.country}
                  </p>
                  {location.phone && <p className="text-sm text-gray-500 mt-1">Phone: {location.phone}</p>}
                  {location.email && <p className="text-sm text-gray-500">Email: {location.email}</p>}
                  <span
                    className={`inline-block mt-2 px-2 py-1 text-xs rounded ${
                      location.isActive ? "bg-green-100 text-green-800" : "bg-gray-100 text-gray-800"
                    }`}
                  >
                    {location.isActive ? "Active" : "Inactive"}
                  </span>
                </div>
                <div className="flex gap-2">
                  <Button variant="outline" size="sm" onClick={() => startEdit(location)}>
                    Edit
                  </Button>
                  <Button variant="destructive" size="sm" onClick={() => handleDelete(location._id)}>
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

