import { Controller, Get, Param, Query } from '@nestjs/common';
import { TitlesService } from './titles.service';

@Controller('api/titles')
export class TitlesController {
  constructor(private titlesService: TitlesService) {}

  @Get(':id')
  async getTitle(
    @Param('id') id: string,
    @Query('language') language?: string,
    @Query('region') region?: string,
  ) {
    return this.titlesService.getTitleById(id, language, region);
  }

  @Get(':id/similar')
  async getSimilar(
    @Param('id') id: string,
    @Query('language') language?: string,
    @Query('limit') limit?: number,
  ) {
    return this.titlesService.getSimilarTitles(id, language, limit);
  }
}

