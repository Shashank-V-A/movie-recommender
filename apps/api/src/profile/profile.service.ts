import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { UpdateProfileDto } from './dto/update-profile.dto';

@Injectable()
export class ProfileService {
  constructor(private prisma: PrismaService) {}

  async getProfile(userId: string) {
    if (!userId) {
      return null;
    }

    const profile = await this.prisma.profile.findUnique({
      where: { userId },
    });

    if (!profile) {
      return this.createDefaultProfile(userId);
    }

    return profile;
  }

  async updateProfile(userId: string, dto: UpdateProfileDto) {
    if (!userId) {
      return { success: false, message: 'User ID required' };
    }

    const profile = await this.prisma.profile.upsert({
      where: { userId },
      update: dto,
      create: {
        userId,
        ...dto,
      },
    });

    return { success: true, profile };
  }

  private async createDefaultProfile(userId: string) {
    return this.prisma.profile.create({
      data: {
        userId,
        preferredGenres: [],
        preferredLanguages: ['en'],
        preferredProviders: [],
        region: 'US',
      },
    });
  }
}

