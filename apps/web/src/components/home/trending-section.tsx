'use client';

import { useTranslation } from 'react-i18next';
import { useQuery } from '@tanstack/react-query';
import { api } from '@/lib/api';
import { TitleCard } from '@/components/title-card';
import { TitleRow } from '@/components/title-row';

export function TrendingSection() {
  const { t } = useTranslation();

  const { data, isLoading } = useQuery({
    queryKey: ['search', { q: '', page: 1 }],
    queryFn: () => api.search({ q: '', page: 1 }),
  });

  if (isLoading) {
    return <div className="text-center">Loading...</div>;
  }

  return (
    <TitleRow title={t('home.trending')} titles={data?.results || []} />
  );
}

