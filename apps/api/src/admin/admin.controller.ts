import { Controller, Post, Query } from '@nestjs/common';
import { AdminService } from './admin.service';

@Controller('api/admin')
export class AdminController {
  constructor(private adminService: AdminService) {}

  @Post('sync/tmdb')
  async syncTmdb(@Query('type') type?: 'movie' | 'tv') {
    return this.adminService.syncFromTmdb(type);
  }

  @Post('reco/rebuild')
  async rebuildRecommendations() {
    return this.adminService.rebuildRecommendations();
  }
}

