'use client';

import { useQuery } from '@tanstack/react-query';
import { useTranslation } from 'react-i18next';
import { useSavedTitles } from '@/lib/hooks/use-saved-titles';
import { api } from '@/lib/api';
import { TitleCard } from '@/components/title-card';
import { Bookmark } from 'lucide-react';

export default function SavedPage() {
  const { t } = useTranslation();
  const { getSavedTitleIds } = useSavedTitles();
  const savedIds = getSavedTitleIds();

  // Fetch all saved titles
  const { data: allTitles } = useQuery({
    queryKey: ['search', { q: '' }],
    queryFn: () => api.search({ q: '', page: 1 }),
  });

  const savedTitles = allTitles?.results?.filter((title: any) => 
    savedIds.includes(title.id)
  ) || [];

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex items-center gap-3 mb-8">
        <Bookmark className="h-8 w-8" />
        <h1 className="text-4xl font-bold">Saved Titles</h1>
      </div>
      
      {savedTitles.length === 0 ? (
        <div className="text-center py-12">
          <Bookmark className="h-16 w-16 mx-auto mb-4 text-muted-foreground" />
          <p className="text-xl text-muted-foreground">
            No saved movies or series yet
          </p>
          <p className="text-sm text-muted-foreground mt-4">
            Hover over any movie/series card and click the bookmark icon to save it!
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
          {savedTitles.map((title: any) => (
            <TitleCard key={title.id} title={title} />
          ))}
        </div>
      )}
    </div>
  );
}

