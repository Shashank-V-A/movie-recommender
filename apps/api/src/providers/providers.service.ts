import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CacheService } from '../cache/cache.service';

@Injectable()
export class ProvidersService {
  constructor(
    private prisma: PrismaService,
    private cacheService: CacheService,
  ) {}

  async getProviders(region?: string) {
    const cacheKey = `providers:${region || 'all'}`;
    const cached = await this.cacheService.get(cacheKey);
    if (cached) return cached;

    const where = region ? { regions: { has: region } } : {};

    const providers = await this.prisma.provider.findMany({
      where,
      orderBy: { displayPriority: 'asc' },
    });

    await this.cacheService.set(cacheKey, providers, 86400);
    return providers;
  }
}

