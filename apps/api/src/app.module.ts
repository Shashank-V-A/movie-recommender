import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { PrismaModule } from './prisma/prisma.module';
import { TmdbModule } from './tmdb/tmdb.module';
import { TitlesModule } from './titles/titles.module';
import { SearchModule } from './search/search.module';
import { RecommendationsModule } from './recommendations/recommendations.module';
import { ProvidersModule } from './providers/providers.module';
import { GenresModule } from './genres/genres.module';
import { InteractionsModule } from './interactions/interactions.module';
import { ProfileModule } from './profile/profile.module';
import { AdminModule } from './admin/admin.module';
import { CacheModule } from './cache/cache.module';
import { HealthController } from './health.controller';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    PrismaModule,
    CacheModule,
    TmdbModule,
    TitlesModule,
    SearchModule,
    RecommendationsModule,
    ProvidersModule,
    GenresModule,
    InteractionsModule,
    ProfileModule,
    AdminModule,
  ],
  controllers: [HealthController],
})
export class AppModule {}

