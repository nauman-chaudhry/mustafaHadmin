"use client"

import { AdminLayout } from "@/components/layout/admin-layout"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { useEffect, useState } from "react"
import { api } from "@/lib/api"
import { toast } from "sonner"
import { Trash2, Plus } from "lucide-react"

export default function NewsPage() {
  const [loading, setLoading] = useState(true)
  const [news, setNews] = useState<any[]>([])
  const [editing, setEditing] = useState<string | null>(null)
  const [formData, setFormData] = useState({
    title: "",
    content: "",
    type: "news",
    date: new Date().toISOString().split("T")[0],
    links: [{ text: "", url: "" }],
  })

  useEffect(() => {
    fetchNews()
  }, [])

  const fetchNews = async () => {
    try {
      const data = await api.get("/news")
      setNews(data)
    } catch (error: any) {
      toast.error("Failed to load news")
    } finally {
      setLoading(false)
    }
  }

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault()
    try {
      await api.post("/news", { ...formData, date: new Date(formData.date) })
      toast.success("News item created successfully!")
      setFormData({
        title: "",
        content: "",
        type: "news",
        date: new Date().toISOString().split("T")[0],
        links: [{ text: "", url: "" }],
      })
      fetchNews()
    } catch (error: any) {
      toast.error("Failed to create news item")
    }
  }

  const handleUpdate = async (id: string) => {
    try {
      await api.put(`/news/${id}`, { ...formData, date: new Date(formData.date) })
      toast.success("News item updated successfully!")
      setEditing(null)
      setFormData({
        title: "",
        content: "",
        type: "news",
        date: new Date().toISOString().split("T")[0],
        links: [{ text: "", url: "" }],
      })
      fetchNews()
    } catch (error: any) {
      toast.error("Failed to update news item")
    }
  }

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this news item?")) return
    try {
      await api.delete(`/news/${id}`)
      toast.success("News item deleted successfully!")
      fetchNews()
    } catch (error: any) {
      toast.error("Failed to delete news item")
    }
  }

  const startEdit = (item: any) => {
    setEditing(item._id)
    setFormData({
      title: item.title,
      content: item.content,
      type: item.type,
      date: new Date(item.date).toISOString().split("T")[0],
      links: item.links?.length ? item.links : [{ text: "", url: "" }],
    })
  }

  const addLink = () => {
    setFormData({ ...formData, links: [...formData.links, { text: "", url: "" }] })
  }

  const removeLink = (index: number) => {
    if (formData.links.length > 1) {
      const newLinks = formData.links.filter((_, i) => i !== index)
      setFormData({ ...formData, links: newLinks })
    } else {
      toast.error("At least one link is required")
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
        <h1 className="text-3xl font-bold mb-8">Manage News & Notices</h1>
        <Card className="p-6 mb-6">
          <h2 className="text-xl font-semibold mb-4">{editing ? "Edit News Item" : "Create New News Item"}</h2>
          <form
            onSubmit={editing ? (e) => { e.preventDefault(); handleUpdate(editing) } : handleCreate}
            className="space-y-4"
          >
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
              <Label htmlFor="content">Content</Label>
              <Textarea
                id="content"
                value={formData.content}
                onChange={(e) => setFormData({ ...formData, content: e.target.value })}
                rows={6}
                required
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="type">Type</Label>
                <Select value={formData.type} onValueChange={(value) => setFormData({ ...formData, type: value })}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="news">News</SelectItem>
                    <SelectItem value="notice">Notice</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label htmlFor="date">Date</Label>
                <Input
                  id="date"
                  type="date"
                  value={formData.date}
                  onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                  required
                />
              </div>
            </div>
            <div>
              <div className="flex items-center justify-between mb-4">
                <Label>Links</Label>
                <Button type="button" variant="outline" size="sm" onClick={addLink}>
                  <Plus className="w-4 h-4 mr-2" />
                  Add Link
                </Button>
              </div>
              <div className="space-y-3">
                {formData.links.map((link, index) => (
                  <div key={index} className="flex gap-3">
                    <div className="flex-1 grid grid-cols-2 gap-3">
                      <Input
                        placeholder="Link Text"
                        value={link.text}
                        onChange={(e) => {
                          const newLinks = [...formData.links]
                          newLinks[index].text = e.target.value
                          setFormData({ ...formData, links: newLinks })
                        }}
                      />
                      <Input
                        placeholder="URL"
                        value={link.url}
                        onChange={(e) => {
                          const newLinks = [...formData.links]
                          newLinks[index].url = e.target.value
                          setFormData({ ...formData, links: newLinks })
                        }}
                      />
                    </div>
                    <Button
                      type="button"
                      variant="destructive"
                      size="sm"
                      onClick={() => removeLink(index)}
                      disabled={formData.links.length === 1}
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>
                ))}
              </div>
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
                      title: "",
                      content: "",
                      type: "news",
                      date: new Date().toISOString().split("T")[0],
                      links: [{ text: "", url: "" }],
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
          {news.map((item) => (
            <Card key={item._id} className="p-6">
              <div className="flex justify-between items-start">
                <div>
                  <div className="flex items-center gap-2">
                    <h3 className="text-xl font-semibold">{item.title}</h3>
                    <span className="px-2 py-1 text-xs rounded bg-blue-100 text-blue-800">
                      {item.type}
                    </span>
                  </div>
                  <p className="text-gray-600 mt-2">{item.content.substring(0, 200)}...</p>
                  <p className="text-sm text-gray-500 mt-2">
                    {new Date(item.date).toLocaleDateString()}
                  </p>
                </div>
                <div className="flex gap-2">
                  <Button variant="outline" size="sm" onClick={() => startEdit(item)}>
                    Edit
                  </Button>
                  <Button variant="destructive" size="sm" onClick={() => handleDelete(item._id)}>
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
