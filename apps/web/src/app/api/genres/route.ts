import { NextResponse } from 'next/server';

const TMDB_API_KEY = process.env.TMDB_API_KEY;
const TMDB_BASE_URL = 'https://api.themoviedb.org/3';

export async function GET() {
  try {
    // Get movie genres
    const movieGenresResponse = await fetch(
      `${TMDB_BASE_URL}/genre/movie/list?api_key=${TMDB_API_KEY}&language=en-US`
    );
    
    const movieGenresData = await movieGenresResponse.json();
    
    // Get TV genres
    const tvGenresResponse = await fetch(
      `${TMDB_BASE_URL}/genre/tv/list?api_key=${TMDB_API_KEY}&language=en-US`
    );
    
    const tvGenresData = await tvGenresResponse.json();
    
    // Combine and deduplicate genres
    const allGenres = [...movieGenresData.genres, ...tvGenresData.genres];
    const uniqueGenres = allGenres.filter((genre: any, index: number, self: any[]) => 
      index === self.findIndex(g => g.id === genre.id)
    );
    
    return NextResponse.json(uniqueGenres);
  } catch (error) {
    console.error('Error fetching genres:', error);
    return NextResponse.json(
      { error: 'Failed to fetch genres' },
      { status: 500 }
    );
  }
}
