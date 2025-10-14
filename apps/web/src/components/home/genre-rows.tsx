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
    queryKey: ['search', { genres: genre }],
    queryFn: () => api.search({ q: '', genres: [genre], page: 1, limit: 20 }),
  });

  if (isLoading || !data?.results?.length) {
    return null;
  }

  // Remove duplicates based on title ID
  const uniqueTitles = data.results.filter((title: any, index: number, self: any[]) => 
    index === self.findIndex((t) => t.id === title.id)
  );

  return <TitleRow title={`Top ${genre}`} titles={uniqueTitles.slice(0, 12)} />;
}

