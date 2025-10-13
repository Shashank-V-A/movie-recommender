import { IsString, IsEnum, IsOptional, IsObject } from 'class-validator';

export class CreateInteractionDto {
  @IsString()
  titleId: string;

  @IsEnum(['IMPRESSION', 'CLICK', 'LIKE', 'SAVE', 'START', 'COMPLETE'])
  event: 'IMPRESSION' | 'CLICK' | 'LIKE' | 'SAVE' | 'START' | 'COMPLETE';

  @IsOptional()
  @IsObject()
  metadata?: Record<string, any>;
}

