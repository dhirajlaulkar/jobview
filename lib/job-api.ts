/**
 * Job API Integration Library
 *
 * This module handles integration with external job APIs to fetch live job listings.
 * Currently supports:
 * - Adzuna API (job search with salary data)
 * - Remote OK API (remote job listings)
 *
 * Architecture:
 * - TypeScript interfaces for type safety
 * - Error handling with try/catch blocks
 * - Rate limiting considerations
 * - Data normalization from different API formats
 *
 * Environment Variables Required:
 * - ADZUNA_APP_ID: Application ID from Adzuna
 * - ADZUNA_APP_KEY: API key from Adzuna
 *
 * Usage:
 * - Import functions in API routes or server components
 * - Use searchJobs() for combined results from multiple sources
 * - Individual API functions available for specific needs
 */

import { fetchRemoteOKJobs, RemoteOKJob } from "@/lib/services/remoteok"

// Standardized job listing interface - all APIs normalize to this format
export interface JobListing {
  id: string // Unique identifier from source API
  title: string // Job title/position name
  company: string // Company/employer name
  location: string // Job location (city, state, country)
  salary?: string // Salary range (optional, formatted as string)
  description: string // Job description/snippet
  url: string // Direct link to job posting
  postedDate: string // When job was posted (ISO date string)
  source: string // Which API/source this came from
}

/**
 * Adzuna API Integration
 *
 * Fetches job listings from Adzuna's job search API
 * Features: Salary data, location-based search, category filtering
 * Rate limits: 1000 calls/month on free tier
 *
 * @param query - Search keywords
 * @param location - City/location for jobs
 * @param page - Page number for pagination
 * @returns Promise<JobListing[]> - Array of normalized job listings
 */
export async function fetchAdzunaJobs(query = "developer", location = "mumbai", page = 1): Promise<JobListing[]> {
  const APP_ID = process.env.ADZUNA_APP_ID
  const APP_KEY = process.env.ADZUNA_APP_KEY

  // Validate API credentials exist
  if (!APP_ID || !APP_KEY) {
    console.warn("Adzuna API credentials not configured")
    return []
  }

  // Updated base URL for Adzuna API
  const baseUrl = "https://api.adzuna.com/v1/api/jobs/in/search"

  // Build query parameters
  const params = new URLSearchParams({
    app_id: APP_ID,
    app_key: APP_KEY,
    what: query, // What (job title/skills)
    where: location, // Where (location)
    results_per_page: "20", // Results per page
    sort_by: "date", // Sort by posting date
    page: page.toString(), // Page number
  })

  try {
    // Add timeout to prevent hanging requests
    const controller = new AbortController()
    const timeoutId = setTimeout(() => controller.abort(), 15000) // Increased timeout to 15 seconds

    const response = await fetch(`${baseUrl}?${params}`, {
      signal: controller.signal,
      headers: {
        'User-Agent': 'KaamKhoj/1.0',
        'Accept': 'application/json',
      },
    })

    clearTimeout(timeoutId)

    if (!response.ok) {
      console.error(`Adzuna API error: ${response.status} - ${response.statusText}`)
      throw new Error(`Adzuna API error: ${response.status}`)
    }

    const data = await response.json()

    // Check if data has the expected structure
    if (!data.results || !Array.isArray(data.results)) {
      console.warn("Adzuna API returned unexpected data structure:", data)
      return []
    }

    // Normalize Adzuna API response to our JobListing interface
    return (
      data.results?.map((job: any) => ({
        id: job.id?.toString() || `adzuna-${Date.now()}-${Math.random()}`,
        title: job.title || "Unknown Position",
        company: job.company?.display_name || job.company_name || "Unknown Company",
        location: job.location?.display_name || job.location_name || "Remote",
        // Format salary range if available
        salary: job.salary_min && job.salary_max ? `₹${job.salary_min} - ₹${job.salary_max}` : undefined,
        description: job.description || job.snippet || "No description available",
        url: job.redirect_url || job.url || "#",
        postedDate: job.created || job.posted || new Date().toISOString(),
        source: "Adzuna",
      })) || []
    )
  } catch (error) {
    console.error("Error fetching Adzuna jobs:", error)
    // Return empty array on error to prevent app crashes
    return []
  }
}

