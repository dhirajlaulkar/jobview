"use client"

import { useState, useCallback } from "react"
import { JobsFilter, type JobFilters } from "@/components/jobs/jobs-filter"
import { JobsList } from "@/components/jobs/jobs-list"
import { JobsHeader } from "@/components/jobs/jobs-header"

const initialFilters: JobFilters = {
  salaryMin: 0,
  jobTypes: [],
  experienceLevels: [],
};

export default function JobsPage() {
  const [searchQuery, setSearchQuery] = useState("")
  const [searchLocation, setSearchLocation] = useState("")
  const [filters, setFilters] = useState<JobFilters>(initialFilters)
  const [loading, setLoading] = useState(false)

  const handleSearch = (query: string, location: string) => {
    setLoading(true)
    setSearchQuery(query)
    setSearchLocation(location)
  }

  const handleFilterChange = useCallback((newFilters: JobFilters) => {
    setLoading(true)
    setFilters(newFilters)
  }, [])

  return (
    <div className="min-h-screen bg-gray-50">
      <JobsHeader onSearch={handleSearch} loading={loading} />
      <div className="container mx-auto px-4 py-8">
        <div className="flex flex-col lg:flex-row gap-8">
          <aside className="lg:w-1/4">
            <JobsFilter onFilterChange={handleFilterChange} />
          </aside>
          <main className="lg:w-3/4">
            <JobsList 
              query={searchQuery} 
              location={searchLocation} 
              filters={filters}
              setLoading={setLoading}
            />
          </main>
        </div>
      </div>
    </div>
  )
}
