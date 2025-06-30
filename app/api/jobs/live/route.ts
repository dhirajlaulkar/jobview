

import { type NextRequest, NextResponse } from "next/server"
import { searchJobs } from "@/lib/job-api"
import { fetchRemoteOKJobs } from "@/lib/services/remoteok"

function stripHtml(html: string): string {
  return html.replace(/<[^>]+>/g, '').replace(/\s+/g, ' ').trim();
}


const categoryToQueries = {
  "programming-development": [
    "software engineer", "developer", "programmer", "full stack", "frontend", "backend",
    "react", "node.js", "python", "java", "javascript", "devops", "data engineer",
    "machine learning", "ai engineer", "mobile developer", "ios", "android", "web developer",
    "software developer", "application developer", "systems developer"
  ],
  "design": [
    "designer", "ui designer", "ux designer", "graphic designer", "web designer",
    "product designer", "visual designer", "creative designer", "art director",
    "illustrator", "brand designer", "interaction designer", "user experience designer"
  ],
  "sales": [
    "sales representative", "account manager", "business development",
    "sales manager", "inside sales", "field sales", "sales executive",
    "customer success", "sales consultant", "territory manager", "sales director"
  ],
  "customer-support": [
    "customer support", "customer service", "support specialist", "help desk",
    "technical support", "customer care", "support representative", "customer success",
    "support engineer", "customer experience", "support analyst"
  ],
  "marketing": [
    "marketing", "digital marketing", "social media", "content marketing",
    "seo specialist", "ppc analyst", "brand manager", "marketing manager",
    "growth hacker", "email marketing", "affiliate marketing", "marketing specialist"
  ],
  "project-management": [
    "project manager", "program manager", "product manager", "scrum master",
    "agile coach", "project coordinator", "technical project manager", "delivery manager",
    "project lead", "project director", "portfolio manager"
  ],
  "copywriting": [
    "copywriter", "content writer", "technical writer", "content creator",
    "content strategist", "editor", "content manager", "creative writer",
    "blog writer", "content specialist", "marketing copywriter"
  ],
  "technology-it": [
    "it specialist", "system administrator", "network engineer", "database administrator",
    "cloud engineer", "infrastructure engineer", "security engineer", "data analyst",
    "business analyst", "technical analyst", "it manager", "technology consultant"
  ],
}


function jobMatchesCategory(job: any, category: string): boolean {
  const queries = categoryToQueries[category as keyof typeof categoryToQueries] || []
  const searchText = `${job.title} ${job.description || ''} ${job.tags?.join(' ') || ''}`.toLowerCase()
  
  return queries.some(query => searchText.includes(query.toLowerCase()))
}

export async function GET(request: NextRequest) {
  try {
   
    const { searchParams } = new URL(request.url)
    const category = searchParams.get("category") || "programming-development"
    const queries = categoryToQueries[category as keyof typeof categoryToQueries] || ["software engineer"]

    
    console.log(`Fetching jobs for category: ${category} with query: ${queries[0]}`)
    
    const [adzunaJobs, remoteokJobsRaw] = await Promise.allSettled([
      searchJobs(queries[0], "", ["adzuna"]), // Use primary query for Adzuna
      fetchRemoteOKJobs({ 
        position: queries[0], 
        limit: 100
      })
    ])
    
    //  Adzuna jobs
    const adzunaJobsData = adzunaJobs.status === 'fulfilled' ? adzunaJobs.value : []
    console.log(`Adzuna jobs fetched: ${adzunaJobsData.length}`)
    const adzunaJobsWithSource = adzunaJobsData.map(job => ({ ...job, source: "adzuna" }))
    
    //  RemoteOK jobs
    const remoteokJobsData = remoteokJobsRaw.status === 'fulfilled' ? remoteokJobsRaw.value : []
    console.log(`RemoteOK jobs fetched: ${remoteokJobsData.length}`)
    const remoteokJobs = remoteokJobsData.map(job => ({
      id: job.id,
      title: job.position,
      company: job.company,
      location: job.location,
      salary: undefined,
      description: stripHtml(job.description),
      url: job.url,
      postedDate: job.date,
      source: "remoteok",
      tags: job.tags, // Preserve tags for filtering
    }))

    // Combine 
    const allJobs = [...adzunaJobsWithSource, ...remoteokJobs]
    console.log(`Total jobs before filtering: ${allJobs.length}`)
    
    // Filter jobs 
    const filteredJobs = allJobs.filter(job => jobMatchesCategory(job, category))
    console.log(`Jobs after category filtering: ${filteredJobs.length}`)
    
    
    const limitedJobs = filteredJobs.slice(0, 40)

    
    if (adzunaJobs.status === 'rejected') {
      console.warn("Adzuna API failed:", adzunaJobs.reason)
    }
    if (remoteokJobsRaw.status === 'rejected') {
      console.warn("RemoteOK API failed:", remoteokJobsRaw.reason)
    }

    return NextResponse.json({
      success: true,
      data: limitedJobs,
      total: limitedJobs.length,
    })
  } catch (error) {
   
    console.error("Live Jobs API Error:", error)

   
    return NextResponse.json(
      {
        success: false,
        error: "Failed to fetch live jobs",
        data: [],
        total: 0,
      },
      { status: 500 },
    )
  }
} 