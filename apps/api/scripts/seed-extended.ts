import { PrismaClient } from '@prisma/client';
import axios from 'axios';
import * as bcrypt from 'bcrypt';

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
    console.error(`Error fetching ${endpoint}:`, error.response?.status, error.response?.statusText);
    return null;
  }
}

async function seedExtendedContent() {
  console.log('🌱 Starting extended content seeding...');
  
  // Get genre map
  const genreMap = new Map();
  const genres = await prisma.genre.findMany();
  genres.forEach(genre => genreMap.set(genre.name, genre.id));
  
  let totalSeeded = 0;
  const batchSize = 5; // Process in smaller batches to avoid rate limits
  
  // Fetch popular and trending movies from multiple pages
  console.log('📽️ Seeding movies...');
  const moviePages = [1, 2, 3, 4, 5]; // Get more movies
  const allMovies = [];
  
  for (const page of moviePages) {
    console.log(`Fetching movies page ${page}...`);
    const [popular, trending, topRated] = await Promise.all([
      fetchFromTmdb('/movie/popular', { page }),
      fetchFromTmdb('/movie/now_playing', { page }),
      fetchFromTmdb('/movie/top_rated', { page })
    ]);
    
    if (popular?.results) allMovies.push(...popular.results);
    if (trending?.results) allMovies.push(...trending.results);
    if (topRated?.results) allMovies.push(...topRated.results);
    
    // Rate limiting
    await new Promise(resolve => setTimeout(resolve, 1000));
  }
  
  // Remove duplicates
  const uniqueMovies = Array.from(
    new Map(allMovies.map(m => [m.id, m])).values()
  ).filter(m => m.poster_path && m.overview); // Only movies with poster and overview
  
  console.log(`Found ${uniqueMovies.length} unique movies to process`);
  
  // Process movies in batches
  for (let i = 0; i < uniqueMovies.length; i += batchSize) {
    const batch = uniqueMovies.slice(i, i + batchSize);
    
    await Promise.all(batch.map(async (movie) => {
      try {
        const existing = await prisma.title.findUnique({
          where: { tmdbId: movie.id },
        });
        
        if (existing) return;
        
        const details = await fetchFromTmdb(`/movie/${movie.id}`, {
          append_to_response: 'credits,keywords',
        });
        
        if (!details) return;
        
        const providers = await fetchFromTmdb(`/movie/${movie.id}/watch/providers`);
        
        const title = await prisma.title.create({
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
            cast: details.credits?.cast?.slice(0, 10).map(c => c.name) || [],
            crew: details.credits?.crew?.slice(0, 5).map(c => c.name) || [],
          },
        });
        
        // Seed provider links
        if (providers?.results) {
          await seedProviderLinks(title.id, movie.id, 'movie', providers.results);
        }
        
        totalSeeded++;
        console.log(`✅ Added movie: ${title.originalTitle} (${totalSeeded} total)`);
        
      } catch (error) {
        console.error(`Error processing movie ${movie.id}:`, error.message);
      }
    }));
    
    // Rate limiting between batches
    await new Promise(resolve => setTimeout(resolve, 2000));
    console.log(`Processed batch ${Math.floor(i/batchSize) + 1}/${Math.ceil(uniqueMovies.length/batchSize)}`);
  }
  
  // Now seed TV shows
  console.log('📺 Seeding TV shows...');
  const tvPages = [1, 2, 3]; // Get TV shows too
  const allTvShows = [];
  
  for (const page of tvPages) {
    console.log(`Fetching TV shows page ${page}...`);
    const [popular, trending, topRated] = await Promise.all([
      fetchFromTmdb('/tv/popular', { page }),
      fetchFromTmdb('/tv/on_the_air', { page }),
      fetchFromTmdb('/tv/top_rated', { page })
    ]);
    
    if (popular?.results) allTvShows.push(...popular.results);
    if (trending?.results) allTvShows.push(...trending.results);
    if (topRated?.results) allTvShows.push(...topRated.results);
    
    await new Promise(resolve => setTimeout(resolve, 1000));
  }
  
  const uniqueTvShows = Array.from(
    new Map(allTvShows.map(t => [t.id, t])).values()
  ).filter(t => t.poster_path && t.overview);
  
  console.log(`Found ${uniqueTvShows.length} unique TV shows to process`);
  
  for (let i = 0; i < uniqueTvShows.length; i += batchSize) {
    const batch = uniqueTvShows.slice(i, i + batchSize);
    
    await Promise.all(batch.map(async (tvShow) => {
      try {
        const existing = await prisma.title.findUnique({
          where: { tmdbId: tvShow.id },
        });
        
        if (existing) return;
        
        const details = await fetchFromTmdb(`/tv/${tvShow.id}`, {
          append_to_response: 'credits,keywords',
        });
        
        if (!details) return;
        
        const providers = await fetchFromTmdb(`/tv/${tvShow.id}/watch/providers`);
        
        const title = await prisma.title.create({
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
            cast: details.credits?.cast?.slice(0, 10).map(c => c.name) || [],
            crew: details.credits?.crew?.slice(0, 5).map(c => c.name) || [],
          },
        });
        
        if (providers?.results) {
          await seedProviderLinks(title.id, tvShow.id, 'tv', providers.results);
        }
        
        totalSeeded++;
        console.log(`✅ Added TV show: ${title.originalTitle} (${totalSeeded} total)`);
        
      } catch (error) {
        console.error(`Error processing TV show ${tvShow.id}:`, error.message);
      }
    }));
    
    await new Promise(resolve => setTimeout(resolve, 2000));
    console.log(`Processed TV batch ${Math.floor(i/batchSize) + 1}/${Math.ceil(uniqueTvShows.length/batchSize)}`);
  }
  
  console.log(`🎉 Extended seeding completed! Total titles added: ${totalSeeded}`);
}

async function seedProviderLinks(titleId: string, tmdbId: number, type: string, providers: any) {
  if (!providers) return;
  
  const regions = ['US', 'IN', 'GB'];
  
  for (const region of regions) {
    const regionData = providers[region.toLowerCase()];
    if (!regionData) continue;
    
    // Process flatrate (streaming) providers
    if (regionData.flatrate) {
      for (const provider of regionData.flatrate) {
        await prisma.titleAvailability.upsert({
          where: {
            titleId_region_providerId_monetizationType: {
              titleId,
              region,
              providerId: provider.provider_id,
              monetizationType: 'FLATRATE',
            },
          },
          update: {
            providerName: provider.provider_name,
            providerLogoPath: provider.logo_path,
            linkUrl: regionData.link,
          },
          create: {
            titleId,
            region,
            providerId: provider.provider_id,
            providerName: provider.provider_name,
            providerLogoPath: provider.logo_path,
            linkUrl: regionData.link,
            monetizationType: 'FLATRATE' as any,
          },
        });
      }
    }
  }
}

async function main() {
  try {
    await seedExtendedContent();
  } catch (error) {
    console.error('❌ Seeding failed:', error);
  } finally {
    await prisma.$disconnect();
  }
}

if (require.main === module) {
  main();
}
