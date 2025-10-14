import { PrismaClient } from '@prisma/client';
import axios from 'axios';

const prisma = new PrismaClient();
const TMDB_API_KEY = process.env.TMDB_API_KEY;
const TMDB_BASE_URL = 'https://api.themoviedb.org/3';

async function fetchFromTmdb(endpoint: string, params: Record<string, any> = {}) {
  try {
    const response = await axios.get(`${TMDB_BASE_URL}${endpoint}`, {
      params: {
        api_key: TMDB_API_KEY,
        ...params,
      },
    });
    return response.data;
  } catch (error) {
    console.error(`Error fetching ${endpoint}:`, error.response?.status);
    return null;
  }
}

async function addMoreContent() {
  console.log('🎬 Adding more movies and TV shows...');
  
  let totalAdded = 0;
  
  // Add more popular movies from different years and genres
  const movieCategories = [
    { endpoint: '/discover/movie', params: { sort_by: 'popularity.desc', year: 2024 } },
    { endpoint: '/discover/movie', params: { sort_by: 'popularity.desc', year: 2023 } },
    { endpoint: '/discover/movie', params: { sort_by: 'popularity.desc', year: 2022 } },
    { endpoint: '/discover/movie', params: { with_genres: '28', sort_by: 'popularity.desc' } }, // Action
    { endpoint: '/discover/movie', params: { with_genres: '35', sort_by: 'popularity.desc' } }, // Comedy
    { endpoint: '/discover/movie', params: { with_genres: '18', sort_by: 'popularity.desc' } }, // Drama
    { endpoint: '/discover/movie', params: { with_genres: '878', sort_by: 'popularity.desc' } }, // Sci-Fi
    { endpoint: '/discover/movie', params: { with_genres: '16', sort_by: 'popularity.desc' } }, // Animation
  ];
  
  for (const category of movieCategories) {
    console.log(`Fetching ${category.endpoint} with params:`, category.params);
    
    for (let page = 1; page <= 3; page++) {
      const data = await fetchFromTmdb(category.endpoint, { ...category.params, page });
      
      if (!data?.results) continue;
      
      for (const movie of data.results.slice(0, 10)) {
        try {
          const existing = await prisma.title.findUnique({
            where: { tmdbId: movie.id },
          });
          
          if (existing) continue;
          
          const details = await fetchFromTmdb(`/movie/${movie.id}`);
          if (!details) continue;
          
          await prisma.title.create({
            data: {
              tmdbId: movie.id,
              type: 'MOVIE',
              originalTitle: details.title || details.original_title,
              localizedTitles: details.title ? { en: details.title } : {},
              languages: details.spoken_languages?.map((l) => l.iso_639_1) || [],
              genres: details.genres?.map((g) => g.name).filter(Boolean) || [],
              overview: details.overview,
              posterPath: details.poster_path,
              backdropPath: details.backdrop_path,
              releaseDate: details.release_date ? new Date(details.release_date) : null,
              runtime: details.runtime,
              popularity: details.popularity || 0,
              rating: details.vote_average || 0,
              voteCount: details.vote_count || 0,
              originalLanguage: details.original_language,
              cast: [],
              crew: [],
            },
          });
          
          totalAdded++;
          console.log(`✅ Added: ${details.title || details.original_title}`);
          
        } catch (error) {
          console.error(`Error adding movie ${movie.id}:`, error.message);
        }
      }
      
      await new Promise(resolve => setTimeout(resolve, 1000));
    }
  }
  
  // Add more TV shows
  const tvCategories = [
    { endpoint: '/discover/tv', params: { sort_by: 'popularity.desc', first_air_date_year: 2024 } },
    { endpoint: '/discover/tv', params: { sort_by: 'popularity.desc', first_air_date_year: 2023 } },
    { endpoint: '/discover/tv', params: { with_genres: '10759', sort_by: 'popularity.desc' } }, // Action & Adventure
    { endpoint: '/discover/tv', params: { with_genres: '35', sort_by: 'popularity.desc' } }, // Comedy
    { endpoint: '/discover/tv', params: { with_genres: '18', sort_by: 'popularity.desc' } }, // Drama
    { endpoint: '/discover/tv', params: { with_genres: '16', sort_by: 'popularity.desc' } }, // Animation
  ];
  
  for (const category of tvCategories) {
    console.log(`Fetching TV ${category.endpoint} with params:`, category.params);
    
    for (let page = 1; page <= 2; page++) {
      const data = await fetchFromTmdb(category.endpoint, { ...category.params, page });
      
      if (!data?.results) continue;
      
      for (const tvShow of data.results.slice(0, 8)) {
        try {
          const existing = await prisma.title.findUnique({
            where: { tmdbId: tvShow.id },
          });
          
          if (existing) continue;
          
          const details = await fetchFromTmdb(`/tv/${tvShow.id}`);
          if (!details) continue;
          
          await prisma.title.create({
            data: {
              tmdbId: tvShow.id,
              type: 'SERIES',
              originalTitle: details.name || details.original_name,
              localizedTitles: details.name ? { en: details.name } : {},
              languages: details.spoken_languages?.map((l) => l.iso_639_1) || [],
              genres: details.genres?.map((g) => g.name).filter(Boolean) || [],
              overview: details.overview,
              posterPath: details.poster_path,
              backdropPath: details.backdrop_path,
              releaseDate: details.first_air_date ? new Date(details.first_air_date) : null,
              runtime: details.episode_run_time?.[0] || null,
              popularity: details.popularity || 0,
              rating: details.vote_average || 0,
              voteCount: details.vote_count || 0,
              originalLanguage: details.original_language,
              cast: [],
              crew: [],
            },
          });
          
          totalAdded++;
          console.log(`✅ Added TV: ${details.name || details.original_name}`);
          
        } catch (error) {
          console.error(`Error adding TV show ${tvShow.id}:`, error.message);
        }
      }
      
      await new Promise(resolve => setTimeout(resolve, 1000));
    }
  }
  
  console.log(`🎉 Added ${totalAdded} more titles!`);
}

async function main() {
  try {
    await addMoreContent();
  } catch (error) {
    console.error('❌ Failed to add more content:', error);
  } finally {
    await prisma.$disconnect();
  }
}

if (require.main === module) {
  main();
}

