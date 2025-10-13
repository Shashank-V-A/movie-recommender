const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001';

export async function fetchAPI(endpoint: string, options?: RequestInit) {
  const response = await fetch(`${API_BASE_URL}${endpoint}`, {
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
    const query = new URLSearchParams(params).toString();
    return fetchAPI(`/api/search?${query}`);
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

