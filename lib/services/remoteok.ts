export interface RemoteOKJob {
  id: string;
  slug: string;
  position: string;
  company: string;
  company_logo: string;
  location: string;
  tags: string[];
  description: string;
  url: string;
  date: string;
  apply_url: string;
}

export async function fetchRemoteOKJobs(filters?: {
  position?: string;
  company?: string;
  limit?: number;
}): Promise<RemoteOKJob[]> {
  try {
    let url = 'https://remoteok.io/api';
    const params = new URLSearchParams();
    
    if (filters?.position) params.append('position', filters.position);
    if (filters?.company) params.append('company', filters.company);
    
    if (params.toString()) url += `?${params.toString()}`;
    
    // Add timeout to prevent hanging requests
    const controller = new AbortController()
    const timeoutId = setTimeout(() => controller.abort(), 10000) // 10 second timeout

    const response = await fetch(url, {
      signal: controller.signal,
      headers: {
        'User-Agent': 'KaamKhoj/1.0',
      },
    })

    clearTimeout(timeoutId)

    if (!response.ok) {
      throw new Error(`RemoteOK API error: ${response.status}`)
    }

    const data = await response.json();
    
    // Skip first item (metadata) and apply limit
    const jobs = data.slice(1);
    return filters?.limit ? jobs.slice(0, filters.limit) : jobs;
  } catch (error) {
    console.error('RemoteOK API Error:', error);
    return [];
  }
} 