import { IsOptional, IsArray, IsString } from 'class-validator';

export class UpdateProfileDto {
  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  preferredGenres?: string[];

  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  preferredLanguages?: string[];

  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  preferredProviders?: string[];

  @IsOptional()
  @IsString()
  region?: string;
}

