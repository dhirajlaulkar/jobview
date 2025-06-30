import { NextRequest, NextResponse } from 'next/server';
import { fetchRemoteOKJobs } from '@/lib/services/remoteok';

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  
  try {
    const jobs = await fetchRemoteOKJobs({
      position: searchParams.get('position') || undefined,
      company: searchParams.get('company') || undefined,
      limit: parseInt(searchParams.get('limit') || '20')
    });
    
    return NextResponse.json({ success: true, data: jobs });
  } catch (error) {
    return NextResponse.json(
      { success: false, error: 'Failed to fetch remote jobs' },
      { status: 500 }
    );
  }
} 