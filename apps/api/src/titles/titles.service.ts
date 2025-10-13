import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { TmdbService } from '../tmdb/tmdb.service';
import { CacheService } from '../cache/cache.service';

@Injectable()
export class TitlesService {
  constructor(
    private prisma: PrismaService,
    private tmdbService: TmdbService,
    private cacheService: CacheService,
  ) {}

  async getTitleById(id: string, language = 'en-US', region?: string) {
    const cacheKey = `title:${id}:${language}:${region || 'default'}`;
    const cached = await this.cacheService.get(cacheKey);
    if (cached) return cached;

    const title = await this.prisma.title.findUnique({
      where: { id },
      include: {
        availability: region ? { where: { region } } : true,
      },
    });

    if (!title) {
      throw new NotFoundException('Title not found');
    }

    const result = {
      ...title,
      localizedTitle: title.localizedTitles?.[language] || title.originalTitle,
      localizedOverview: title.localizedOverviews?.[language] || title.overview,
      posterUrl: this.tmdbService.getImageUrl(title.posterPath),
      backdropUrl: this.tmdbService.getImageUrl(title.backdropPath, 'original'),
    };

    await this.cacheService.set(cacheKey, result, 7200);
    return result;
  }

  async getSimilarTitles(id: string, language = 'en-US', limit = 20) {
    const title = await this.prisma.title.findUnique({ where: { id } });
    if (!title) {
      throw new NotFoundException('Title not found');
    }

    const embedding = await this.prisma.embedding.findUnique({
      where: { titleId: id },
    });

    if (!embedding) {
      return this.getFallbackSimilar(title, language, limit);
    }

    const similar = await this.prisma.$queryRaw`
      SELECT t.id, t.tmdb_id, t.type, t.original_title, t.poster_path, t.rating, t.popularity,
             1 - (e.vector <=> ${(embedding as any).vector}::vector) as similarity
      FROM titles t
      JOIN embeddings e ON e.title_id = t.id
      WHERE t.id != ${id}
      ORDER BY e.vector <=> ${(embedding as any).vector}::vector
      LIMIT ${limit}
    `;

    return similar;
  }

  private async getFallbackSimilar(title: any, language: string, limit: number) {
    const genreFilter = title.genres.length > 0 ? { hasSome: title.genres } : undefined;

    return this.prisma.title.findMany({
      where: {
        id: { not: title.id },
        type: title.type,
        ...(genreFilter && { genres: genreFilter }),
      },
      orderBy: [{ popularity: 'desc' }, { rating: 'desc' }],
      take: limit || 20,
      select: {
        id: true,
        tmdbId: true,
        type: true,
        originalTitle: true,
        posterPath: true,
        rating: true,
        popularity: true,
      },
    });
  }
}

