import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CacheService } from '../cache/cache.service';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class RecommendationsService {
  private contentWeight: number;
  private collabWeight: number;

  constructor(
    private prisma: PrismaService,
    private cacheService: CacheService,
    private configService: ConfigService,
  ) {
    this.contentWeight = parseFloat(this.configService.get('RECO_CONTENT_WEIGHT', '0.6'));
    this.collabWeight = parseFloat(this.configService.get('RECO_COLLAB_WEIGHT', '0.4'));
  }

  async getPersonalizedRecommendations(
    userId: string,
    language = 'en-US',
    region = 'US',
    page = 1,
    limit = 20,
  ) {
    const cacheKey = `reco:${userId}:${language}:${region}:${page}:${limit}`;
    const cached = await this.cacheService.get(cacheKey);
    if (cached) return cached;

    const profile = await this.prisma.profile.findUnique({ where: { userId } });

    const precomputedScores = await this.prisma.recoScore.findMany({
      where: { userId },
      orderBy: { score: 'desc' },
      skip: (page - 1) * limit,
      take: limit,
      include: {
        title: {
          include: {
            availability: region ? { where: { region } } : false,
          },
        },
      },
    });

    if (precomputedScores.length > 0) {
      const result = {
        results: precomputedScores.map((s) => ({
          ...s.title,
          recommendationScore: s.score,
        })),
        page,
        hasMore: precomputedScores.length === limit,
      };
      await this.cacheService.set(cacheKey, result, 1800);
      return result;
    }

    return this.getContentBasedRecommendations(userId, profile, language, region, page, limit);
  }

  async getContentBasedRecommendations(
    userId: string,
    profile: any,
    language: string,
    region: string,
    page: number,
    limit: number,
  ) {
    const interactions = await this.prisma.interaction.findMany({
      where: {
        userId,
        event: { in: ['LIKE', 'SAVE', 'COMPLETE'] },
      },
      orderBy: { createdAt: 'desc' },
      take: 10,
      include: { title: true },
    });

    if (interactions.length === 0) {
      return this.getDefaultRecommendations(language, region, page, limit);
    }

    const likedGenres = [...new Set(interactions.flatMap((i) => i.title.genres))];
    const where: any = {
      id: { notIn: interactions.map((i) => i.titleId) },
    };

    if (likedGenres.length > 0) {
      where.genres = { hasSome: likedGenres };
    }

    if (profile?.preferredLanguages?.length > 0) {
      where.originalLanguage = { in: profile.preferredLanguages };
    }

    const recommendations = await this.prisma.title.findMany({
      where,
      include: {
        availability: region ? { where: { region } } : false,
      },
      orderBy: [{ popularity: 'desc' }, { rating: 'desc' }],
      skip: (page - 1) * limit,
      take: limit,
    });

    return {
      results: recommendations,
      page,
      hasMore: recommendations.length === limit,
    };
  }

  async getDefaultRecommendations(language = 'en-US', region = 'US', page = 1, limit = 20) {
    const cacheKey = `reco:default:${language}:${region}:${page}:${limit}`;
    const cached = await this.cacheService.get(cacheKey);
    if (cached) return cached;

    const pageNum = Number(page) || 1;
    const limitNum = Number(limit) || 20;

    const trending = await this.prisma.title.findMany({
      include: {
        availability: region ? { where: { region } } : false,
      },
      orderBy: [{ popularity: 'desc' }, { rating: 'desc' }],
      skip: (pageNum - 1) * limitNum,
      take: limitNum,
    });

    const result = {
      results: trending,
      page: pageNum,
      hasMore: trending.length === limitNum,
    };

    await this.cacheService.set(cacheKey, result, 3600);
    return result;
  }
}

