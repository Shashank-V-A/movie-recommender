// Use relative URLs for Vercel deployment (no external API needed)
export async function fetchAPI(endpoint: string, options?: RequestInit) {
  const response = await fetch(endpoint, {
    ...options,
    headers: {
      'Content-Type': 'application/json',
      ...options?.headers,
    },
  });

  if (!response.ok) {
    throw new Error(`API error: ${response.statusText}`);
  }

  return response.json();
}

export const api = {
  search: (params: Record<string, any>) => {
    const searchParams = new URLSearchParams();
    
    // Handle each parameter
    Object.entries(params).forEach(([key, value]) => {
      if (value !== undefined && value !== null) {
        if (key === 'genres' && Array.isArray(value)) {
          // Convert genres array to comma-separated string
          searchParams.set(key, value.join(','));
        } else {
          searchParams.set(key, value.toString());
        }
      }
    });
    
    return fetchAPI(`/api/search?${searchParams.toString()}`);
  },

  getTitle: (id: string, language?: string, region?: string) => {
    const params = new URLSearchParams();
    if (language) params.set('language', language);
    if (region) params.set('region', region);
    return fetchAPI(`/api/titles/${id}?${params.toString()}`);
  },

  getSimilar: (id: string, language?: string) => {
    const params = new URLSearchParams();
    if (language) params.set('language', language);
    return fetchAPI(`/api/titles/${id}/similar?${params.toString()}`);
  },

  getRecommendations: (userId?: string, language?: string, region?: string) => {
    const params = new URLSearchParams();
    if (language) params.set('language', language);
    if (region) params.set('region', region);
    const headers: Record<string, string> = {};
    if (userId) headers['x-user-id'] = userId;
    return fetchAPI(`/api/recommendations?${params.toString()}`, { headers });
  },

  recordInteraction: (
    userId: string,
    data: { titleId: string; event: string; metadata?: any },
  ) => {
    return fetchAPI('/api/interactions', {
      method: 'POST',
      headers: { 'x-user-id': userId },
      body: JSON.stringify(data),
    });
  },

  getGenres: () => fetchAPI('/api/genres'),

  getProviders: (region?: string) => {
    const params = region ? `?region=${region}` : '';
    return fetchAPI(`/api/providers${params}`);
  },

  getProfile: (userId: string) => {
    return fetchAPI('/api/profile', {
      headers: { 'x-user-id': userId },
    });
  },

  updateProfile: (userId: string, data: any) => {
    return fetchAPI('/api/profile', {
      method: 'POST',
      headers: { 'x-user-id': userId },
      body: JSON.stringify(data),
    });
  },
};