/**
 * Remote OK API Integration
 *
 * Fetches remote job listings from Remote OK API using existing service
 * Features: Remote jobs, tech-focused positions, no API key required
 *
 * @param query - Search keywords (job title, skills, etc.)
 * @param limit - Number of results to return
 * @returns Promise<JobListing[]> - Array of normalized job listings
 */
export async function fetchRemoteOKJobsNormalized(query = "developer", limit = 25): Promise<JobListing[]> {
  try {
    // Use the existing Remote OK service
    const remoteOKJobs = await fetchRemoteOKJobs({
      position: query,
      limit: limit
    })
    
    // Normalize Remote OK jobs to our JobListing interface
    return remoteOKJobs.map((job: RemoteOKJob) => ({
      id: job.id?.toString() || `remoteok-${Date.now()}-${Math.random()}`,
      title: job.position || "Unknown Position",
      company: job.company || "Unknown Company",
      location: job.location || "Remote",
      salary: undefined, // Remote OK doesn't provide salary info
      description: job.description || "No description available",
      url: job.url || job.apply_url || "#",
      postedDate: job.date || new Date().toISOString(),
      source: "Remote OK",
    }))
  } catch (error) {
    console.error("Error fetching Remote OK jobs:", error)
    return []
  }
}

/**
 * Combined Job Search Function
 *
 * Searches multiple job APIs simultaneously and combines results
 * Features:
 * - Parallel API calls for better performance
 * - Duplicate removal based on title + company
 * - Results sorted by posting date (newest first)
 * - Error handling per API (one failure doesn't break others)
 *
 * @param query - Search keywords
 * @param location - Job location
 * @param sources - Array of API sources to search
 * @returns Promise<JobListing[]> - Combined and deduplicated results
 */
export async function searchJobs(
  query: string,
  location: string,
  sources: string[] = ["adzuna", "remoteok"],
): Promise<JobListing[]> {
  const promises = []

  // Add API calls based on requested sources
  if (sources.includes("adzuna")) {
    promises.push(fetchAdzunaJobs(query, location))
  }

  if (sources.includes("remoteok")) {
    promises.push(fetchRemoteOKJobsNormalized(query))
  }

  // Execute all API calls in parallel
  const results = await Promise.allSettled(promises)

  // Extract successful results and flatten into single array
  const jobs = results
    .filter((result): result is PromiseFulfilledResult<JobListing[]> => result.status === "fulfilled")
    .flatMap((result) => result.value)

  // If no jobs were fetched from any API, return empty array
  if (jobs.length === 0) {
    console.warn("All job APIs failed, returning empty results")
    return []
  }

  // Remove duplicate jobs based on title and company name
  const uniqueJobs = jobs.filter(
    (job, index, self) =>
      index ===
      self.findIndex(
        (j) =>
          j.title.toLowerCase() === job.title.toLowerCase() && j.company.toLowerCase() === job.company.toLowerCase(),
      ),
  )

  // Sort by posting date (newest first)
  return uniqueJobs.sort((a, b) => new Date(b.postedDate).getTime() - new Date(a.postedDate).getTime())
}

/**
 * TODO: Additional API integrations to consider:
 *
 * 1. Naukri.com API (requires business partnership)
 * 2. Monster.com API
 * 3. LinkedIn Jobs API (limited access)
 * 4. AngelList API (for startup jobs)
 * 5. GitHub Jobs API (for tech roles)
 * 6. Stack Overflow Jobs API
 *
 * Implementation pattern:
 * - Follow same structure as existing functions
 * - Normalize response to JobListing interface
 * - Add error handling and logging
 * - Update searchJobs() function to include new sources
 */


