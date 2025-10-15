'use client';

import { useTranslation } from 'react-i18next';
import { useQuery } from '@tanstack/react-query';
import { api } from '@/lib/api';
import { TitleRow } from '@/components/title-row';

export function PersonalizedSection() {
  const { t } = useTranslation();

  const { data, isLoading } = useQuery({
    queryKey: ['trending-series'],
    queryFn: () => api.search({ q: '', type: 'series', page: 1, limit: 12 }),
  });

  if (isLoading || !data?.results?.length) {
    return null;
  }

  return <TitleRow title="Popular TV Series" titles={data.results} />;
}

