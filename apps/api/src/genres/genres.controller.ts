import { Controller, Get } from '@nestjs/common';
import { GenresService } from './genres.service';

@Controller('api/genres')
export class GenresController {
  constructor(private genresService: GenresService) {}

  @Get()
  async getGenres() {
    return this.genresService.getGenres();
  }
}

