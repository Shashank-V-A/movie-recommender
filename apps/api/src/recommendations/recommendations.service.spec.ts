import { Test, TestingModule } from '@nestjs/testing';
import { RecommendationsService } from './recommendations.service';
import { PrismaService } from '../prisma/prisma.service';
import { CacheService } from '../cache/cache.service';
import { ConfigService } from '@nestjs/config';

describe('RecommendationsService', () => {
  let service: RecommendationsService;
  let prisma: PrismaService;
  let cache: CacheService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        RecommendationsService,
        {
          provide: PrismaService,
          useValue: {
            profile: { findUnique: jest.fn() },
            interaction: { findMany: jest.fn() },
            title: { findMany: jest.fn() },
            recoScore: { findMany: jest.fn() },
          },
        },
        {
          provide: CacheService,
          useValue: {
            get: jest.fn(),
            set: jest.fn(),
          },
        },
        {
          provide: ConfigService,
          useValue: {
            get: jest.fn((key: string) => {
              if (key === 'RECO_CONTENT_WEIGHT') return '0.6';
              if (key === 'RECO_COLLAB_WEIGHT') return '0.4';
              return null;
            }),
          },
        },
      ],
    }).compile();

    service = module.get<RecommendationsService>(RecommendationsService);
    prisma = module.get<PrismaService>(PrismaService);
    cache = module.get<CacheService>(CacheService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('should return default recommendations when cache is empty', async () => {
    jest.spyOn(cache, 'get').mockResolvedValue(null);
    jest.spyOn(prisma.title, 'findMany').mockResolvedValue([
      {
        id: '1',
        tmdbId: 123,
        type: 'MOVIE',
        originalTitle: 'Test Movie',
        popularity: 100,
        rating: 8.5,
      } as any,
    ]);

    const result: any = await service.getDefaultRecommendations();

    expect(result.results).toHaveLength(1);
    expect(result.results[0].originalTitle).toBe('Test Movie');
  });
});

