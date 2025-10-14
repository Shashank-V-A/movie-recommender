'use client';

import { useState } from 'react';
import { useSearchParams } from 'next/navigation';
import { Suspense } from 'react';
import { useQuery } from '@tanstack/react-query';
import { useTranslation } from 'react-i18next';
import { api } from '@/lib/api';
import { TitleCard } from '@/components/title-card';
import { SearchFilters } from '@/components/search/search-filters';
import { Input } from '@/components/ui/input';
import { Search } from 'lucide-react';

function SearchPageInner() {
  const { t } = useTranslation();
  const searchParams = useSearchParams();
  const [query, setQuery] = useState(searchParams.get('q') || '');
  const [filters, setFilters] = useState({
    type: searchParams.get('type') || 'all',
    genres: searchParams.get('genres')?.split(',').filter(Boolean) || [],
  });

  const { data, isLoading } = useQuery({
    queryKey: ['search', { q: query, ...filters }],
    queryFn: () => api.search({ q: query, ...filters }),
  });

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8">
        <div className="relative max-w-2xl mx-auto">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-muted-foreground" />
          <Input
            type="text"
            placeholder={t('search.placeholder')}
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            className="pl-10"
          />
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
        <aside className="lg:col-span-1">
          <SearchFilters filters={filters} onFiltersChange={setFilters} />
        </aside>

        <main className="lg:col-span-3">
          {isLoading ? (
            <div className="text-center">Loading...</div>
          ) : data?.results?.length > 0 ? (
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
              {data.results.map((title: any) => (
                <TitleCard key={title.id} title={title} />
              ))}
            </div>
          ) : (
            <div className="text-center text-muted-foreground">
              {t('search.noResults')}
            </div>
          )}
        </main>
      </div>
    </div>
  );
}

export default function SearchPage() {
  return (
    <Suspense fallback={<div className="container mx-auto px-4 py-8">Loading...</div>}>
      <SearchPageInner />
    </Suspense>
  );
}

