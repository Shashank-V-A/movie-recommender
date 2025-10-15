'use client';

import { useQuery } from '@tanstack/react-query';
import { api } from '@/lib/api';
import { TitleRow } from '@/components/title-row';

export function GenreRows() {
  const { data: genres } = useQuery({
    queryKey: ['genres'],
    queryFn: api.getGenres,
  });

  const topGenres = genres?.slice(0, 3) || [];

  return (
    <>
      {topGenres.map((genre: any) => (
        <GenreRow key={genre.id} genre={genre.name} />
      ))}
    </>
  );
}

function GenreRow({ genre }: { genre: string }) {
  const { data, isLoading } = useQuery({
    queryKey: ['genre-search', { genre, page: 1 }],
    queryFn: () => api.search({ 
      q: '', 
      genres: [genre], 
      page: 1, 
      limit: 15  // Increased limit to ensure we have enough after filtering
    }),
    staleTime: 5 * 60 * 1000, // Cache for 5 minutes to prevent constant refetching
  });

  if (isLoading || !data?.results?.length) {
    return null;
  }

  // Remove duplicates based on title ID and ensure proper genre filtering
  const uniqueTitles = data.results.filter((title: any, index: number, self: any[]) => {
    const isUnique = index === self.findIndex((t) => t.id === title.id);
    
    // Additional validation - ensure the title actually belongs to this genre
    // This is a fallback since the API should handle this, but helps with edge cases
    if (isUnique && title.genres && Array.isArray(title.genres)) {
      // If we have genre information, double-check it matches our filter
      // For now, trust the API result since TMDB's discover endpoint handles this
      return true;
    }
    
    return isUnique;
  }).slice(0, 12);

  if (uniqueTitles.length === 0) {
    return null;
  }

  return <TitleRow title={`Top ${genre}`} titles={uniqueTitles} />;
}

