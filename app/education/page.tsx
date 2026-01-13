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

export default function EducationPage() {
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [formData, setFormData] = useState({
    undergraduate: { institution: "", degree: "", year: "", honors: "" },
    medicalDegrees: [{ institution: "", degree: "", year: "" }],
    residencies: [{ institution: "", specialty: "", yearFrom: "", yearTo: "" }],
    fellowships: [{ institution: "", specialty: "", yearFrom: "", yearTo: "" }],
    boardCertifications: [{ name: "", board: "" }],
    professionalFellowships: [{ name: "", organization: "" }],
    licenses: [{ state: "", type: "", yearFrom: "", yearTo: "" }],
  })

  useEffect(() => {
    const fetchData = async () => {
      try {
        const data = await api.get("/education")
        setFormData({
          undergraduate: data.undergraduate || { institution: "", degree: "", year: "", honors: "" },
          medicalDegrees: data.medicalDegrees?.length ? data.medicalDegrees : [{ institution: "", degree: "", year: "" }],
          residencies: data.residencies?.length ? data.residencies : [{ institution: "", specialty: "", yearFrom: "", yearTo: "" }],
          fellowships: data.fellowships?.length ? data.fellowships : [{ institution: "", specialty: "", yearFrom: "", yearTo: "" }],
          boardCertifications: data.boardCertifications?.length ? data.boardCertifications : [{ name: "", board: "" }],
          professionalFellowships: data.professionalFellowships?.length ? data.professionalFellowships : [{ name: "", organization: "" }],
          licenses: data.licenses?.length ? data.licenses : [{ state: "", type: "", yearFrom: "", yearTo: "" }],
        })
      } catch (error: any) {
        toast.error("Failed to load education data")
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
      await api.put("/education", formData)
      toast.success("Education section updated successfully!")
    } catch (error: any) {
      toast.error("Failed to update education section")
    } finally {
      setSaving(false)
    }
  }

  const addItem = (field: string) => {
    const defaults: any = {
      medicalDegrees: { institution: "", degree: "", year: "" },
      residencies: { institution: "", specialty: "", yearFrom: "", yearTo: "" },
      fellowships: { institution: "", specialty: "", yearFrom: "", yearTo: "" },
      boardCertifications: { name: "", board: "" },
      professionalFellowships: { name: "", organization: "" },
      licenses: { state: "", type: "", yearFrom: "", yearTo: "" },
    }
    setFormData({
      ...formData,
      [field]: [...(formData[field as keyof typeof formData] as any[]), defaults[field]],
    })
  }

  const removeItem = (field: string, index: number) => {
    const items = formData[field as keyof typeof formData] as any[]
    if (items.length > 1) {
      setFormData({
        ...formData,
        [field]: items.filter((_, i) => i !== index),
      })
    } else {
      toast.error("At least one item is required")
    }
  }

  const updateItem = (field: string, index: number, key: string, value: string) => {
    const items = [...(formData[field as keyof typeof formData] as any[])]
    items[index] = { ...items[index], [key]: value }
    setFormData({ ...formData, [field]: items })
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
        <h1 className="text-3xl font-bold mb-8">Edit Education</h1>
        <Card className="p-6">
          <form onSubmit={handleSubmit} className="space-y-8">
            {/* Undergraduate */}
            <div>
              <h3 className="text-lg font-semibold mb-4">Undergraduate Education</h3>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label>Institution</Label>
                  <Input
                    value={formData.undergraduate.institution}
                    onChange={(e) => setFormData({ ...formData, undergraduate: { ...formData.undergraduate, institution: e.target.value } })}
                  />
                </div>
                <div>
                  <Label>Degree</Label>
                  <Input
                    value={formData.undergraduate.degree}
                    onChange={(e) => setFormData({ ...formData, undergraduate: { ...formData.undergraduate, degree: e.target.value } })}
                  />
                </div>
                <div>
                  <Label>Year</Label>
                  <Input
                    value={formData.undergraduate.year}
                    onChange={(e) => setFormData({ ...formData, undergraduate: { ...formData.undergraduate, year: e.target.value } })}
                  />
                </div>
                <div>
                  <Label>Honors</Label>
                  <Input
                    value={formData.undergraduate.honors}
                    onChange={(e) => setFormData({ ...formData, undergraduate: { ...formData.undergraduate, honors: e.target.value } })}
                  />
                </div>
              </div>
            </div>

            {/* Medical Degrees */}
            <div>
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold">Medical Degrees</h3>
                <Button type="button" variant="outline" size="sm" onClick={() => addItem("medicalDegrees")}>
                  <Plus className="w-4 h-4 mr-2" />
                  Add Degree
                </Button>
              </div>
              <div className="space-y-3">
                {formData.medicalDegrees.map((degree, index) => (
                  <div key={index} className="flex gap-3 items-end border p-3 rounded">
                    <div className="flex-1 grid grid-cols-3 gap-3">
                      <div>
                        <Label>Institution</Label>
                        <Input value={degree.institution} onChange={(e) => updateItem("medicalDegrees", index, "institution", e.target.value)} />
                      </div>
                      <div>
                        <Label>Degree</Label>
                        <Input value={degree.degree} onChange={(e) => updateItem("medicalDegrees", index, "degree", e.target.value)} />
                      </div>
                      <div>
                        <Label>Year</Label>
                        <Input value={degree.year} onChange={(e) => updateItem("medicalDegrees", index, "year", e.target.value)} />
                      </div>
                    </div>
                    <Button type="button" variant="destructive" size="sm" onClick={() => removeItem("medicalDegrees", index)}>
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>
                ))}
              </div>
            </div>

            {/* Residencies */}
            <div>
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold">Residencies</h3>
                <Button type="button" variant="outline" size="sm" onClick={() => addItem("residencies")}>
                  <Plus className="w-4 h-4 mr-2" />
                  Add Residency
                </Button>
              </div>
              <div className="space-y-3">
                {formData.residencies.map((residency, index) => (
                  <div key={index} className="flex gap-3 items-end border p-3 rounded">
                    <div className="flex-1 grid grid-cols-4 gap-3">
                      <div>
                        <Label>Institution</Label>
                        <Input value={residency.institution} onChange={(e) => updateItem("residencies", index, "institution", e.target.value)} />
                      </div>
                      <div>
                        <Label>Specialty</Label>
                        <Input value={residency.specialty} onChange={(e) => updateItem("residencies", index, "specialty", e.target.value)} />
                      </div>
                      <div>
                        <Label>Year From</Label>
                        <Input value={residency.yearFrom} onChange={(e) => updateItem("residencies", index, "yearFrom", e.target.value)} />
                      </div>
                      <div>
                        <Label>Year To</Label>
                        <Input value={residency.yearTo} onChange={(e) => updateItem("residencies", index, "yearTo", e.target.value)} />
                      </div>
                    </div>
                    <Button type="button" variant="destructive" size="sm" onClick={() => removeItem("residencies", index)}>
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>
                ))}
              </div>
            </div>

            {/* Fellowships */}
            <div>
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold">Fellowships</h3>
                <Button type="button" variant="outline" size="sm" onClick={() => addItem("fellowships")}>
                  <Plus className="w-4 h-4 mr-2" />
                  Add Fellowship
                </Button>
              </div>
              <div className="space-y-3">
                {formData.fellowships.map((fellowship, index) => (
                  <div key={index} className="flex gap-3 items-end border p-3 rounded">
                    <div className="flex-1 grid grid-cols-4 gap-3">
                      <div>
                        <Label>Institution</Label>
                        <Input value={fellowship.institution} onChange={(e) => updateItem("fellowships", index, "institution", e.target.value)} />
                      </div>
                      <div>
                        <Label>Specialty</Label>
                        <Input value={fellowship.specialty} onChange={(e) => updateItem("fellowships", index, "specialty", e.target.value)} />
                      </div>
                      <div>
                        <Label>Year From</Label>
                        <Input value={fellowship.yearFrom} onChange={(e) => updateItem("fellowships", index, "yearFrom", e.target.value)} />
                      </div>
                      <div>
                        <Label>Year To</Label>
                        <Input value={fellowship.yearTo} onChange={(e) => updateItem("fellowships", index, "yearTo", e.target.value)} />
                      </div>
                    </div>
                    <Button type="button" variant="destructive" size="sm" onClick={() => removeItem("fellowships", index)}>
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>
                ))}
              </div>
            </div>

            {/* Board Certifications */}
            <div>
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold">Board Certifications</h3>
                <Button type="button" variant="outline" size="sm" onClick={() => addItem("boardCertifications")}>
                  <Plus className="w-4 h-4 mr-2" />
                  Add Certification
                </Button>
              </div>
              <div className="space-y-3">
                {formData.boardCertifications.map((cert, index) => (
                  <div key={index} className="flex gap-3 items-end border p-3 rounded">
                    <div className="flex-1 grid grid-cols-2 gap-3">
                      <div>
                        <Label>Certification Name</Label>
                        <Input value={cert.name} onChange={(e) => updateItem("boardCertifications", index, "name", e.target.value)} />
                      </div>
                      <div>
                        <Label>Board</Label>
                        <Input value={cert.board} onChange={(e) => updateItem("boardCertifications", index, "board", e.target.value)} />
                      </div>
                    </div>
                    <Button type="button" variant="destructive" size="sm" onClick={() => removeItem("boardCertifications", index)}>
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>
                ))}
              </div>
            </div>

            {/* Professional Fellowships */}
            <div>
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold">Professional Fellowships</h3>
                <Button type="button" variant="outline" size="sm" onClick={() => addItem("professionalFellowships")}>
                  <Plus className="w-4 h-4 mr-2" />
                  Add Fellowship
                </Button>
              </div>
              <div className="space-y-3">
                {formData.professionalFellowships.map((fellowship, index) => (
                  <div key={index} className="flex gap-3 items-end border p-3 rounded">
                    <div className="flex-1 grid grid-cols-2 gap-3">
                      <div>
                        <Label>Fellowship Name</Label>
                        <Input value={fellowship.name} onChange={(e) => updateItem("professionalFellowships", index, "name", e.target.value)} />
                      </div>
                      <div>
                        <Label>Organization</Label>
                        <Input value={fellowship.organization} onChange={(e) => updateItem("professionalFellowships", index, "organization", e.target.value)} />
                      </div>
                    </div>
                    <Button type="button" variant="destructive" size="sm" onClick={() => removeItem("professionalFellowships", index)}>
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>
                ))}
              </div>
            </div>

            {/* Licenses */}
            <div>
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold">Medical Licenses</h3>
                <Button type="button" variant="outline" size="sm" onClick={() => addItem("licenses")}>
                  <Plus className="w-4 h-4 mr-2" />
                  Add License
                </Button>
              </div>
              <div className="space-y-3">
                {formData.licenses.map((license, index) => (
                  <div key={index} className="flex gap-3 items-end border p-3 rounded">
                    <div className="flex-1 grid grid-cols-4 gap-3">
                      <div>
                        <Label>State</Label>
                        <Input value={license.state} onChange={(e) => updateItem("licenses", index, "state", e.target.value)} />
                      </div>
                      <div>
                        <Label>Type</Label>
                        <Input value={license.type} onChange={(e) => updateItem("licenses", index, "type", e.target.value)} />
                      </div>
                      <div>
                        <Label>Year From</Label>
                        <Input value={license.yearFrom} onChange={(e) => updateItem("licenses", index, "yearFrom", e.target.value)} />
                      </div>
                      <div>
                        <Label>Year To</Label>
                        <Input value={license.yearTo} onChange={(e) => updateItem("licenses", index, "yearTo", e.target.value)} />
                      </div>
                    </div>
                    <Button type="button" variant="destructive" size="sm" onClick={() => removeItem("licenses", index)}>
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
