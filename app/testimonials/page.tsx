"use client"

import { AdminLayout } from "@/components/layout/admin-layout"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Checkbox } from "@/components/ui/checkbox"
import { useEffect, useState } from "react"
import { api } from "@/lib/api"
import { toast } from "sonner"
import { Trash2 } from "lucide-react"

export default function TestimonialsPage() {
  const [loading, setLoading] = useState(true)
  const [testimonials, setTestimonials] = useState<any[]>([])
  const [editing, setEditing] = useState<string | null>(null)
  const [formData, setFormData] = useState({
    name: "",
    rating: 5,
    comment: "",
    isApproved: false,
  })

  useEffect(() => {
    fetchTestimonials()
  }, [])

  const fetchTestimonials = async () => {
    try {
      const data = await api.get("/testimonials")
      setTestimonials(data)
    } catch (error: any) {
      toast.error("Failed to load testimonials")
    } finally {
      setLoading(false)
    }
  }

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault()
    try {
      await api.post("/testimonials", formData)
      toast.success("Testimonial created successfully!")
      setFormData({ name: "", rating: 5, comment: "", isApproved: false })
      fetchTestimonials()
    } catch (error: any) {
      toast.error("Failed to create testimonial")
    }
  }

  const handleUpdate = async (id: string) => {
    try {
      await api.put(`/testimonials/${id}`, formData)
      toast.success("Testimonial updated successfully!")
      setEditing(null)
      setFormData({ name: "", rating: 5, comment: "", isApproved: false })
      fetchTestimonials()
    } catch (error: any) {
      toast.error("Failed to update testimonial")
    }
  }

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this testimonial?")) return
    try {
      await api.delete(`/testimonials/${id}`)
      toast.success("Testimonial deleted successfully!")
      fetchTestimonials()
    } catch (error: any) {
      toast.error("Failed to delete testimonial")
    }
  }

  const startEdit = (testimonial: any) => {
    setEditing(testimonial._id)
    setFormData({
      name: testimonial.name,
      rating: testimonial.rating,
      comment: testimonial.comment,
      isApproved: testimonial.isApproved,
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
        <h1 className="text-3xl font-bold mb-8">Manage Testimonials</h1>
        <Card className="p-6 mb-6">
          <h2 className="text-xl font-semibold mb-4">
            {editing ? "Edit Testimonial" : "Create New Testimonial"}
          </h2>
          <form
            onSubmit={editing ? (e) => { e.preventDefault(); handleUpdate(editing) } : handleCreate}
            className="space-y-4"
          >
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
              <Label htmlFor="rating">Rating (1-5)</Label>
              <Input
                id="rating"
                type="number"
                min="1"
                max="5"
                value={formData.rating}
                onChange={(e) => setFormData({ ...formData, rating: parseInt(e.target.value) })}
                required
              />
            </div>
            <div>
              <Label htmlFor="comment">Comment</Label>
              <Textarea
                id="comment"
                value={formData.comment}
                onChange={(e) => setFormData({ ...formData, comment: e.target.value })}
                rows={4}
                required
              />
            </div>
            <div className="flex items-center space-x-2">
              <Checkbox
                id="isApproved"
                checked={formData.isApproved}
                onCheckedChange={(checked) => setFormData({ ...formData, isApproved: !!checked })}
              />
              <Label htmlFor="isApproved">Approved</Label>
            </div>
            <div className="flex gap-2">
              <Button type="submit">{editing ? "Update" : "Create"}</Button>
              {editing && (
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => {
                    setEditing(null)
                    setFormData({ name: "", rating: 5, comment: "", isApproved: false })
                  }}
                >
                  Cancel
                </Button>
              )}
            </div>
          </form>
        </Card>
        <div className="space-y-4">
          {testimonials.map((testimonial) => (
            <Card key={testimonial._id} className="p-6">
              <div className="flex justify-between items-start">
                <div>
                  <h3 className="text-xl font-semibold">{testimonial.name}</h3>
                  <p className="text-gray-600 mt-2">"{testimonial.comment}"</p>
                  <p className="text-sm text-gray-500 mt-2">Rating: {testimonial.rating}/5</p>
                  <span
                    className={`inline-block mt-2 px-2 py-1 text-xs rounded ${
                      testimonial.isApproved ? "bg-green-100 text-green-800" : "bg-yellow-100 text-yellow-800"
                    }`}
                  >
                    {testimonial.isApproved ? "Approved" : "Pending"}
                  </span>
                </div>
                <div className="flex gap-2">
                  <Button variant="outline" size="sm" onClick={() => startEdit(testimonial)}>
                    Edit
                  </Button>
                  <Button variant="destructive" size="sm" onClick={() => handleDelete(testimonial._id)}>
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

