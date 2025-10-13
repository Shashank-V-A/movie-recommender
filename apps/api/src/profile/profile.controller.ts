import { Controller, Post, Get, Body, Headers } from '@nestjs/common';
import { ProfileService } from './profile.service';
import { UpdateProfileDto } from './dto/update-profile.dto';

@Controller('api/profile')
export class ProfileController {
  constructor(private profileService: ProfileService) {}

  @Get()
  async getProfile(@Headers('x-user-id') userId: string) {
    return this.profileService.getProfile(userId);
  }

  @Post()
  async updateProfile(@Headers('x-user-id') userId: string, @Body() dto: UpdateProfileDto) {
    return this.profileService.updateProfile(userId, dto);
  }
}

