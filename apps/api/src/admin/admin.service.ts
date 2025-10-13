import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { TmdbService } from '../tmdb/tmdb.service';
import { CacheService } from '../cache/cache.service';

@Injectable()
export class AdminService {
  constructor(
    private prisma: PrismaService,
    private tmdbService: TmdbService,
    private cacheService: CacheService,
  ) {}

  async syncFromTmdb(type: 'movie' | 'tv' = 'movie') {
    await this.cacheService.delPattern('tmdb:*');

    return {
      success: true,
      message: 'Sync initiated. Use seed script for full sync.',
    };
  }

  async rebuildRecommendations() {
    await this.cacheService.delPattern('reco:*');

    return {
      success: true,
      message: 'Recommendation cache cleared. Use reco script for full rebuild.',
    };
  }
}

