'use client';

import { useTranslation } from 'react-i18next';
import { useQuery } from '@tanstack/react-query';
import { api } from '@/lib/api';
import { TitleRow } from '@/components/title-row';

export function PersonalizedSection() {
  const { t } = useTranslation();

  const { data, isLoading } = useQuery({
    queryKey: ['trending-series', { page: 1 }],
    queryFn: () => api.search({ q: '', type: 'series', page: 1, limit: 12 }),
    staleTime: 5 * 60 * 1000, // Cache for 5 minutes
  });

  if (isLoading || !data?.results?.length) {
    return null;
  }

  return <TitleRow title="Popular TV Series" titles={data.results} />;
}

