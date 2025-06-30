"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Checkbox } from "@/components/ui/checkbox"
import { Slider } from "@/components/ui/slider"
import { Button } from "@/components/ui/button"
import { Separator } from "@/components/ui/separator"

export interface JobFilters {
  salaryMin: number;
  jobTypes: string[];
  experienceLevels: string[];
}

interface JobsFilterProps {
  onFilterChange: (filters: JobFilters) => void;
}

export function JobsFilter({ onFilterChange }: JobsFilterProps) {
  // These states now hold the temporary selections before applying
  const [salaryRange, setSalaryRange] = useState([0])
  const [selectedJobTypes, setSelectedJobTypes] = useState<string[]>([])
  const [selectedExperience, setSelectedExperience] = useState<string[]>([])

  const handleApply = () => {
    onFilterChange({
      salaryMin: salaryRange[0] * 100000,
      jobTypes: selectedJobTypes,
      experienceLevels: selectedExperience,
    })
  }

  const handleClearAll = () => {
    // Reset local state
    setSalaryRange([0]);
    setSelectedJobTypes([]);
    setSelectedExperience([]);
    
    // Apply the cleared filters to the parent to update the list
    onFilterChange({
      salaryMin: 0,
      jobTypes: [],
      experienceLevels: [],
    });
  }

  const jobTypes = [
    { id: "Full-time", label: "Full-time" },
    { id: "Part-time", label: "Part-time" },
    { id: "Contract", label: "Contract" },
    { id: "Internship", label: "Internship" },
  ]

  const experienceLevels = [
    { id: "Entry", label: "Entry Level" },
    { id: "Mid", label: "Mid Level" },
    { id: "Senior", label: "Senior Level" },
    { id: "Lead", label: "Lead" },
    { id: "Executive", label: "Executive" },
  ]

  return (
    <Card className="sticky top-4">
      <CardHeader>
        <CardTitle>Filters</CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Salary Range */}
        <div>
          <h3 className="font-semibold mb-3">Minimum Salary</h3>
          <div className="space-y-3">
            <Slider value={salaryRange} onValueChange={setSalaryRange} max={50} step={1} className="w-full" />
            <div className="flex justify-between text-sm text-gray-600">
              <span>₹0 LPA</span>
              <span>₹{salaryRange[0]}+ LPA</span>
            </div>
          </div>
        </div>

        <Separator />

        {/* Job Type */}
        <div>
          <h3 className="font-semibold mb-3">Job Type</h3>
          <div className="space-y-2">
            {jobTypes.map((type) => (
              <div key={type.id} className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <Checkbox
                    id={type.id}
                    checked={selectedJobTypes.includes(type.id)}
                    onCheckedChange={(checked) => {
                      setSelectedJobTypes(
                        checked
                          ? [...selectedJobTypes, type.id]
                          : selectedJobTypes.filter((id) => id !== type.id)
                      );
                    }}
                  />
                  <label htmlFor={type.id} className="text-sm cursor-pointer">
                    {type.label}
                  </label>
                </div>
              </div>
            ))}
          </div>
        </div>

        <Separator />

        {/* Experience Level */}
        <div>
          <h3 className="font-semibold mb-3">Experience Level</h3>
          <div className="space-y-2">
            {experienceLevels.map((level) => (
              <div key={level.id} className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <Checkbox
                    id={level.id}
                    checked={selectedExperience.includes(level.id)}
                    onCheckedChange={(checked) => {
                      setSelectedExperience(
                        checked
                          ? [...selectedExperience, level.id]
                          : selectedExperience.filter((id) => id !== level.id)
                      );
                    }}
                  />
                  <label htmlFor={level.id} className="text-sm cursor-pointer">
                    {level.label}
                  </label>
                </div>
              </div>
            ))}
          </div>
        </div>

        <Separator />

        {/* Action Buttons */}
        <div className="flex flex-col space-y-2 pt-2">
          <Button onClick={handleApply}>Apply Filters</Button>
          <Button variant="ghost" onClick={handleClearAll}>Clear All</Button>
        </div>
      </CardContent>
    </Card>
  )
}
