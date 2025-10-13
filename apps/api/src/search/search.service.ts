import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { TmdbService } from '../tmdb/tmdb.service';
import { CacheService } from '../cache/cache.service';
import { SearchQueryDto } from './dto/search-query.dto';

@Injectable()
export class SearchService {
  constructor(
    private prisma: PrismaService,
    private tmdbService: TmdbService,
    private cacheService: CacheService,
  ) {}

  async search(query: SearchQueryDto) {
    const cacheKey = `search:${JSON.stringify(query)}`;
    const cached = await this.cacheService.get(cacheKey);
    if (cached) return cached;

    const where: any = {};

    if (query.type && query.type !== 'all') {
      where.type = query.type.toUpperCase();
    }

    if (query.genres?.length > 0) {
      where.genres = { hasSome: query.genres };
    }

    if (query.yearFrom || query.yearTo) {
      where.releaseDate = {};
      if (query.yearFrom) {
        where.releaseDate.gte = new Date(`${query.yearFrom}-01-01`);
      }
      if (query.yearTo) {
        where.releaseDate.lte = new Date(`${query.yearTo}-12-31`);
      }
    }

    if (query.minRating) {
      where.rating = { gte: query.minRating };
    }

    if (query.minRuntime || query.maxRuntime) {
      where.runtime = {};
      if (query.minRuntime) where.runtime.gte = query.minRuntime;
      if (query.maxRuntime) where.runtime.lte = query.maxRuntime;
    }

    if (query.q) {
      where.OR = [
        { originalTitle: { contains: query.q, mode: 'insensitive' } },
        { overview: { contains: query.q, mode: 'insensitive' } },
      ];
    }

    const [titles, total] = await Promise.all([
      this.prisma.title.findMany({
        where,
        include: {
          availability: query.region ? { where: { region: query.region } } : false,
        },
        orderBy: [{ popularity: 'desc' }, { rating: 'desc' }],
        skip: (query.page - 1) * 20,
        take: 20,
      }),
      this.prisma.title.count({ where }),
    ]);

    if (query.providers?.length > 0) {
      const filtered = titles.filter((title) =>
        title.availability?.some((av) => query.providers.includes(av.providerName)),
      );
      const result = {
        results: filtered.map((t) => this.formatTitle(t)),
        page: query.page,
        total_results: filtered.length,
        total_pages: Math.ceil(filtered.length / 20),
      };
      await this.cacheService.set(cacheKey, result, 3600);
      return result;
    }

    const result = {
      results: titles.map((t) => this.formatTitle(t)),
      page: query.page,
      total_results: total,
      total_pages: Math.ceil(total / 20),
    };

    await this.cacheService.set(cacheKey, result, 3600);
    return result;
  }

  private formatTitle(title: any) {
    return {
      id: title.id,
      tmdbId: title.tmdbId,
      type: title.type,
      title: title.originalTitle,
      overview: title.overview,
      posterUrl: this.tmdbService.getImageUrl(title.posterPath),
      rating: title.rating,
      popularity: title.popularity,
      releaseDate: title.releaseDate,
      genres: title.genres,
      availability: title.availability || [],
    };
  }
}

