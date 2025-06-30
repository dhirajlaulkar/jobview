"use client"

import { useState, useEffect } from "react"
import { LiveJobsList } from "@/components/jobs/live-jobs-list"
import { Button } from "@/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Search, Filter } from "lucide-react"
import { useSearchParams } from "next/navigation"

export default function LiveJobsPage() {
  const searchParams = useSearchParams()
  const urlCategory = searchParams.get("category")
  
  const [category, setCategory] = useState(urlCategory || "programming-development")
  const [searchCategory, setSearchCategory] = useState(urlCategory || "programming-development")

  const categories = [
    { value: "programming-development", label: "Programming/Development" },
    { value: "design", label: "Design" },
    { value: "sales", label: "Sales" },
    { value: "customer-support", label: "Customer Support" },
    { value: "marketing", label: "Marketing" },
    { value: "project-management", label: "Project Management" },
    { value: "copywriting", label: "Copywriting" },
    { value: "technology-it", label: "Technology & IT" },
  ]

  // Update state when URL parameters change
  useEffect(() => {
    if (urlCategory) {
      setCategory(urlCategory)
      setSearchCategory(urlCategory)
    }
  }, [urlCategory])

  const handleSearch = () => {
    setCategory(searchCategory)
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="bg-white border-b shadow-sm">
        <div className="container mx-auto px-4 py-8">
          <div className="mb-8">
            <h1 className="text-4xl font-bold text-gray-900 mb-4">Live Job Listings</h1>
            <p className="text-xl text-gray-600">Real-time job postings from multiple sources</p>
          </div>

          <div className="bg-gray-50 rounded-2xl p-6 shadow-inner">
            <div className="flex flex-col md:flex-row items-center justify-center gap-4 max-w-2xl mx-auto">
              <div className="relative w-full md:w-64">
                <Filter className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
                <Select value={searchCategory} onValueChange={setSearchCategory}>
                  <SelectTrigger className="pl-12 h-12 border-gray-200 focus:border-blue-500 focus:ring-blue-500">
                    <SelectValue placeholder="Select category" />
                  </SelectTrigger>
                  <SelectContent>
                    {categories.map((cat) => (
                      <SelectItem key={cat.value} value={cat.value}>
                        {cat.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <Button
                onClick={handleSearch}
                className="w-full md:w-auto h-12 px-8 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700"
              >
                <Search className="h-4 w-4 mr-2" />
                Search 
              </Button>
            </div>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8">
        <LiveJobsList category={category} />
      </div>
    </div>
  )
}
