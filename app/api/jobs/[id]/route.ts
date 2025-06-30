import { NextRequest, NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"

export async function GET(req: NextRequest, { params }: { params: { id: string } }) {
  try {
    const { id } = params;
    const job = await prisma.job.findUnique({
      where: { id: id },
    })
    if (!job) return NextResponse.json({ success: false, error: "Job not found" }, { status: 404 })
    return NextResponse.json({ success: true, data: job })
  } catch (error) {
    return NextResponse.json({ success: false, error: "Failed to fetch job" }, { status: 500 })
  }
}

export async function PUT(req: NextRequest, { params }: { params: { id: string } }) {
  try {
    const { id } = params;
    const body = await req.json()
    
    
    if (!body.title || !body.description || !body.companyName || !body.location) {
      return NextResponse.json(
        { success: false, error: "Missing required fields" },
        { status: 400 }
      )
    }

    const job = await prisma.job.update({
      where: { id: id },
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
    return NextResponse.json({ success: false, error: "Failed to update job" }, { status: 500 })
  }
}

export async function DELETE(req: NextRequest, { params }: { params: { id: string } }) {
  try {
    const { id } = params;
    await prisma.job.delete({ where: { id: id } })
    return NextResponse.json({ success: true })
  } catch (error) {
    return NextResponse.json({ success: false, error: "Failed to delete job" }, { status: 500 })
  }
} 