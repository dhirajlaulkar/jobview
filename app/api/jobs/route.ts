/**
 * Jobs API Route Handler
 *
 * This API endpoint handles CRUD operations for JobView jobs.
 * These are jobs created by admin users.
 *
 * Endpoint: GET /api/jobs - Get all JobView jobs
 * Endpoint: POST /api/jobs - Create a new JobView job
 *
 * Response Format:
 * {
 *   success: boolean,
 *   data: Job[],
 *   total: number,
 *   error?: string
 * }
 */

import { type NextRequest, NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const query = searchParams.get("q") || undefined
    const location = searchParams.get("location") || undefined
    const category = searchParams.get("category") || undefined
    const salaryMin = searchParams.get("salaryMin") ? Number(searchParams.get("salaryMin")) : undefined
    const jobTypes = searchParams.get("jobTypes")?.split(",") || undefined
    const experienceLevels = searchParams.get("experienceLevels")?.split(",") || undefined

    const where: any = {
      status: "active"
    }

    if (query) {
      where.OR = [
        { title: { contains: query, mode: 'insensitive' } },
        { description: { contains: query, mode: 'insensitive' } },
        { companyName: { contains: query, mode: 'insensitive' } }
      ]
    }

    if (location) {
      where.location = { contains: location, mode: 'insensitive' }
    }

    if (category) {
      where.category = { contains: category, mode: 'insensitive' }
    }

    if (salaryMin && salaryMin > 0) {
      where.salaryMin = { gte: salaryMin }
    }
    
    if (jobTypes && jobTypes.length > 0) {
      where.jobType = { in: jobTypes }
    }

    if (experienceLevels && experienceLevels.length > 0) {
      where.experienceLevel = { in: experienceLevels }
    }

    const jobs = await prisma.job.findMany({
      where,
      orderBy: { postedDate: 'desc' }
    })

    return NextResponse.json({
      success: true,
      data: jobs,
      total: jobs.length,
    })
  } catch (error) {
    console.error("Jobs API Error:", error)
    return NextResponse.json(
      { success: false, error: "Failed to fetch jobs", data: [], total: 0 },
      { status: 500 },
    )
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    
    // Validate required fields
    if (!body.title || !body.description || !body.companyName || !body.location) {
      return NextResponse.json(
        { success: false, error: "Missing required fields" },
        { status: 400 }
      )
    }

    const job = await prisma.job.create({
      data: {
        title: body.title,
        description: body.description,
        requirements: body.requirements || "",
        salaryMin: body.salaryMin ? parseInt(body.salaryMin) : null,
        salaryMax: body.salaryMax ? parseInt(body.salaryMax) : null,
        location: body.location,
        jobType: body.jobType || "Full-time",
        experienceLevel: body.experienceLevel || "Entry",
        category: body.category || "Programming/Development",
        companyName: body.companyName,
        status: body.status || "active",
      },
    })
    
    return NextResponse.json({ success: true, data: job })
  } catch (error) {
    console.error("Jobs API POST Error:", error)
    return NextResponse.json({ success: false, error: "Failed to create job" }, { status: 500 })
  }
}


