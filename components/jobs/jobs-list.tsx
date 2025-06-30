"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { MapPin, Clock,  Building } from "lucide-react"
import Link from "next/link"
import type { JobFilters } from "./jobs-filter"

interface JobsListProps {
  query: string
  location: string
  filters: JobFilters
  setLoading: (loading: boolean) => void
}

export function JobsList({ query, location, filters, setLoading }: JobsListProps) {
  const [jobs, setJobs] = useState<any[]>([])
  const [error, setError] = useState<string | null>(null)
  const [savedJobs, setSavedJobs] = useState<string[]>([])

  useEffect(() => {
    const fetchJobs = async () => {
      setLoading(true)
      setError(null)
      try {
        const params = new URLSearchParams()
        if (query) params.append("q", query)
        if (location) params.append("location", location)
        
        // Append filters to params
        if (filters.salaryMin > 0) params.append("salaryMin", filters.salaryMin.toString())
        if (filters.jobTypes.length > 0) params.append("jobTypes", filters.jobTypes.join(","))
        if (filters.experienceLevels.length > 0) params.append("experienceLevels", filters.experienceLevels.join(","))

        const res = await fetch(`/api/jobs?${params.toString()}`)
        const data = await res.json()
        if (data.success) {
          setJobs(data.data)
        } else {
          setError(data.error || "Failed to fetch jobs")
        }
      } catch (err) {
        setError("Network error")
      } finally {
        setLoading(false)
      }
    }
    
    fetchJobs()
  }, [query, location, filters, setLoading])

  const toggleSaveJob = (jobId: string) => {
    setSavedJobs((prev) => (prev.includes(jobId) ? prev.filter((id) => id !== jobId) : [...prev, jobId]))
  }

  const formatSalary = (min: number | null, max: number | null) => {
    if (!min && !max) return "Not specified"
    if (min && max) return `₹${(min/100000).toFixed(1)}-${(max/100000).toFixed(1)} LPA`
    if (min) return `₹${(min/100000).toFixed(1)}+ LPA`
    if (max) return `Up to ₹${(max/100000).toFixed(1)} LPA`
    return "Not specified"
  }

  const formatPostedTime = (date: string) => {
    const postedDate = new Date(date)
    const now = new Date()
    const diffInDays = Math.floor((now.getTime() - postedDate.getTime()) / (1000 * 60 * 60 * 24))
    
    if (diffInDays === 0) return "Today"
    if (diffInDays === 1) return "1 day ago"
    if (diffInDays < 7) return `${diffInDays} days ago`
    return `${Math.floor(diffInDays / 30)} months ago`
  }

  if (error) return <div className="text-red-500 text-center py-8">{error}</div>

  return (
    <div className="space-y-6">
      {/* Results Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h2 className="text-xl font-semibold text-gray-900">{jobs.length.toLocaleString()} JobView Jobs Found</h2>
          <p className="text-gray-600">Curated job opportunities from top companies</p>
        </div>
      </div>

      {/* Job Cards */}
      <div className="space-y-4">
        {jobs.length === 0 ? (
          <div className="text-center py-12">
            <h3 className="text-lg font-semibold text-gray-900 mb-2">No jobs found</h3>
            <p className="text-gray-600">Try adjusting your search criteria or check back later for new opportunities.</p>
          </div>
        ) : (
          jobs.map((job) => (
            <Card
              key={job.id}
              className="hover:shadow-xl transition-all duration-300 hover:-translate-y-1 border-0 shadow-md">
              <CardHeader className="pb-4">
                <div className="flex items-start justify-between">
                  <div className="flex items-start space-x-4 flex-1">
                    <div className="relative">
                      <div className="w-16 h-16 rounded-xl bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center flex-shrink-0">
                        <Building className="h-8 w-8 text-white" />
                      </div>
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-start justify-between mb-3">
                        <div>
                          <h3 className="font-bold text-xl text-gray-900 hover:text-blue-600 transition-colors mb-2">
                            <Link href={`/jobs/${job.id}`}>{job.title}</Link>
                          </h3>
                          <Badge className="bg-gradient-to-r from-blue-500 to-indigo-600 text-white border-0">
                            JobView
                          </Badge>
                        </div>
                        <div className="flex items-center space-x-2 flex-shrink-0">
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => toggleSaveJob(job.id)}
                            className={`hover:scale-110 transition-transform ${
                              savedJobs.includes(job.id) ? "text-red-500" : "text-gray-400 hover:text-red-500"
                            }`}
                          >
                            
                          </Button>
                         
                        </div>
                      </div>

                      <div className="flex items-center text-gray-600 mb-4">
                        <Building className="h-4 w-4 mr-2" />
                        <span className="font-semibold">{job.companyName}</span>
                        <span className="mx-3">•</span>
                        <MapPin className="h-4 w-4 mr-1" />
                        <span>{job.location}</span>
                        {job.jobType === "Remote" && (
                          <>
                            <span className="mx-3">•</span>
                            <Badge variant="secondary" className="text-xs bg-green-100 text-green-700">
                              Remote
                            </Badge>
                          </>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              </CardHeader>

              <CardContent className="space-y-6">
                <p className="text-gray-600 line-clamp-2 text-lg leading-relaxed">{job.description}</p>

                <div className="flex flex-wrap items-center gap-6 text-sm">
                  <div className="flex items-center text-green-600 font-bold text-lg">
                    
                    {formatSalary(job.salaryMin, job.salaryMax)}
                  </div>
                  <div className="flex items-center text-gray-600">
                    <Clock className="h-4 w-4 mr-1" />
                    {job.experienceLevel}
                  </div>
                  <Badge variant="outline" className="font-medium">
                    {job.jobType}
                  </Badge>
                  <div className="flex items-center text-gray-500">
                    <Clock className="h-4 w-4 mr-1" />
                    {formatPostedTime(job.postedDate)}
                  </div>
                </div>

                <div className="flex flex-wrap gap-2">
                  <Badge
                    variant="secondary"
                    className="text-xs px-3 py-1 bg-blue-50 text-blue-700 hover:bg-blue-100 transition-colors"
                  >
                    {job.category}
                  </Badge>
                  {job.requirements && (
                    <Badge
                      variant="secondary"
                      className="text-xs px-3 py-1 bg-gray-50 text-gray-700"
                    >
                      Requirements
                    </Badge>
                  )}
                </div>
              </CardContent>
            </Card>
          ))
        )}
      </div>
    </div>
  )
}
