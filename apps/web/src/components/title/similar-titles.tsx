'use client';

import { useQuery } from '@tanstack/react-query';
import { useTranslation } from 'react-i18next';
import { api } from '@/lib/api';
import { TitleRow } from '@/components/title-row';

interface SimilarTitlesProps {
  titleId: string;
}

export function SimilarTitles({ titleId }: SimilarTitlesProps) {
  const { t } = useTranslation();

  const { data: similar, isLoading } = useQuery({
    queryKey: ['similar', titleId],
    queryFn: () => api.getSimilar(titleId),
  });

  if (isLoading || !similar?.length) {
    return null;
  }

  return <TitleRow title={t('title.similar')} titles={similar} />;
}

