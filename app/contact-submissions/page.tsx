"use client"

import { AdminLayout } from "@/components/layout/admin-layout"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { useEffect, useState } from "react"
import { api } from "@/lib/api"
import { toast } from "sonner"
import { Trash2, Mail, User, MessageSquare, CheckCircle2, Circle } from "lucide-react"
import { Badge } from "@/components/ui/badge"

export default function ContactSubmissionsPage() {
  const [loading, setLoading] = useState(true)
  const [submissions, setSubmissions] = useState<any[]>([])
  const [selectedSubmission, setSelectedSubmission] = useState<any>(null)

  useEffect(() => {
    fetchSubmissions()
  }, [])

  const fetchSubmissions = async () => {
    try {
      const data = await api.get("/contact-submissions")
      setSubmissions(data)
    } catch (error: any) {
      toast.error("Failed to load contact submissions")
    } finally {
      setLoading(false)
    }
  }

  const handleMarkAsRead = async (id: string) => {
    try {
      await api.put(`/contact-submissions/${id}/read`)
      toast.success("Marked as read")
      fetchSubmissions()
    } catch (error: any) {
      toast.error("Failed to update submission")
    }
  }

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this submission?")) return
    try {
      await api.delete(`/contact-submissions/${id}`)
      toast.success("Submission deleted successfully!")
      if (selectedSubmission?._id === id) {
        setSelectedSubmission(null)
      }
      fetchSubmissions()
    } catch (error: any) {
      toast.error("Failed to delete submission")
    }
  }

  const unreadCount = submissions.filter((s) => !s.read).length

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
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold">Contact Submissions</h1>
            <p className="text-gray-600 mt-2">
              {submissions.length} total submission{submissions.length !== 1 ? "s" : ""}
              {unreadCount > 0 && (
                <Badge className="ml-2 bg-blue-500">
                  {unreadCount} unread
                </Badge>
              )}
            </p>
          </div>
        </div>

        <div className="grid lg:grid-cols-3 gap-6">
          {/* Submissions List */}
          <div className="lg:col-span-1 space-y-3">
            {submissions.length === 0 ? (
              <Card className="p-6 text-center text-gray-500">
                No submissions yet
              </Card>
            ) : (
              submissions.map((submission) => (
                <Card
                  key={submission._id}
                  className={`p-4 cursor-pointer transition-all hover:shadow-md ${
                    selectedSubmission?._id === submission._id
                      ? "border-blue-500 border-2"
                      : submission.read
                      ? "border-gray-200"
                      : "border-blue-300 border-2 bg-blue-50"
                  }`}
                  onClick={() => setSelectedSubmission(submission)}
                >
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <User className="w-4 h-4 text-gray-500" />
                        <span className="font-semibold">{submission.name}</span>
                        {!submission.read && (
                          <Circle className="w-3 h-3 text-blue-500 fill-blue-500" />
                        )}
                      </div>
                      <div className="flex items-center gap-2 text-sm text-gray-600 mb-2">
                        <Mail className="w-3 h-3" />
                        <span>{submission.email}</span>
                      </div>
                      <p className="text-sm text-gray-500 line-clamp-2">
                        {submission.message}
                      </p>
                      <p className="text-xs text-gray-400 mt-2">
                        {new Date(submission.createdAt).toLocaleString()}
                      </p>
                    </div>
                  </div>
                </Card>
              ))
            )}
          </div>

          {/* Submission Details */}
          <div className="lg:col-span-2">
            {selectedSubmission ? (
              <Card className="p-6">
                <div className="flex items-start justify-between mb-6">
                  <div>
                    <h2 className="text-2xl font-bold mb-2">{selectedSubmission.name}</h2>
                    <div className="flex items-center gap-4 text-gray-600">
                      <div className="flex items-center gap-2">
                        <Mail className="w-4 h-4" />
                        <a
                          href={`mailto:${selectedSubmission.email}`}
                          className="hover:text-blue-600"
                        >
                          {selectedSubmission.email}
                        </a>
                      </div>
                      <span className="text-sm">
                        {new Date(selectedSubmission.createdAt).toLocaleString()}
                      </span>
                    </div>
                  </div>
                  <div className="flex gap-2">
                    {!selectedSubmission.read && (
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleMarkAsRead(selectedSubmission._id)}
                      >
                        <CheckCircle2 className="w-4 h-4 mr-2" />
                        Mark as Read
                      </Button>
                    )}
                    <Button
                      variant="destructive"
                      size="sm"
                      onClick={() => handleDelete(selectedSubmission._id)}
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>
                </div>

                <div className="space-y-4">
                  <div>
                    <div className="flex items-center gap-2 mb-2 text-gray-700 font-semibold">
                      <MessageSquare className="w-5 h-5" />
                      <span>Message</span>
                    </div>
                    <div className="bg-gray-50 p-4 rounded-lg">
                      <p className="text-gray-700 whitespace-pre-wrap">{selectedSubmission.message}</p>
                    </div>
                  </div>

                  <div className="flex items-center gap-2 pt-4 border-t">
                    <span className="text-sm text-gray-500">Status:</span>
                    {selectedSubmission.read ? (
                      <Badge className="bg-green-100 text-green-800">
                        <CheckCircle2 className="w-3 h-3 mr-1" />
                        Read
                      </Badge>
                    ) : (
                      <Badge className="bg-blue-100 text-blue-800">
                        <Circle className="w-3 h-3 mr-1" />
                        Unread
                      </Badge>
                    )}
                  </div>
                </div>
              </Card>
            ) : (
              <Card className="p-12 text-center text-gray-500">
                <MessageSquare className="w-16 h-16 mx-auto mb-4 text-gray-300" />
                <p>Select a submission to view details</p>
              </Card>
            )}
          </div>
        </div>
      </div>
    </AdminLayout>
  )
}

