import { Controller, Get, Query, Headers } from '@nestjs/common';
import { RecommendationsService } from './recommendations.service';

@Controller('api/recommendations')
export class RecommendationsController {
  constructor(private recommendationsService: RecommendationsService) {}

  @Get()
  async getRecommendations(
    @Headers('x-user-id') userId: string,
    @Query('language') language?: string,
    @Query('region') region?: string,
    @Query('page') page?: number,
    @Query('limit') limit?: number,
  ) {
    if (!userId) {
      return this.recommendationsService.getDefaultRecommendations(language, region, page, limit);
    }
    return this.recommendationsService.getPersonalizedRecommendations(
      userId,
      language,
      region,
      page,
      limit,
    );
  }
}

