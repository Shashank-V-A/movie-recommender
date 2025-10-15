import { NextRequest, NextResponse } from 'next/server';

const TMDB_API_KEY = process.env.TMDB_API_KEY;
const TMDB_BASE_URL = 'https://api.themoviedb.org/3';

// Helper function to get genre ID by name
async function getGenreId(genreName: string, type: 'movie' | 'tv'): Promise<number | null> {
  try {
    const response = await fetch(
      `${TMDB_BASE_URL}/genre/${type}/list?api_key=${TMDB_API_KEY}&language=en-US`
    );
    const data = await response.json();
    const genre = data.genres.find((g: any) => 
      g.name.toLowerCase() === genreName.toLowerCase()
    );
    return genre ? genre.id : null;
  } catch {
    return null;
  }
}

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const query = searchParams.get('q') || '';
    const page = searchParams.get('page') || '1';
    const type = searchParams.get('type') || 'all';
    const genres = searchParams.get('genres') || '';
    const limit = searchParams.get('limit') || '20';

    // Handle genre filtering
    if (genres) {
      const genreNames = genres.split(',').filter(Boolean);
      let genreIds: number[] = [];
      
      // Get genre IDs for each genre name
      for (const genreName of genreNames) {
        let genreId: number | null = null;
        
        if (type === 'movie' || type === 'all') {
          genreId = await getGenreId(genreName, 'movie');
        }
        if (!genreId && (type === 'series' || type === 'all')) {
          genreId = await getGenreId(genreName, 'tv');
        }
        
        if (genreId && !genreIds.includes(genreId)) {
          genreIds.push(genreId);
        }
      }

      // Use discover endpoint for genre filtering
      if (genreIds.length > 0) {
        let results: any[] = [];
        
        if (type === 'movie' || type === 'all') {
          const movieResponse = await fetch(
            `${TMDB_BASE_URL}/discover/movie?api_key=${TMDB_API_KEY}&page=${page}&language=en-US&with_genres=${genreIds.join(',')}&sort_by=popularity.desc`
          );
          const movieData = await movieResponse.json();
          results = results.concat(movieData.results.map((item: any) => ({
            ...item,
            type: 'MOVIE',
            media_type: 'movie'
          })));
        }
        
        if (type === 'series' || type === 'all') {
          const tvResponse = await fetch(
            `${TMDB_BASE_URL}/discover/tv?api_key=${TMDB_API_KEY}&page=${page}&language=en-US&with_genres=${genreIds.join(',')}&sort_by=popularity.desc`
          );
          const tvData = await tvResponse.json();
          results = results.concat(tvData.results.map((item: any) => ({
            ...item,
            type: 'SERIES',
            media_type: 'tv'
          })));
        }

        // Transform results to match expected format
        const transformedResults = results.map((item: any) => ({
          id: item.id.toString(),
          tmdbId: item.id,
          type: item.type,
          originalTitle: item.title || item.name,
          localizedTitle: item.title || item.name,
          overview: item.overview,
          posterPath: item.poster_path,
          backdropPath: item.backdrop_path,
          releaseDate: item.release_date || item.first_air_date,
          rating: item.vote_average,
          voteCount: item.vote_count,
          popularity: item.popularity,
          genres: item.genre_ids || [],
        }));

        // Remove duplicates based on ID and limit results
        const uniqueResults = transformedResults.filter((item: any, index: number, self: any[]) => 
          index === self.findIndex(t => t.id === item.id)
        ).slice(0, parseInt(limit));

        return NextResponse.json({
          results: uniqueResults,
          page: parseInt(page),
          totalPages: Math.ceil(uniqueResults.length / parseInt(limit)),
          hasMore: uniqueResults.length >= parseInt(limit),
        });
      }
    }

    if (!query.trim()) {
      // Return popular content if no query and no genre filter
      let results: any[] = [];
      
      if (type === 'movie' || type === 'all') {
        const movieResponse = await fetch(
          `${TMDB_BASE_URL}/movie/popular?api_key=${TMDB_API_KEY}&page=${page}&language=en-US`
        );
        const movieData = await movieResponse.json();
        results = results.concat(movieData.results.map((item: any) => ({
          ...item,
          type: 'MOVIE'
        })));
      }
      
      if (type === 'series' || type === 'all') {
        const tvResponse = await fetch(
          `${TMDB_BASE_URL}/tv/popular?api_key=${TMDB_API_KEY}&page=${page}&language=en-US`
        );
        const tvData = await tvResponse.json();
        results = results.concat(tvData.results.map((item: any) => ({
          ...item,
          type: 'SERIES'
        })));
      }
      
      const transformedResults = results.map((item: any) => ({
        id: item.id.toString(),
        tmdbId: item.id,
        type: item.type,
        originalTitle: item.title || item.name,
        localizedTitle: item.title || item.name,
        overview: item.overview,
        posterPath: item.poster_path,
        backdropPath: item.backdrop_path,
        releaseDate: item.release_date || item.first_air_date,
        rating: item.vote_average,
        voteCount: item.vote_count,
        popularity: item.popularity,
        genres: item.genre_ids || [],
      }));

      // Remove duplicates and limit
      const uniqueResults = transformedResults.filter((item: any, index: number, self: any[]) => 
        index === self.findIndex(t => t.id === item.id)
      ).slice(0, parseInt(limit));

      return NextResponse.json({
        results: uniqueResults,
        page: parseInt(page),
        totalPages: Math.ceil(uniqueResults.length / parseInt(limit)),
        hasMore: uniqueResults.length >= parseInt(limit),
      });
    }

    // Search with query
    let results: any[] = [];
    
    if (type === 'all' || type === 'movie') {
      const movieResponse = await fetch(
        `${TMDB_BASE_URL}/search/movie?api_key=${TMDB_API_KEY}&query=${encodeURIComponent(query)}&page=${page}&language=en-US`
      );
      if (movieResponse.ok) {
        const movieData = await movieResponse.json();
        results = results.concat(movieData.results.map((item: any) => ({
          id: item.id.toString(),
          tmdbId: item.id,
          type: 'MOVIE',
          originalTitle: item.title,
          localizedTitle: item.title,
          overview: item.overview,
          posterPath: item.poster_path,
          backdropPath: item.backdrop_path,
          releaseDate: item.release_date,
          rating: item.vote_average,
          voteCount: item.vote_count,
          popularity: item.popularity,
          genres: item.genre_ids || [],
        })));
      }
    }
    
    if (type === 'all' || type === 'series') {
      const tvResponse = await fetch(
        `${TMDB_BASE_URL}/search/tv?api_key=${TMDB_API_KEY}&query=${encodeURIComponent(query)}&page=${page}&language=en-US`
      );
      if (tvResponse.ok) {
        const tvData = await tvResponse.json();
        results = results.concat(tvData.results.map((item: any) => ({
          id: item.id.toString(),
          tmdbId: item.id,
          type: 'SERIES',
          originalTitle: item.name,
          localizedTitle: item.name,
          overview: item.overview,
          posterPath: item.poster_path,
          backdropPath: item.backdrop_path,
          releaseDate: item.first_air_date,
          rating: item.vote_average,
          voteCount: item.vote_count,
          popularity: item.popularity,
          genres: item.genre_ids || [],
        })));
      }
    }

    // Remove duplicates based on ID and limit results
    const uniqueResults = results.filter((item: any, index: number, self: any[]) => 
      index === self.findIndex(t => t.id === item.id)
    ).slice(0, parseInt(limit));

    return NextResponse.json({
      results: uniqueResults,
      page: parseInt(page),
      totalPages: Math.ceil(uniqueResults.length / parseInt(limit)),
      hasMore: uniqueResults.length >= parseInt(limit),
    });
  } catch (error) {
    console.error('Error searching:', error);
    return NextResponse.json(
      { error: 'Failed to search' },
      { status: 500 }
    );
  }
}
