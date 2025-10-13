import { Controller, Post, Body, Headers } from '@nestjs/common';
import { InteractionsService } from './interactions.service';
import { CreateInteractionDto } from './dto/create-interaction.dto';

@Controller('api/interactions')
export class InteractionsController {
  constructor(private interactionsService: InteractionsService) {}

  @Post()
  async createInteraction(
    @Headers('x-user-id') userId: string,
    @Body() dto: CreateInteractionDto,
  ) {
    return this.interactionsService.recordInteraction(userId, dto);
  }
}

