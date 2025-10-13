import { PrismaClient } from '@prisma/client';
import axios from 'axios';
import * as bcrypt from 'bcrypt';

const prisma = new PrismaClient();
const TMDB_API_KEY = process.env.TMDB_API_KEY;
const TMDB_BASE_URL = 'https://api.themoviedb.org/3';
const DEFAULT_REGION = process.env.DEFAULT_REGION || 'US';

async function fetchFromTmdb(endpoint: string, params: Record<string, any> = {}) {
  const response = await axios.get(`${TMDB_BASE_URL}${endpoint}`, {
    params: {
      api_key: TMDB_API_KEY,
      ...params,
    },
  });
  return response.data;
}

async function seedGenres() {
  console.log('Seeding genres...');
  const [movieGenres, tvGenres] = await Promise.all([
    fetchFromTmdb('/genre/movie/list'),
    fetchFromTmdb('/genre/tv/list'),
  ]);

  const allGenres = [...movieGenres.genres, ...tvGenres.genres];
  const uniqueGenres = Array.from(new Map(allGenres.map((g) => [g.id, g])).values());

  for (const genre of uniqueGenres) {
    await prisma.genre.upsert({
      where: { id: genre.id },
      update: { name: genre.name },
      create: { id: genre.id, name: genre.name },
    });
  }

  console.log(`✅ Seeded ${uniqueGenres.length} genres`);
}

async function seedProviders() {
  console.log('Seeding providers...');
  const providers = [
    { id: 8, name: 'Netflix', regions: ['US', 'IN', 'GB'], displayPriority: 1 },
    { id: 9, name: 'Amazon Prime Video', regions: ['US', 'IN', 'GB'], displayPriority: 2 },
    { id: 337, name: 'Disney Plus', regions: ['US', 'IN', 'GB'], displayPriority: 3 },
    { id: 384, name: 'HBO Max', regions: ['US'], displayPriority: 4 },
    { id: 122, name: 'Hotstar', regions: ['IN'], displayPriority: 5 },
    { id: 119, name: 'Amazon Prime Video', regions: ['IN'], displayPriority: 2 },
    { id: 2, name: 'Apple TV Plus', regions: ['US', 'IN', 'GB'], displayPriority: 6 },
    { id: 350, name: 'Apple TV', regions: ['US', 'IN', 'GB'], displayPriority: 7 },
    { id: 10, name: 'Amazon Video', regions: ['US'], displayPriority: 8 },
    { id: 15, name: 'Hulu', regions: ['US'], displayPriority: 9 },
  ];

  for (const provider of providers) {
    await prisma.provider.upsert({
      where: { id: provider.id },
      update: {
        name: provider.name,
        regions: provider.regions,
        displayPriority: provider.displayPriority,
      },
      create: provider,
    });
  }

  console.log(`✅ Seeded ${providers.length} providers`);
}

