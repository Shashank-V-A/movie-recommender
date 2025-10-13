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

    const genres = await this.prisma.genre.findMany({
      orderBy: { name: 'asc' },
    });

    await this.cacheService.set(cacheKey, genres, 86400 * 7);
    return genres;
  }
}

