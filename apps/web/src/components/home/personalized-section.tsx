'use client';

import { useTranslation } from 'react-i18next';
import { useQuery } from '@tanstack/react-query';
import { api } from '@/lib/api';
import { TitleRow } from '@/components/title-row';

export function PersonalizedSection() {
  const { t } = useTranslation();

  const { data, isLoading } = useQuery({
    queryKey: ['recommendations'],
    queryFn: () => api.getRecommendations(),
  });

  if (isLoading || !data?.results?.length) {
    return null;
  }

  return <TitleRow title={t('common.recommendations')} titles={data.results} />;
}

