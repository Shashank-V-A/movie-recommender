'use client';

import { useQuery } from '@tanstack/react-query';
import { useTranslation } from 'react-i18next';
import { api } from '@/lib/api';
import { Card, CardContent } from '@/components/ui/card';
import Link from 'next/link';

export default function GenresPage() {
  const { t } = useTranslation();

  const { data: genres, isLoading } = useQuery({
    queryKey: ['genres'],
    queryFn: api.getGenres,
  });

  if (isLoading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="text-center">Loading genres...</div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-4xl font-bold mb-8">{t('common.genres')}</h1>
      
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
        {genres?.map((genre: any) => (
          <Link key={genre.id} href={`/search?genres=${encodeURIComponent(genre.name)}`}>
            <Card className="hover:ring-2 ring-primary transition-all cursor-pointer h-full">
              <CardContent className="p-6 flex items-center justify-center text-center h-32">
                <h2 className="text-xl font-semibold">{genre.name}</h2>
              </CardContent>
            </Card>
          </Link>
        ))}
      </div>
    </div>
  );
}

