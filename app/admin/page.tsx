"use client"
import { useUser } from "@clerk/nextjs"
import { useRouter } from "next/navigation"
import { useEffect, useState } from "react"
import { AdminSidebar } from "@/components/layout/admin-sidebar"
import { AdminJobsTable } from "@/components/jobs/admin-jobs-table"
import { AdminJobForm } from "@/components/jobs/admin-job-form"

const sections = [
  { key: "jobs", label: "Jobs Management" },
]

export default function AdminDashboard() {
  const { user, isLoaded } = useUser()
  const router = useRouter()
  const [active, setActive] = useState("jobs")
  const [showJobForm, setShowJobForm] = useState(false)
  const [editingJob, setEditingJob] = useState<any | null>(null)
  const [refreshJobs, setRefreshJobs] = useState(0)

  useEffect(() => {
    if (isLoaded && (!user || user.publicMetadata.role !== "admin")) {
      router.replace("/")
    }
  }, [user, isLoaded, router])

  const handleEditJob = (job: any) => {
    setEditingJob(job)
    setShowJobForm(true)
  }
  const handleNewJob = () => {
    setEditingJob(null)
    setShowJobForm(true)
  }
  const handleJobFormSuccess = () => {
    setShowJobForm(false)
    setEditingJob(null)
    setRefreshJobs((r) => r + 1)
  }
  const handleJobFormCancel = () => {
    setShowJobForm(false)
    setEditingJob(null)
  }

  if (!isLoaded) return <div>Loading...</div>
  if (!user || user.publicMetadata.role !== "admin") return null

  return (
    <div className="min-h-screen flex">
      <AdminSidebar active={active} setActive={setActive} />
      <main className="flex-1 p-10">
        {active === "jobs" && (
          <div>
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-xl font-semibold">Jobs Management</h3>
              <button className="bg-blue-600 text-white px-4 py-2 rounded" onClick={handleNewJob}>Post New Job</button>
            </div>
            {showJobForm ? (
              <AdminJobForm job={editingJob} onSuccess={handleJobFormSuccess} onCancel={handleJobFormCancel} />
            ) : (
              <AdminJobsTable key={refreshJobs} onEdit={handleEditJob} />
            )}
          </div>
        )}
      </main>
    </div>
  )
} 