async function seedTitles() {
  console.log('Seeding titles from TMDB...');
  const genres = await prisma.genre.findMany();
  const genreMap = new Map(genres.map((g) => [g.id, g.name]));

  let totalSeeded = 0;

  const popularMovies = await fetchFromTmdb('/movie/popular', { page: 1 });
  const popularTv = await fetchFromTmdb('/tv/popular', { page: 1 });
  const trendingMovies = await fetchFromTmdb('/trending/movie/week');
  const trendingTv = await fetchFromTmdb('/trending/tv/week');

  const allMovies = [...popularMovies.results, ...trendingMovies.results]
    .filter((m, i, arr) => arr.findIndex((t) => t.id === m.id) === i)
    .slice(0, 30);

  const allTv = [...popularTv.results, ...trendingTv.results]
    .filter((m, i, arr) => arr.findIndex((t) => t.id === m.id) === i)
    .slice(0, 30);

  for (const movie of allMovies) {
    try {
      const details = await fetchFromTmdb(`/movie/${movie.id}`, {
        append_to_response: 'credits,keywords',
      });

      const providers = await fetchFromTmdb(`/movie/${movie.id}/watch/providers`);

      const existing = await prisma.title.findUnique({
        where: { tmdbId: movie.id },
      });

      if (!existing) {
        const title = await prisma.title.create({
          data: {
            tmdbId: movie.id,
            type: 'MOVIE',
            originalTitle: details.title || details.original_title,
            languages: details.spoken_languages?.map((l) => l.iso_639_1) || [],
            genres: details.genres?.map((g) => genreMap.get(g.id)).filter(Boolean) || [],
            overview: details.overview,
            posterPath: details.poster_path,
            backdropPath: details.backdrop_path,
            releaseDate: details.release_date ? new Date(details.release_date) : null,
            runtime: details.runtime,
            popularity: details.popularity || 0,
            rating: details.vote_average || 0,
            voteCount: details.vote_count || 0,
            originalLanguage: details.original_language,
            cast: details.credits?.cast?.slice(0, 10) || [],
            crew: details.credits?.crew?.slice(0, 5) || [],
          },
        });

        await seedProviderLinks(title.id, movie.id, 'movie', providers.results);
        totalSeeded++;
      }

      await new Promise((resolve) => setTimeout(resolve, 300));
    } catch (error) {
      console.error(`Error seeding movie ${movie.id}:`, error.message);
    }
  }

  for (const tv of allTv) {
    try {
      const details = await fetchFromTmdb(`/tv/${tv.id}`, {
        append_to_response: 'credits,keywords',
      });

      const providers = await fetchFromTmdb(`/tv/${tv.id}/watch/providers`);

      const existing = await prisma.title.findUnique({
        where: { tmdbId: tv.id },
      });

      if (!existing) {
        const title = await prisma.title.create({
          data: {
            tmdbId: tv.id,
            type: 'SERIES',
            originalTitle: details.name || details.original_name,
            languages: details.spoken_languages?.map((l) => l.iso_639_1) || [],
            genres: details.genres?.map((g) => genreMap.get(g.id)).filter(Boolean) || [],
            overview: details.overview,
            posterPath: details.poster_path,
            backdropPath: details.backdrop_path,
            releaseDate: details.first_air_date ? new Date(details.first_air_date) : null,
            runtime: details.episode_run_time?.[0],
            popularity: details.popularity || 0,
            rating: details.vote_average || 0,
            voteCount: details.vote_count || 0,
            originalLanguage: details.original_language,
            cast: details.credits?.cast?.slice(0, 10) || [],
            crew: details.credits?.crew?.slice(0, 5) || [],
          },
        });

        await seedProviderLinks(title.id, tv.id, 'tv', providers.results);
        totalSeeded++;
      }

      await new Promise((resolve) => setTimeout(resolve, 300));
    } catch (error) {
      console.error(`Error seeding TV ${tv.id}:`, error.message);
    }
  }

  console.log(`✅ Seeded ${totalSeeded} titles`);
}

async function seedProviderLinks(titleId: string, tmdbId: number, type: string, providerData: any) {
  if (!providerData) return;

  for (const [region, data] of Object.entries(providerData)) {
    const regionData = data as any;
    const allProviders = [
      ...(regionData.flatrate || []),
      ...(regionData.rent || []),
      ...(regionData.buy || []),
      ...(regionData.ads || []),
      ...(regionData.free || []),
    ];

    const uniqueProviders = Array.from(
      new Map(allProviders.map((p) => [p.provider_id, p])).values(),
    );

    for (const provider of uniqueProviders) {
      let monetizationType: 'FLATRATE' | 'RENT' | 'BUY' | 'ADS' | 'FREE' = 'FLATRATE';
      if (regionData.rent?.find((p) => p.provider_id === provider.provider_id))
        monetizationType = 'RENT';
      if (regionData.buy?.find((p) => p.provider_id === provider.provider_id))
        monetizationType = 'BUY';
      if (regionData.ads?.find((p) => p.provider_id === provider.provider_id))
        monetizationType = 'ADS';
      if (regionData.free?.find((p) => p.provider_id === provider.provider_id))
        monetizationType = 'FREE';

      await prisma.titleAvailability.upsert({
        where: {
          titleId_region_providerId_monetizationType: {
            titleId,
            region,
            providerId: provider.provider_id,
            monetizationType: monetizationType as any,
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
          monetizationType: monetizationType as any,
        },
      });
    }
  }
}

async function seedDemoUsers() {
  console.log('Seeding demo users...');
  const passwordHash = await bcrypt.hash('password123', 10);

  const user1 = await prisma.user.upsert({
    where: { email: 'demo@cinefindr.com' },
    update: {},
    create: {
      email: 'demo@cinefindr.com',
      name: 'Demo User',
      passwordHash,
    },
  });

  await prisma.profile.upsert({
    where: { userId: user1.id },
    update: {},
    create: {
      userId: user1.id,
      preferredGenres: ['Action', 'Sci-Fi', 'Thriller'],
      preferredLanguages: ['en', 'hi'],
      preferredProviders: ['Netflix', 'Amazon Prime Video'],
      region: 'US',
    },
  });

  console.log('✅ Seeded demo users');
}

async function main() {
  try {
    if (!TMDB_API_KEY) {
      console.error('❌ TMDB_API_KEY is required');
      process.exit(1);
    }

    await seedGenres();
    await seedProviders();
    await seedTitles();
    await seedDemoUsers();

    console.log('🎉 Database seeding completed successfully!');
  } catch (error) {
    console.error('Error seeding database:', error);
    process.exit(1);
  } finally {
    await prisma.$disconnect();
  }
}

main();

