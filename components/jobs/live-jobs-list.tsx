"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Skeleton } from "@/components/ui/skeleton"
import { MapPin, Clock, DollarSign, Building, ExternalLink, RefreshCw, Heart, Share2 } from "lucide-react"
import type { JobListing } from "@/lib/job-api"
import Link from "next/link"

interface LiveJobsListProps {
  category?: string
}

export function LiveJobsList({ category = "programming-development" }: LiveJobsListProps) {
  const [jobs, setJobs] = useState<JobListing[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [refreshing, setRefreshing] = useState(false)
  const [savedJobs, setSavedJobs] = useState<string[]>([])

  const fetchJobs = async (isRefresh = false) => {
    if (isRefresh) setRefreshing(true)
    else setLoading(true)

    setError(null)

    try {
      const params = new URLSearchParams({
        category: category,
      })

      const response = await fetch(`/api/jobs/live?${params}`)
      const data = await response.json()

      if (data.success) {
        setJobs(data.data)
        console.log(`Fetched ${data.total} live jobs for category "${category}"`)
      } else {
        setError(data.error || "Failed to fetch live jobs")
      }
    } catch (err) {
      setError("Network error occurred")
      console.error("Error fetching live jobs:", err)
    } finally {
      setLoading(false)
      setRefreshing(false)
    }
  }

  useEffect(() => {
    fetchJobs()
  }, [category])

  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    const now = new Date()
    const diffTime = Math.abs(now.getTime() - date.getTime())
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24))

    if (diffDays === 1) return "1 day ago"
    if (diffDays < 7) return `${diffDays} days ago`
    if (diffDays < 30) return `${Math.ceil(diffDays / 7)} weeks ago`
    return `${Math.ceil(diffDays / 30)} months ago`
  }

  const toggleSaveJob = (jobId: string) => {
    setSavedJobs((prev) => (prev.includes(jobId) ? prev.filter((id) => id !== jobId) : [...prev, jobId]))
  }

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <div>
            <Skeleton className="h-8 w-48 mb-2" />
            <Skeleton className="h-4 w-64" />
          </div>
          <Skeleton className="h-10 w-24" />
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {Array.from({ length: 6 }).map((_, i) => (
            <Card key={i} className="overflow-hidden">
              <CardHeader>
                <Skeleton className="h-6 w-3/4 mb-2" />
                <Skeleton className="h-4 w-1/2" />
              </CardHeader>
              <CardContent>
                <Skeleton className="h-4 w-full mb-2" />
                <Skeleton className="h-4 w-2/3" />
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <Card>
        <CardContent className="text-center py-8">
          <p className="text-red-600 mb-4">{error}</p>
          <Button onClick={() => fetchJobs()} variant="outline">
            Try Again
          </Button>
        </CardContent>
      </Card>
    )
  }

  return (
    <div className="space-y-6">
      {/* Header with refresh */}
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-xl font-semibold text-gray-900">{jobs.length.toLocaleString()} Live Jobs Found</h2>
          <p className="text-gray-600">Real-time job listings from multiple sources</p>
        </div>
        <Button onClick={() => fetchJobs(true)} disabled={refreshing} variant="outline" size="sm">
          <RefreshCw className={`h-4 w-4 mr-2 ${refreshing ? "animate-spin" : ""}`} />
          Refresh
        </Button>
      </div>

      {/* Job Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {jobs.map((job) => (
          <Card
            key={`${job.source}-${job.id}`}
            className="hover:shadow-xl transition-all duration-300 hover:-translate-y-1 border-0 shadow-md"
          >
            <CardHeader className="pb-4">
              <div className="flex justify-between items-start">
                <div className="flex-1 min-w-0">
                  <h3 className="font-semibold text-lg text-gray-900 mb-2 line-clamp-2">
                    {job.title}
                  </h3>
                  <div className="flex items-center space-x-2 flex-shrink-0">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => toggleSaveJob(job.id)}
                      className={`hover:scale-110 transition-transform ${
                        savedJobs.includes(job.id) ? "text-red-500" : "text-gray-400 hover:text-red-500"
                      }`}
                    >
                      <Heart className={`h-5 w-5 ${savedJobs.includes(job.id) ? "fill-current" : ""}`} />
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      className="text-gray-400 hover:text-blue-500 hover:scale-110 transition-all"
                    >
                      <Share2 className="h-5 w-5" />
                    </Button>
                  </div>
                  <div className="flex items-center text-gray-600 mb-4">
                    <Building className="h-4 w-4 mr-2" />
                    <span className="font-semibold">{job.company}</span>
                    <span className="mx-3">•</span>
                    <MapPin className="h-4 w-4 mr-1" />
                    <span>{job.location}</span>
                    {(job as any).isRemote && (
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
            </CardHeader>
            <CardContent className="space-y-6">
              <p className="text-gray-600 line-clamp-2 text-lg leading-relaxed">{job.description}</p>
              <div className="flex flex-wrap items-center gap-6 text-sm">
                {job.salary && (
                  <div className="flex items-center text-green-600 font-bold text-lg">
                    <DollarSign className="h-5 w-5 mr-1" />
                    {job.salary}
                  </div>
                )}
                <div className="flex items-center text-gray-500">
                  <Clock className="h-4 w-4 mr-1" />
                  {formatDate(job.postedDate)}
                </div>
                <Badge variant="outline" className="text-xs">
                  {job.source}
                </Badge>
              </div>

              <div className="flex items-center justify-between pt-4 border-t border-gray-100">
                <Button variant="outline" asChild size="sm">
                  <Link href={job.url} target="_blank" rel="noopener noreferrer">
                    <ExternalLink className="h-4 w-4 mr-2" />
                    View Job
                  </Link>
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {jobs.length === 0 && !loading && (
        <Card>
          <CardContent className="text-center py-12">
            <p className="text-gray-600 mb-4">No live jobs found for your search criteria.</p>
            <p className="text-sm text-gray-500">Try adjusting your search terms or location.</p>
          </CardContent>
        </Card>
      )}
    </div>
  )
}


