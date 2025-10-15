'use client';

import { useQuery } from '@tanstack/react-query';
import { useTranslation } from 'react-i18next';
import Image from 'next/image';
import { api } from '@/lib/api';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ExternalLink } from 'lucide-react';

interface WatchProvidersProps {
  titleId: string;
  titleName?: string;
}

export function WatchProviders({ titleId, titleName = "Movie" }: WatchProvidersProps) {
  const { t } = useTranslation();

  const { data: providers, isLoading } = useQuery({
    queryKey: ['watch-providers', titleId],
    queryFn: async () => {
      const response = await fetch(`/api/titles/${titleId}/providers`);
      if (!response.ok) {
        throw new Error('Failed to fetch providers');
      }
      return response.json();
    },
  });

  if (isLoading) {
    return (
      <Card>
        <CardContent className="p-6">
          <h2 className="text-xl font-semibold mb-4">{t('title.whereToWatch')}</h2>
          <p className="text-muted-foreground">Loading watch options...</p>
        </CardContent>
      </Card>
    );
  }

  const availability = providers?.results || [];

  if (availability.length === 0) {
    return (
      <Card>
        <CardContent className="p-6">
          <h2 className="text-xl font-semibold mb-4">{t('title.whereToWatch')}</h2>
          <p className="text-muted-foreground">Check back later for availability</p>
        </CardContent>
      </Card>
    );
  }

  // Helper function to generate search links for streaming platforms
  const getProviderSearchLink = (providerName: string, titleName: string) => {
    const encodedTitle = encodeURIComponent(titleName);
    
    // Platform-specific search URLs
    const searchLinks: Record<string, string> = {
      'Netflix': `https://www.netflix.com/search?q=${encodedTitle}`,
      'Amazon Prime Video': `https://www.primevideo.com/search/ref=atv_nb_sr?phrase=${encodedTitle}`,
      'Disney Plus': `https://www.disneyplus.com/search?q=${encodedTitle}`,
      'Disney+': `https://www.disneyplus.com/search?q=${encodedTitle}`,
      'HBO Max': `https://www.hbomax.com/search?q=${encodedTitle}`,
      'Hulu': `https://www.hulu.com/search?q=${encodedTitle}`,
      'Apple TV Plus': `https://tv.apple.com/search?q=${encodedTitle}`,
      'Apple TV': `https://tv.apple.com/search?q=${encodedTitle}`,
      'Hotstar': `https://www.hotstar.com/in/search?q=${encodedTitle}`,
    };
    
    // Return platform search link or Google search as fallback
    return searchLinks[providerName] || `https://www.google.com/search?q=watch+${encodedTitle}+on+${encodeURIComponent(providerName)}`;
  };

  // Use the titleName prop
  
  const groupedProviders = availability.reduce((acc: any, item: any) => {
    if (!acc[item.providerName]) {
      acc[item.providerName] = {
        name: item.providerName,
        logoPath: item.providerLogoPath,
        linkUrl: item.linkUrl || getProviderSearchLink(item.providerName, titleName),
        types: [],
      };
    }
    acc[item.providerName].types.push(item.monetizationType);
    return acc;
  }, {});

  return (
    <Card>
      <CardContent className="p-6">
        <h2 className="text-xl font-semibold mb-4">{t('title.whereToWatch')}</h2>
        <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
          {Object.values(groupedProviders).map((provider: any) => (
            <a
              key={provider.name}
              href={provider.linkUrl || '#'}
              target="_blank"
              rel="noopener noreferrer"
              className="block"
            >
              <Card className="hover:ring-2 ring-primary transition-all cursor-pointer">
                <CardContent className="p-4 text-center">
                  {provider.logoPath && (
                    <div className="relative w-16 h-16 mx-auto mb-2">
                      <Image
                        src={`https://image.tmdb.org/t/p/original${provider.logoPath}`}
                        alt={provider.name}
                        fill
                        className="object-contain rounded"
                      />
                    </div>
                  )}
                  <p className="font-semibold text-sm">{provider.name}</p>
                  <p className="text-xs text-muted-foreground mt-1">
                    Available to stream
                  </p>
                  <Button size="sm" className="mt-2 w-full">
                    <ExternalLink className="h-3 w-3 mr-1" />
                    {t('common.watchNow')}
                  </Button>
                </CardContent>
              </Card>
            </a>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}

