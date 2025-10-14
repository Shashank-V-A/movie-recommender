'use client';

import { useQuery } from '@tanstack/react-query';
import { useTranslation } from 'react-i18next';
import { api } from '@/lib/api';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';

interface SearchFiltersProps {
  filters: any;
  onFiltersChange: (filters: any) => void;
}

export function SearchFilters({ filters, onFiltersChange }: SearchFiltersProps) {
  const { t } = useTranslation();
  const { data: genres } = useQuery({
    queryKey: ['genres'],
    queryFn: api.getGenres,
  });

  const toggleGenre = (genreName: string) => {
    const currentGenres = filters.genres || [];
    const newGenres = currentGenres.includes(genreName)
      ? currentGenres.filter((g: string) => g !== genreName)
      : [...currentGenres, genreName];
    onFiltersChange({ ...filters, genres: newGenres });
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>{t('search.filters')}</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div>
          <h3 className="font-semibold mb-2">Type</h3>
          <div className="space-y-2">
            {['all', 'movie', 'series'].map((type) => (
              <Button
                key={type}
                variant={filters.type === type ? 'default' : 'outline'}
                className="w-full"
                onClick={() => onFiltersChange({ ...filters, type })}
              >
                {type.charAt(0).toUpperCase() + type.slice(1)}
              </Button>
            ))}
          </div>
        </div>

        <div>
          <h3 className="font-semibold mb-2">{t('common.genres')}</h3>
          <div className="space-y-2 max-h-96 overflow-y-auto">
            {genres?.map((genre: any) => (
              <Button
                key={genre.id}
                variant={(filters.genres || []).includes(genre.name) ? 'default' : 'outline'}
                className="w-full"
                onClick={() => toggleGenre(genre.name)}
              >
                {genre.name}
              </Button>
            ))}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

