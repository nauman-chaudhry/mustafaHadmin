"use client"

import { AdminLayout } from "@/components/layout/admin-layout"
import { Card } from "@/components/ui/card"
import { useEffect, useState } from "react"
import { api } from "@/lib/api"
import { toast } from "sonner"
import { FileText, Briefcase, MapPin, MessageSquare, Newspaper } from "lucide-react"

export default function DashboardPage() {
  const [stats, setStats] = useState({
    services: 0,
    locations: 0,
    testimonials: 0,
    news: 0,
  })
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const [services, locations, testimonials, news] = await Promise.all([
          api.get("/services").catch(() => []),
          api.get("/locations").catch(() => []),
          api.get("/testimonials").catch(() => []),
          api.get("/news").catch(() => []),
        ])
        setStats({
          services: services.length,
          locations: locations.length,
          testimonials: testimonials.length,
          news: news.length,
        })
      } catch (error: any) {
        toast.error("Failed to load stats")
      } finally {
        setLoading(false)
      }
    }
    fetchStats()
  }, [])

  return (
    <AdminLayout>
      <div>
        <h1 className="text-3xl font-bold mb-8">Dashboard</h1>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <Card className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Services</p>
                <p className="text-3xl font-bold mt-2">{loading ? "..." : stats.services}</p>
              </div>
              <Briefcase className="w-12 h-12 text-blue-500" />
            </div>
          </Card>
          <Card className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Locations</p>
                <p className="text-3xl font-bold mt-2">{loading ? "..." : stats.locations}</p>
              </div>
              <MapPin className="w-12 h-12 text-green-500" />
            </div>
          </Card>
          <Card className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Testimonials</p>
                <p className="text-3xl font-bold mt-2">{loading ? "..." : stats.testimonials}</p>
              </div>
              <MessageSquare className="w-12 h-12 text-purple-500" />
            </div>
          </Card>
          <Card className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">News & Notices</p>
                <p className="text-3xl font-bold mt-2">{loading ? "..." : stats.news}</p>
              </div>
              <Newspaper className="w-12 h-12 text-orange-500" />
            </div>
          </Card>
        </div>
      </div>
    </AdminLayout>
  )
}

