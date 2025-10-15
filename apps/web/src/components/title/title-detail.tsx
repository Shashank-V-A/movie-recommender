'use client';

import { useQuery } from '@tanstack/react-query';
import { useTranslation } from 'react-i18next';
import Image from 'next/image';
import { api } from '@/lib/api';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Star, Clock, Calendar, Bookmark, BookmarkCheck } from 'lucide-react';
import { formatRuntime, formatDate, formatRating } from '@/lib/utils';
import { WatchProviders } from './watch-providers';
import { SimilarTitles } from './similar-titles';
import { useSavedTitles } from '@/lib/hooks/use-saved-titles';

interface TitleDetailProps {
  id: string;
}

export function TitleDetail({ id }: TitleDetailProps) {
  const { t } = useTranslation();
  const { toggleSave, isSaved } = useSavedTitles();

  const { data: title, isLoading } = useQuery({
    queryKey: ['title', id],
    queryFn: () => api.getTitle(id),
  });

  const saved = isSaved(id);

  if (isLoading) {
    return <div className="container mx-auto px-4 py-8">Loading...</div>;
  }

  if (!title) {
    return <div className="container mx-auto px-4 py-8">Title not found</div>;
  }

  const backdropUrl = title.backdropUrl || 
    (title.backdropPath ? `https://image.tmdb.org/t/p/original${title.backdropPath}` : null);
  
  const posterUrl = title.posterUrl || 
    (title.posterPath ? `https://image.tmdb.org/t/p/w500${title.posterPath}` : null);

  return (
    <div>
      {backdropUrl && (
        <div className="relative w-full h-96">
          <Image
            src={backdropUrl}
            alt={title.localizedTitle || title.originalTitle}
            fill
            className="object-cover"
            priority
          />
          <div className="absolute inset-0 bg-gradient-to-t from-background to-transparent" />
        </div>
      )}

      <div className="container mx-auto px-4 -mt-32 relative z-10">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="md:col-span-1">
            {posterUrl && (
              <Card className="overflow-hidden">
                <div className="aspect-[2/3] relative">
                  <Image
                    src={posterUrl}
                    alt={title.localizedTitle || title.originalTitle}
                    fill
                    className="object-cover"
                  />
                </div>
              </Card>
            )}
          </div>

          <div className="md:col-span-2 space-y-6">
            <div>
              <div className="flex items-start justify-between gap-4">
                <div className="flex-1">
                  <h1 className="text-4xl font-bold mb-2">
                    {title.localizedTitle || title.originalTitle}
                  </h1>
                  {title.originalTitle !== title.localizedTitle && (
                    <p className="text-lg text-muted-foreground">{title.originalTitle}</p>
                  )}
                </div>
                <Button
                  variant={saved ? 'default' : 'outline'}
                  size="lg"
                  onClick={() => toggleSave(id)}
                  className="flex items-center gap-2"
                >
                  {saved ? (
                    <>
                      <BookmarkCheck className="h-5 w-5" />
                      Saved
                    </>
                  ) : (
                    <>
                      <Bookmark className="h-5 w-5" />
                      Save
                    </>
                  )}
                </Button>
              </div>
            </div>

            <div className="flex flex-wrap gap-4 text-sm">
              {title.rating > 0 && (
                <div className="flex items-center gap-1">
                  <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                  <span className="font-semibold">{formatRating(title.rating)}</span>
                </div>
              )}
              {title.runtime && (
                <div className="flex items-center gap-1">
                  <Clock className="h-4 w-4" />
                  <span>{formatRuntime(title.runtime)}</span>
                </div>
              )}
              {title.releaseDate && (
                <div className="flex items-center gap-1">
                  <Calendar className="h-4 w-4" />
                  <span>{formatDate(title.releaseDate)}</span>
                </div>
              )}
            </div>

            {title.genres?.length > 0 && (
              <div className="flex flex-wrap gap-2">
                {title.genres.map((genre: string) => (
                  <span
                    key={genre}
                    className="px-3 py-1 bg-secondary text-secondary-foreground rounded-full text-sm"
                  >
                    {genre}
                  </span>
                ))}
              </div>
            )}

            <div>
              <h2 className="text-xl font-semibold mb-2">{t('title.overview')}</h2>
              <p className="text-muted-foreground">
                {title.localizedOverview || title.overview}
              </p>
            </div>

            {title.cast?.length > 0 && (
              <div>
                <h2 className="text-xl font-semibold mb-2">{t('title.cast')}</h2>
                <div className="flex flex-wrap gap-2">
                  {title.cast.slice(0, 5).map((person: any) => (
                    <span key={person.id} className="text-sm text-muted-foreground">
                      {person.name}
                    </span>
                  ))}
                </div>
              </div>
            )}

            <WatchProviders titleId={id} titleName={title?.originalTitle || title?.localizedTitle || "Movie"} />
          </div>
        </div>

        <div className="mt-12">
          <SimilarTitles titleId={id} />
        </div>
      </div>
    </div>
  );
}

