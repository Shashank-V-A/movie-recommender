'use client';

import { useQuery } from '@tanstack/react-query';
import { useSavedTitles } from '@/lib/hooks/use-saved-titles';
import { api } from '@/lib/api';
import { TitleCard } from '@/components/title-card';
import { Bookmark } from 'lucide-react';

export default function SavedPage() {
  const { getSavedTitleIds } = useSavedTitles();
  const savedIds = getSavedTitleIds();

  // Fetch saved titles by their IDs
  const { data: savedTitles, isLoading } = useQuery({
    queryKey: ['saved-titles', savedIds],
    queryFn: async () => {
      if (savedIds.length === 0) return [];
      
      // Fetch titles by IDs
      const titlePromises = savedIds.map(id => api.getTitle(id));
      const titles = await Promise.all(titlePromises);
      return titles.filter(Boolean); // Remove any null/undefined results
    },
    enabled: savedIds.length > 0,
  });

  console.log('Saved titles data:', savedTitles); // Debug log

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex items-center gap-3 mb-8">
        <Bookmark className="h-8 w-8" />
        <h1 className="text-4xl font-bold">Saved Titles</h1>
      </div>
      
      {isLoading ? (
        <div className="text-center py-12">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-muted-foreground">Loading saved titles...</p>
        </div>
      ) : savedTitles?.length === 0 || savedIds.length === 0 ? (
        <div className="text-center py-12">
          <Bookmark className="h-16 w-16 mx-auto mb-4 text-muted-foreground" />
          <p className="text-xl text-muted-foreground">
            No saved movies or series yet
          </p>
          <p className="text-sm text-muted-foreground mt-4">
            Hover over any movie/series card and click the bookmark icon to save it!
          </p>
          {savedIds.length > 0 && (
            <div className="mt-4 p-4 bg-yellow-50 border border-yellow-200 rounded-md">
              <p className="text-sm text-yellow-800">
                Found {savedIds.length} saved IDs but could not load titles. Try refreshing the page.
              </p>
              <p className="text-xs text-yellow-600 mt-1">
                Saved IDs: {savedIds.join(', ')}
              </p>
            </div>
          )}
        </div>
      ) : (
        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
          {(savedTitles ?? []).map((title: any) => (
            <TitleCard key={title.id} title={title} />
          ))}
        </div>
      )}
    </div>
  );
}

