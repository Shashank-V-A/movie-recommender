import { NextRequest, NextResponse } from 'next/server';

const TMDB_API_KEY = process.env.TMDB_API_KEY;
const TMDB_BASE_URL = 'https://api.themoviedb.org/3';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const page = searchParams.get('page') || '1';
    const limit = searchParams.get('limit') || '20';
    const type = searchParams.get('type') || 'movie';

    const endpoint = type === 'movie' ? '/movie/popular' : '/tv/popular';
    
    const response = await fetch(
      `${TMDB_BASE_URL}${endpoint}?api_key=${TMDB_API_KEY}&page=${page}&language=en-US`
    );

    if (!response.ok) {
      throw new Error('TMDB API request failed');
    }

    const data = await response.json();
    
    // Transform the data to match our expected format
    const titles = data.results.map((item: any) => ({
      id: item.id,
      tmdbId: item.id,
      type: type.toUpperCase(),
      originalTitle: item.title || item.name,
      overview: item.overview,
      posterPath: item.poster_path,
      backdropPath: item.backdrop_path,
      releaseDate: item.release_date || item.first_air_date,
      rating: item.vote_average,
      popularity: item.popularity,
      genres: item.genre_ids || [],
    }));

    return NextResponse.json({
      results: titles.slice(0, parseInt(limit)),
      page: parseInt(page),
      totalPages: data.total_pages,
      hasMore: parseInt(page) < data.total_pages,
    });
  } catch (error) {
    console.error('Error fetching titles:', error);
    return NextResponse.json(
      { error: 'Failed to fetch titles' },
      { status: 500 }
    );
  }
}
