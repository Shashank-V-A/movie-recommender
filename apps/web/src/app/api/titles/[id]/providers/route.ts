import { NextRequest, NextResponse } from 'next/server';

const TMDB_API_KEY = process.env.TMDB_API_KEY;
const TMDB_BASE_URL = 'https://api.themoviedb.org/3';

// Helper function to generate direct links to streaming platforms
function getProviderSearchLink(providerName: string): string {
  const searchLinks: Record<string, string> = {
    'Netflix': 'https://www.netflix.com/search',
    'Amazon Prime Video': 'https://www.primevideo.com/search',
    'Disney Plus': 'https://www.disneyplus.com/search',
    'Disney+': 'https://www.disneyplus.com/search',
    'HBO Max': 'https://www.hbomax.com/search',
    'Hulu': 'https://www.hulu.com/search',
    'Apple TV Plus': 'https://tv.apple.com/search',
    'Apple TV': 'https://tv.apple.com/search',
    'Hotstar': 'https://www.hotstar.com/in/search',
    'Paramount+': 'https://www.paramountplus.com/search',
    'Peacock': 'https://www.peacocktv.com/search',
    'Crunchyroll': 'https://www.crunchyroll.com/search',
    'YouTube': 'https://www.youtube.com/results',
  };
  
  return searchLinks[providerName] || `https://www.google.com/search?q=watch+on+${encodeURIComponent(providerName)}`;
}

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const id = params.id;
    const { searchParams } = new URL(request.url);
    const type = searchParams.get('type') || 'movie';
    
    // Get watch providers from TMDB
    const response = await fetch(
      `${TMDB_BASE_URL}/${type}/${id}/watch/providers?api_key=${TMDB_API_KEY}`
    );

    if (!response.ok) {
      throw new Error('Failed to fetch watch providers');
    }

    const data = await response.json();
    
    // Transform the data to match our expected format
    const providers = [];
    const regions = Object.keys(data.results || {});
    
    for (const region of regions) {
      const regionData = data.results[region];
      
      // Add streaming providers (flatrate)
      if (regionData.flatrate) {
        for (const provider of regionData.flatrate) {
          providers.push({
            providerId: provider.provider_id,
            providerName: provider.provider_name,
            providerLogoPath: provider.logo_path,
            region,
            monetizationType: 'FLATRATE',
            linkUrl: getProviderSearchLink(provider.provider_name),
          });
        }
      }
      
      // Add rental providers (rent)
      if (regionData.rent) {
        for (const provider of regionData.rent) {
          providers.push({
            providerId: provider.provider_id,
            providerName: provider.provider_name,
            providerLogoPath: provider.logo_path,
            region,
            monetizationType: 'RENT',
            linkUrl: getProviderSearchLink(provider.provider_name),
          });
        }
      }
      
      // Add purchase providers (buy)
      if (regionData.buy) {
        for (const provider of regionData.buy) {
          providers.push({
            providerId: provider.provider_id,
            providerName: provider.provider_name,
            providerLogoPath: provider.logo_path,
            region,
            monetizationType: 'BUY',
            linkUrl: getProviderSearchLink(provider.provider_name),
          });
        }
      }
    }
    
    return NextResponse.json({ results: providers });
  } catch (error) {
    console.error('Error fetching watch providers:', error);
    return NextResponse.json(
      { error: 'Failed to fetch watch providers' },
      { status: 500 }
    );
  }
}
