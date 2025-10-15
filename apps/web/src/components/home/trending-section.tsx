'use client';

import { useTranslation } from 'react-i18next';
import { useQuery } from '@tanstack/react-query';
import { api } from '@/lib/api';
// TitleCard import removed; handled by TitleRow
import { TitleRow } from '@/components/title-row';

export function TrendingSection() {
  const { t } = useTranslation();

  const { data, isLoading } = useQuery({
    queryKey: ['trending-movies', { page: 1 }],
    queryFn: () => api.search({ q: '', type: 'movie', page: 1, limit: 12 }),
    staleTime: 5 * 60 * 1000, // Cache for 5 minutes
  });

  if (isLoading) {
    return <div className="text-center">Loading...</div>;
  }

  return (
    <TitleRow title="Trending Movies" titles={data?.results || []} />
  );
}

