"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { MapPin, Clock, DollarSign, Building, Share2, Heart, Calendar } from "lucide-react"
import { useState, useEffect } from "react"

interface Job {
  id: string
  title: string
  companyName: string
  location: string
  salaryMin: number | null
  salaryMax: number | null
  jobType: string
  experienceLevel: string
  description: string
  requirements: string
  category: string
  status: string
  postedDate: string
}

interface JobDetailProps {
  jobId?: string
  initialJob?: Job
}

export function JobDetail({ jobId, initialJob }: JobDetailProps) {
  const [job, setJob] = useState<Job | null>(initialJob || null)
  const [loading, setLoading] = useState(!initialJob)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    // Only fetch if jobId is provided and we don't have an initial job
    if (jobId && !initialJob) {
      const fetchJob = async () => {
        try {
          setLoading(true)
          const response = await fetch(`/api/jobs/${jobId}`)
          const data = await response.json()
          
          if (data.success) {
            setJob(data.data)
          } else {
            setError(data.error || "Failed to fetch job")
          }
        } catch (err) {
          setError("Network error")
        } finally {
          setLoading(false)
        }
      }
      fetchJob()
    }
  }, [jobId, initialJob])

  if (loading) {
    return (
      <Card>
        <CardContent className="p-6">
          <div className="animate-pulse space-y-4">
            <div className="h-8 bg-gray-200 rounded w-3/4"></div>
            <div className="h-4 bg-gray-200 rounded w-1/2"></div>
            <div className="h-4 bg-gray-200 rounded w-2/3"></div>
            <div className="h-32 bg-gray-200 rounded"></div>
          </div>
        </CardContent>
      </Card>
    )
  }

  if (error || !job) {
    return (
      <Card>
        <CardContent className="p-6">
          <div className="text-center text-red-500">
            {error || "Job not found"}
          </div>
        </CardContent>
      </Card>
    )
  }

  // Format salary range
  const formatSalary = () => {
    if (job.salaryMin && job.salaryMax) {
      return `₹${job.salaryMin.toLocaleString()}-${job.salaryMax.toLocaleString()} `
    } else if (job.salaryMin) {
      return `₹${job.salaryMin.toLocaleString()}`
    } else if (job.salaryMax) {
      return `Up to ₹${job.salaryMax.toLocaleString()} `
    }
    return "Salary not specified"
  }

  // Format posted date
  const formatPostedDate = (dateString: string) => {
    const date = new Date(dateString)
    const now = new Date()
    const diffTime = Math.abs(now.getTime() - date.getTime())
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24))
    
    if (diffDays === 1) return "1 day ago"
    if (diffDays < 7) return `${diffDays} days ago`
    if (diffDays < 30) return `${Math.floor(diffDays / 7)} weeks ago`
    return `${Math.floor(diffDays / 30)} months ago`
  }

  // Extract skills from requirements (simple approach)
  const extractSkills = () => {
    const commonSkills = ["React", "Node.js", "TypeScript", "JavaScript", "Python", "Java", "AWS", "Docker", "Kubernetes", "SQL", "MongoDB", "Git", "Agile", "REST API", "GraphQL"]
    const requirements = job.requirements.toLowerCase()
    return commonSkills.filter(skill => requirements.includes(skill.toLowerCase())).slice(0, 6)
  }

  const skills = extractSkills()

  return (
    <Card>
      <CardHeader>
        <div className="flex items-start justify-between">
          <div className="flex items-start space-x-4">
            <img
              src="/placeholder.svg"
              alt={`${job.companyName} logo`}
              className="w-20 h-20 rounded-lg object-cover"
            />
            <div>
              <CardTitle className="text-2xl mb-2">{job.title}</CardTitle>
              <div className="flex items-center text-gray-600 mb-2">
                <Building className="h-5 w-5 mr-2" />
                <span className="font-medium text-lg">{job.companyName}</span>
              </div>
              <div className="flex items-center text-gray-600">
                <MapPin className="h-4 w-4 mr-1" />
                <span>{job.location}</span>
                <span className="mx-2">•</span>
                <Badge variant="outline">{job.jobType}</Badge>
              </div>
            </div>
          </div>
          <div className="flex items-center space-x-2">
            <Button variant="outline" size="sm">
              <Heart className="h-4 w-4 mr-2" />
              Save
            </Button>
            <Button variant="outline" size="sm">
              <Share2 className="h-4 w-4 mr-2" />
              Share
            </Button>
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-6 pt-4 border-t">
          <div className="flex items-center text-green-600 font-semibold">
            <DollarSign className="h-5 w-5 mr-1" />
            {formatSalary()}
          </div>
          <div className="flex items-center text-gray-600">
            <Clock className="h-4 w-4 mr-1" />
            {job.experienceLevel} Level
          </div>
          <div className="flex items-center text-gray-600">
            <Calendar className="h-4 w-4 mr-1" />
            Posted {formatPostedDate(job.postedDate)}
          </div>
          <div className="text-gray-600">{job.category}</div>
        </div>
      </CardHeader>

      <CardContent className="space-y-6">
        {skills.length > 0 && (
          <div>
            <h3 className="font-semibold text-lg mb-3">Required Skills</h3>
            <div className="flex flex-wrap gap-2">
              {skills.map((skill) => (
                <Badge key={skill} variant="secondary">
                  {skill}
                </Badge>
              ))}
            </div>
          </div>
        )}

        <div>
          <h3 className="font-semibold text-lg mb-3">Job Description</h3>
          <div className="prose max-w-none text-gray-700 whitespace-pre-line">{job.description}</div>
        </div>

        {job.requirements && (
          <div>
            <h3 className="font-semibold text-lg mb-3">Requirements</h3>
            <div className="prose max-w-none text-gray-700 whitespace-pre-line">{job.requirements}</div>
          </div>
        )}
      </CardContent>
    </Card>
  )
}
