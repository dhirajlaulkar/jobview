import React, { useEffect, useState } from "react"
import { Button } from "@/components/ui/button"

export function AdminJobsTable({ onEdit }: { onEdit: (job: any) => void }) {
  const [jobs, setJobs] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    fetchJobs()
  }, [])

  const fetchJobs = async () => {
    setLoading(true)
    setError(null)
    try {
      const res = await fetch("/api/jobs")
      const data = await res.json()
      if (data.success) setJobs(data.data)
      else setError(data.error || "Failed to fetch jobs")
    } catch (err) {
      setError("Network error")
    } finally {
      setLoading(false)
    }
  }

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this job?")) return
    try {
      const res = await fetch(`/api/jobs/${id}`, { method: "DELETE" })
      const data = await res.json()
      if (data.success) {
        setJobs(jobs.filter((job) => job.id !== id))
      } else {
        alert(data.error || "Failed to delete job")
      }
    } catch {
      alert("Network error")
    }
  }

  if (loading) return <div>Loading jobs...</div>
  if (error) return <div className="text-red-500">{error}</div>

  return (
    <div className="overflow-x-auto">
      <table className="min-w-full border bg-white">
        <thead>
          <tr>
            <th className="p-2 border-b">Title</th>
            <th className="p-2 border-b">Company</th>
            <th className="p-2 border-b">Location</th>
            <th className="p-2 border-b">Category</th>
            <th className="p-2 border-b">Status</th>
            <th className="p-2 border-b">Actions</th>
          </tr>
        </thead>
        <tbody>
          {jobs.map((job) => (
            <tr key={job.id}>
              <td className="p-2 border-b">{job.title}</td>
              <td className="p-2 border-b">{job.companyName}</td>
              <td className="p-2 border-b">{job.location}</td>
              <td className="p-2 border-b">{job.category}</td>
              <td className="p-2 border-b">
                <span className={`px-2 py-1 rounded text-xs ${job.status === 'active' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
                  {job.status}
                </span>
              </td>
              <td className="p-2 border-b flex gap-2">
                <Button size="sm" variant="outline" onClick={() => onEdit(job)}>Edit</Button>
                <Button size="sm" variant="destructive" onClick={() => handleDelete(job.id)}>Delete</Button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
} 