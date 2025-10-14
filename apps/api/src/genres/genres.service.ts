import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CacheService } from '../cache/cache.service';

@Injectable()
export class GenresService {
  constructor(
    private prisma: PrismaService,
    private cacheService: CacheService,
  ) {}

  async getGenres() {
    const cacheKey = 'genres:all';
    const cached = await this.cacheService.get(cacheKey);
    if (cached) return cached;

    // Get genres with title counts
    const genresWithCounts = await this.prisma.$queryRaw`
      SELECT 
        g.id,
        g.name,
        COUNT(DISTINCT t.id) as title_count
      FROM genres g
      LEFT JOIN titles t ON JSON_CONTAINS(t.genres, JSON_QUOTE(g.name))
      GROUP BY g.id, g.name
      ORDER BY g.name ASC
    `;

    // Filter out genres with very few titles to improve UX
    const popularGenres = (genresWithCounts as any[]).filter(genre => 
      Number(genre.title_count) > 0 && 
      !['News', 'Reality', 'Soap', 'Talk', 'TV Movie'].includes(genre.name)
    );

    await this.cacheService.set(cacheKey, popularGenres, 86400 * 7);
    return popularGenres;
  }

  async getGenreStats() {
    const cacheKey = 'genres:stats';
    const cached = await this.cacheService.get(cacheKey);
    if (cached) return cached;

    const stats = await this.prisma.$queryRaw`
      SELECT 
        g.name,
        COUNT(DISTINCT t.id) as title_count,
        COUNT(DISTINCT CASE WHEN t.type = 'MOVIE' THEN t.id END) as movie_count,
        COUNT(DISTINCT CASE WHEN t.type = 'SERIES' THEN t.id END) as series_count
      FROM genres g
      LEFT JOIN titles t ON JSON_CONTAINS(t.genres, JSON_QUOTE(g.name))
      GROUP BY g.name
      HAVING title_count > 0
      ORDER BY title_count DESC
    `;

    await this.cacheService.set(cacheKey, stats, 86400); // Cache for 1 day
    return stats;
  }
}

