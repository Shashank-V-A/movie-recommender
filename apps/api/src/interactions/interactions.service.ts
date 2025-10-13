import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateInteractionDto } from './dto/create-interaction.dto';

const EVENT_SCORES = {
  IMPRESSION: 0.1,
  CLICK: 0.3,
  LIKE: 1.0,
  SAVE: 1.2,
  START: 0.5,
  COMPLETE: 1.5,
};

@Injectable()
export class InteractionsService {
  constructor(private prisma: PrismaService) {}

  async recordInteraction(userId: string, dto: CreateInteractionDto) {
    if (!userId) {
      return { success: false, message: 'User ID required' };
    }

    const interaction = await this.prisma.interaction.create({
      data: {
        userId,
        titleId: dto.titleId,
        event: dto.event,
        score: EVENT_SCORES[dto.event] || 0,
        metadata: dto.metadata,
      },
    });

    return { success: true, interaction };
  }

  async getUserInteractions(userId: string, titleId?: string) {
    const where: any = { userId };
    if (titleId) {
      where.titleId = titleId;
    }

    return this.prisma.interaction.findMany({
      where,
      orderBy: { createdAt: 'desc' },
      take: 100,
    });
  }
}

