"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Search, MapPin, Briefcase, TrendingUp, Users, Building } from "lucide-react"
import Link from "next/link"
import { useRouter } from "next/navigation"

export function HeroSection() {
  const [jobTitle, setJobTitle] = useState("")
  const [location, setLocation] = useState("")
  const [category, setCategory] = useState("")
  const router = useRouter()

  const quickStats = [
    { icon: Briefcase, value: "100+", label: "Live Jobs" },
    { icon: Building, value: "50+", label: "JobView Jobs" },
    { icon: Users, value: "1K+", label: "Job Seekers" },
  ]

  const handleSearch = () => {
    const searchParams = new URLSearchParams()
    if (jobTitle.trim()) {
      searchParams.set('q', jobTitle.trim())
    }
    if (location.trim()) {
      searchParams.set('location', location.trim())
    }
    
    const queryString = searchParams.toString()
    const url = queryString ? `/jobs?${queryString}` : '/jobs'
    
    router.push(url)
  }

  return (
    <section className="relative overflow-hidden bg-gradient-to-br from-blue-50 via-white to-indigo-50">
      {/* Background Pattern */}
      <div className="absolute inset-0 bg-grid-slate-100 [mask-image:linear-gradient(0deg,white,rgba(255,255,255,0.6))] -z-10" />

      <div className="container mx-auto px-4 py-16 lg:py-24">
        <div className="text-center mb-12">
          <div className="inline-flex items-center px-4 py-2 bg-blue-100 text-blue-700 rounded-full text-sm font-medium mb-6">
            <TrendingUp className="h-4 w-4 mr-2" />
            India's Premier Job Portal
          </div>

          
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-blue-900 mb-6 leading-tight">
            Find Your Dream Job with{" "}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-indigo-600">
              JobView
            </span>
          </h1>

          <p className="text-xl md:text-2xl text-gray-600 max-w-3xl mx-auto mb-8 leading-relaxed">
            Access thousands of live job listings from top companies and discover curated opportunities from{" "}
            <span className="font-semibold text-blue-600 bg-blue-100  rounded-md px-2 py-1">JobView</span>.
          </p>

          {/* Quick Stats */}
          <div className="flex justify-center items-center space-x-8 mb-12">
            {quickStats.map((stat, index) => (
              <div key={index} className="text-center">
                <div className="flex items-center justify-center w-12 h-12 bg-blue-100 rounded-full mb-2 mx-auto">
                  <stat.icon className="h-6 w-6 text-blue-600" />
                </div>
                <div className="text-2xl font-bold text-gray-900">{stat.value}</div>
                <div className="text-sm text-gray-600">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>

        {/* Enhanced Search Form */}
        <div className="max-w-5xl mx-auto px-4">
          <div className="bg-white rounded-3xl shadow-2xl p-8 border border-gray-100">
            <div className="text-center mb-8">
              <h3 className="text-lg font-semibold text-gray-900 mb-3">Start Your Job Search</h3>
              <p className="text-gray-600">Find the perfect opportunity from curated jobs</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="relative">
                <Briefcase className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
                <Input
                  placeholder="Job title"
                  value={jobTitle}
                  onChange={(e) => setJobTitle(e.target.value)}
                  className="pl-12 h-14 text-lg border-gray-200 focus:border-blue-500 focus:ring-blue-500 w-full"
                />
              </div>

              <div className="relative">
                <MapPin className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
                <Input
                  placeholder="City"
                  value={location}
                  onChange={(e) => setLocation(e.target.value)}
                  className="pl-12 h-14 text-lg border-gray-200 focus:border-blue-500 focus:ring-blue-500 w-full"
                />
              </div>

              <div>
                <Button
                  onClick={handleSearch}
                  size="lg"
                  className="w-full h-14 text-lg bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 shadow-lg"
                >
                  <Search className="h-5 w-5 mr-2" />
                  Search
                </Button>
              </div>
            </div>
          </div>
        </div>

        {/* Job Source Buttons */}
        <div className="text-center mt-10">
          <p className="text-gray-600 mb-6 text-lg">Choose your job source:</p>
          <div className="flex flex-col sm:flex-row justify-center gap-4">
            <Link href="/jobs/live">
              <Button size="lg" variant="outline" className="px-8 py-3 text-lg border-2 border-blue-600 text-blue-600 hover:bg-blue-600 hover:text-white">
                <TrendingUp className="h-5 w-5 mr-2" />
                Browse Live Jobs
              </Button>
            </Link>
            <Link href="/jobs">
              <Button size="lg" className="px-8 py-3 text-lg bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700">
                <Building className="h-5 w-5 mr-2" />
                Jobs by JobView
              </Button>
            </Link>
          </div>
        </div>

        
        <div className="text-center mt-10">
          <p className="text-gray-600 mb-4 text-lg">Popular searches:</p>
          <div className="flex flex-wrap justify-center gap-3">
            {[
              "Software Engineer",
              "Data Scientist",
              "Product Manager",
              "Digital Marketing",
              "UI/UX Designer",
              "Business Analyst",
            ].map((search) => (
              <button
                key={search}
                onClick={() => setJobTitle(search)}
                className="px-4 py-2 bg-gray-100 hover:bg-blue-100 text-gray-700 hover:text-blue-700 rounded-full text-sm font-medium transition-all duration-200 hover:scale-105"
              >
                {search}
              </button>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}
