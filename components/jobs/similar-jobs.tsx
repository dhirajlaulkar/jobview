import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { MapPin, DollarSign, Building } from "lucide-react"
import Link from "next/link"

const similarJobs = [
  {
    id: 2,
    title: "Full Stack Developer",
    company: "InnovateTech",
    location: "Bangalore",
    salary: "₹12-18 LPA",
    type: "Full-time",
    logo: "/placeholder.svg?height=50&width=50",
    skills: ["React", "Node.js", "MongoDB"],
  },
  {
    id: 3,
    title: "Frontend Engineer",
    company: "WebSolutions",
    location: "Mumbai",
    salary: "₹10-15 LPA",
    type: "Full-time",
    logo: "/placeholder.svg?height=50&width=50",
    skills: ["React", "TypeScript", "CSS"],
  },
  {
    id: 4,
    title: "Software Engineer",
    company: "CodeCraft",
    location: "Hyderabad",
    salary: "₹8-14 LPA",
    type: "Full-time",
    logo: "/placeholder.svg?height=50&width=50",
    skills: ["JavaScript", "Python", "AWS"],
  },
]

export function SimilarJobs() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Similar Jobs</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {similarJobs.map((job) => (
          <div key={job.id} className="border rounded-lg p-4 hover:shadow-md transition-shadow">
            <div className="flex items-start space-x-3">
              <img
                src={job.logo || "/placeholder.svg"}
                alt={`${job.company} logo`}
                className="w-12 h-12 rounded-lg object-cover"
              />
              <div className="flex-1">
                <h4 className="font-semibold text-gray-900 hover:text-blue-600">
                  <Link href={`/jobs/${job.id}`}>{job.title}</Link>
                </h4>
                <div className="flex items-center text-gray-600 text-sm mb-2">
                  <Building className="h-4 w-4 mr-1" />
                  <span>{job.company}</span>
                  <span className="mx-2">•</span>
                  <MapPin className="h-4 w-4 mr-1" />
                  <span>{job.location}</span>
                </div>
                <div className="flex items-center justify-between">
                  <div className="flex items-center text-green-600 font-semibold text-sm">
                    <DollarSign className="h-4 w-4 mr-1" />
                    {job.salary}
                  </div>
                  <Badge variant="outline" className="text-xs">
                    {job.type}
                  </Badge>
                </div>
                <div className="flex flex-wrap gap-1 mt-2">
                  {job.skills.slice(0, 3).map((skill) => (
                    <Badge key={skill} variant="secondary" className="text-xs">
                      {skill}
                    </Badge>
                  ))}
                </div>
              </div>
            </div>
          </div>
        ))}

        <Button variant="outline" className="w-full">
          View More Similar Jobs
        </Button>
      </CardContent>
    </Card>
  )
}
