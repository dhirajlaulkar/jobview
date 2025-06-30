import React, { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"

export function AdminJobForm({ job, onSuccess, onCancel }: { job?: any, onSuccess: () => void, onCancel: () => void }) {
  const [form, setForm] = useState({
    title: "",
    description: "",
    requirements: "",
    salaryMin: "",
    salaryMax: "",
    location: "",
    jobType: "Full-time",
    experienceLevel: "Entry",
    category: "Programming/Development",
    companyName: "",
    status: "active",
  })
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    if (job) {
      setForm({
        ...form,
        ...job,
        salaryMin: job.salaryMin || "",
        salaryMax: job.salaryMax || "",
      })
    }
    // eslint-disable-next-line
  }, [job])

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setForm((f) => ({ ...f, [name]: value }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError(null)
    try {
      const method = job ? "PUT" : "POST"
      const url = job ? `/api/jobs/${job.id}` : "/api/jobs"
      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...form,
          salaryMin: form.salaryMin ? Number(form.salaryMin) : null,
          salaryMax: form.salaryMax ? Number(form.salaryMax) : null,
        }),
      })
      const data = await res.json()
      if (data.success) {
        onSuccess()
      } else {
        setError(data.error || "Failed to save job")
      }
    } catch {
      setError("Network error")
    } finally {
      setLoading(false)
    }
  }

  return (
    <form className="space-y-4 max-w-xl" onSubmit={handleSubmit}>
      <h3 className="text-lg font-semibold mb-2">{job ? "Edit Job" : "Post New Job"}</h3>
      {error && <div className="text-red-500">{error}</div>}
      
      <div>
        <label className="block font-medium">Title</label>
        <input className="w-full border bg-white p-2 rounded" name="title" value={form.title} onChange={handleChange} required />
      </div>
      
      <div>
        <label className="block font-medium">Company Name</label>
        <input className="w-full border bg-white p-2 rounded" name="companyName" value={form.companyName} onChange={handleChange} required />
      </div>
      
      <div>
        <label className="block font-medium">Description</label>
        <textarea className="w-full border bg-white p-2 rounded" name="description" value={form.description} onChange={handleChange} required rows={4} />
      </div>
      
      <div>
        <label className="block font-medium">Requirements</label>
        <textarea className="w-full border bg-white p-2 rounded" name="requirements" value={form.requirements} onChange={handleChange} rows={3} />
      </div>
      
      <div className="flex gap-4">
        <div className="flex-1">
          <label className="block font-medium">Salary Min</label>
          <input className="w-full border bg-white p-2 rounded" name="salaryMin" type="number" value={form.salaryMin} onChange={handleChange} />
        </div>
        <div className="flex-1">
          <label className="block font-medium">Salary Max</label>
          <input className="w-full border bg-white p-2 rounded" name="salaryMax" type="number" value={form.salaryMax} onChange={handleChange} />
        </div>
      </div>
      
      <div>
        <label className="block font-medium">Location</label>
        <input className="w-full border bg-white p-2 rounded" name="location" value={form.location} onChange={handleChange} required />
      </div>
      
      <div>
        <label className="block font-medium">Job Type</label>
        <select className="w-full border bg-white p-2 rounded" name="jobType" value={form.jobType} onChange={handleChange}>
          <option value="Full-time">Full-time</option>
          <option value="Part-time">Part-time</option>
          <option value="Contract">Contract</option>
          <option value="Internship">Internship</option>
          <option value="Remote">Remote</option>
        </select>
      </div>
      
      <div>
        <label className="block font-medium">Experience Level</label>
        <select className="w-full border bg-white p-2 rounded" name="experienceLevel" value={form.experienceLevel} onChange={handleChange}>
          <option value="Entry">Entry Level</option>
          <option value="Mid">Mid Level</option>
          <option value="Senior">Senior Level</option>
          <option value="Lead">Lead</option>
          <option value="Executive">Executive</option>
        </select>
      </div>
      
      <div>
        <label className="block font-medium">Category</label>
        <select className="w-full border bg-white p-2 rounded" name="category" value={form.category} onChange={handleChange}>
          <option value="Programming/Development">Programming/Development</option>
          <option value="Design">Design</option>
          <option value="Sales">Sales</option>
          <option value="Customer Support">Customer Support</option>
          <option value="Marketing">Marketing</option>
          <option value="Project Management">Project Management</option>
          <option value="Copywriting">Copywriting</option>
          <option value="Technology & IT">Technology & IT</option>
        </select>
      </div>
      
      <div>
        <label className="block font-medium">Status</label>
        <select className="w-full border bg-white p-2 rounded" name="status" value={form.status} onChange={handleChange}>
          <option value="active">Active</option>
          <option value="inactive">Inactive</option>
        </select>
      </div>
      
      <div className="flex gap-2 mt-4">
        <Button type="submit" disabled={loading}>{loading ? "Saving..." : job ? "Update Job" : "Post Job"}</Button>
        <Button type="button" variant="outline" onClick={onCancel}>Cancel</Button>
      </div>
    </form>
  )
} 