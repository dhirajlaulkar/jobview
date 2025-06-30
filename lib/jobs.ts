import { prisma } from "@/lib/prisma"
import { notFound } from "next/navigation"

export async function getJob(id: string) {
  const job = await prisma.job.findUnique({
    where: { id },
  });

  if (!job) {
    notFound();
  }
  return job;
} 