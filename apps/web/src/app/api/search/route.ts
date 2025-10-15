import { NextRequest, NextResponse } from 'next/server';

const TMDB_API_KEY = process.env.TMDB_API_KEY;
const TMDB_BASE_URL = 'https://api.themoviedb.org/3';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const query = searchParams.get('q') || '';
    const page = searchParams.get('page') || '1';
    const type = searchParams.get('type') || 'multi';

    if (!query.trim()) {
      // Return popular content if no query
      const endpoint = type === 'movie' ? '/movie/popular' : 
                      type === 'series' ? '/tv/popular' : '/trending/all/day';
      
      const response = await fetch(
        `${TMDB_BASE_URL}${endpoint}?api_key=${TMDB_API_KEY}&page=${page}&language=en-US`
      );

      if (!response.ok) {
        throw new Error('TMDB API request failed');
      }

      const data = await response.json();
      
      const results = data.results.map((item: any) => ({
        id: item.id,
        tmdbId: item.id,
        type: item.media_type?.toUpperCase() || (item.title ? 'MOVIE' : 'SERIES'),
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
        results,
        page: parseInt(page),
        totalPages: data.total_pages,
        hasMore: parseInt(page) < data.total_pages,
      });
    }

    // Search with query
    const response = await fetch(
      `${TMDB_BASE_URL}/search/${type}?api_key=${TMDB_API_KEY}&query=${encodeURIComponent(query)}&page=${page}&language=en-US`
    );

    if (!response.ok) {
      throw new Error('TMDB API request failed');
    }

    const data = await response.json();
    
    const results = data.results.map((item: any) => ({
      id: item.id,
      tmdbId: item.id,
      type: item.media_type?.toUpperCase() || (item.title ? 'MOVIE' : 'SERIES'),
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
      results,
      page: parseInt(page),
      totalPages: data.total_pages,
      hasMore: parseInt(page) < data.total_pages,
    });
  } catch (error) {
    console.error('Error searching:', error);
    return NextResponse.json(
      { error: 'Failed to search' },
      { status: 500 }
    );
  }
}
