'use client';

import { useQuery } from '@tanstack/react-query';
import { useTranslation } from 'react-i18next';
import { api } from '@/lib/api';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import Link from 'next/link';
import { useState } from 'react';

export default function GenresPage() {
  const { t } = useTranslation();
  const [selectedGenre, setSelectedGenre] = useState<string | null>(null);

  const { data: genres, isLoading } = useQuery({
    queryKey: ['genres'],
    queryFn: api.getGenres,
  });

  const { data: genreTitles, isLoading: isLoadingTitles } = useQuery({
    queryKey: ['search', { genres: selectedGenre }],
    queryFn: () => api.search({ q: '', genres: selectedGenre || '', page: 1, limit: 20 }),
    enabled: !!selectedGenre,
  });

  if (isLoading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="text-center">Loading genres...</div>
      </div>
    );
  }

  // Filter out genres with very few titles to avoid empty results
  type Genre = { id: number | string; name: string };
  const popularGenres = genres?.filter((genre: Genre) => {
    // This will be improved with actual counts from the backend
    return !['News', 'Reality', 'Soap', 'Talk', 'TV Movie'].includes(genre.name);
  });

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-4xl font-bold mb-8">{t('common.genres')}</h1>
      
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 mb-8">
        {popularGenres?.map((genre: any) => (
          <Card 
            key={genre.id} 
            className={`hover:ring-2 ring-primary transition-all cursor-pointer h-full ${
              selectedGenre === genre.name ? 'ring-2 ring-primary bg-primary/10' : ''
            }`}
            onClick={() => setSelectedGenre(selectedGenre === genre.name ? null : genre.name)}
          >
            <CardContent className="p-6 flex flex-col items-center justify-center text-center h-32">
              <h2 className="text-xl font-semibold mb-2">{genre.name}</h2>
              <Badge variant="secondary" className="text-xs">
                Click to preview
              </Badge>
            </CardContent>
          </Card>
        ))}
      </div>

      {selectedGenre && (
        <div className="mt-8">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center justify-between">
                <span>Popular {selectedGenre} Movies & Series</span>
                <Link 
                  href={`/search?genres=${encodeURIComponent(selectedGenre)}`}
                  className="text-sm text-primary hover:underline"
                >
                  View all →
                </Link>
              </CardTitle>
            </CardHeader>
            <CardContent>
              {isLoadingTitles ? (
                <div className="text-center py-8">Loading {selectedGenre} content...</div>
              ) : genreTitles?.results?.length ? (
                <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
                  {genreTitles.results.slice(0, 12).map((title: any) => (
                    <Link key={title.id} href={`/title/${title.id}`}>
                      <Card className="overflow-hidden hover:ring-2 ring-primary transition-all cursor-pointer">
                        <div className="aspect-[2/3] relative">
                          <img
                            src={title.posterPath ? `https://image.tmdb.org/t/p/w500${title.posterPath}` : '/placeholder-poster.jpg'}
                            alt={title.originalTitle}
                            className="w-full h-full object-cover"
                          />
                        </div>
                        <div className="p-3">
                          <h3 className="font-semibold text-sm line-clamp-2">
                            {title.originalTitle}
                          </h3>
                          {title.releaseDate && (
                            <p className="text-xs text-muted-foreground mt-1">
                              {new Date(title.releaseDate).getFullYear()}
                            </p>
                          )}
                        </div>
                      </Card>
                    </Link>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8 text-muted-foreground">
                  No {selectedGenre} content found. Try another genre!
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  );
}

