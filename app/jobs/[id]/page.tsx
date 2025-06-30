import { JobDetail } from "@/components/jobs/job-detail"
import { SimilarJobs } from "@/components/jobs/similar-jobs"
import { ApplicationSection } from "@/components/jobs/application-section"
import { getJob } from "@/lib/jobs"

export default async function JobDetailPage({ params: { id } }: { params: { id: string } }) {
  const jobData = await getJob(id);

  // Serialize the job data to make it safe to pass from Server to Client Component
  const job = {
    ...jobData,
    postedDate: jobData.postedDate.toISOString(),
    updatedDate: jobData.updatedDate.toISOString(),
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto space-y-8">
          <JobDetail initialJob={job} />
          <ApplicationSection />
          {/* <SimilarJobs /> */}
        </div>
      </div>
    </div>
  )
}
