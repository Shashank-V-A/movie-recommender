import { NextRequest, NextResponse } from 'next/server';

const TMDB_API_KEY = process.env.TMDB_API_KEY;
const TMDB_BASE_URL = 'https://api.themoviedb.org/3';

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
            linkUrl: regionData.link || `https://www.google.com/search?q=watch+on+${encodeURIComponent(provider.provider_name)}`,
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
            linkUrl: regionData.link || `https://www.google.com/search?q=rent+on+${encodeURIComponent(provider.provider_name)}`,
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
            linkUrl: regionData.link || `https://www.google.com/search?q=buy+on+${encodeURIComponent(provider.provider_name)}`,
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
