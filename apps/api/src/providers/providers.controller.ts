import { Controller, Get, Query } from '@nestjs/common';
import { ProvidersService } from './providers.service';

@Controller('api/providers')
export class ProvidersController {
  constructor(private providersService: ProvidersService) {}

  @Get()
  async getProviders(@Query('region') region?: string) {
    return this.providersService.getProviders(region);
  }
}

