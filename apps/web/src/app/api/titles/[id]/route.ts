import { NextRequest, NextResponse } from 'next/server';

const TMDB_API_KEY = process.env.TMDB_API_KEY;
const TMDB_BASE_URL = 'https://api.themoviedb.org/3';

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const id = params.id;
    
    // First, get the title details
    const detailsResponse = await fetch(
      `${TMDB_BASE_URL}/movie/${id}?api_key=${TMDB_API_KEY}&append_to_response=credits,keywords`
    );

    if (!detailsResponse.ok) {
      // Try TV show if movie fails
      const tvResponse = await fetch(
        `${TMDB_BASE_URL}/tv/${id}?api_key=${TMDB_API_KEY}&append_to_response=credits,keywords`
      );
      
      if (!tvResponse.ok) {
        throw new Error('Title not found');
      }
      
      const tvData = await tvResponse.json();
      return NextResponse.json(transformTvData(tvData));
    }

    const data = await detailsResponse.json();
    return NextResponse.json(transformMovieData(data));
  } catch (error) {
    console.error('Error fetching title:', error);
    return NextResponse.json(
      { error: 'Failed to fetch title' },
      { status: 500 }
    );
  }
}

function transformMovieData(data: any) {
  return {
    id: data.id,
    tmdbId: data.id,
    type: 'MOVIE',
    originalTitle: data.title || data.original_title,
    overview: data.overview,
    posterPath: data.poster_path,
    backdropPath: data.backdrop_path,
    releaseDate: data.release_date,
    runtime: data.runtime,
    rating: data.vote_average,
    popularity: data.popularity,
    genres: data.genres?.map((g: any) => g.name) || [],
    cast: data.credits?.cast?.slice(0, 10).map((c: any) => c.name) || [],
    crew: data.credits?.crew?.slice(0, 5).map((c: any) => c.name) || [],
  };
}

function transformTvData(data: any) {
  return {
    id: data.id,
    tmdbId: data.id,
    type: 'SERIES',
    originalTitle: data.name || data.original_name,
    overview: data.overview,
    posterPath: data.poster_path,
    backdropPath: data.backdrop_path,
    releaseDate: data.first_air_date,
    runtime: data.episode_run_time?.[0] || null,
    rating: data.vote_average,
    popularity: data.popularity,
    genres: data.genres?.map((g: any) => g.name) || [],
    cast: data.credits?.cast?.slice(0, 10).map((c: any) => c.name) || [],
    crew: data.credits?.crew?.slice(0, 5).map((c: any) => c.name) || [],
  };
}
