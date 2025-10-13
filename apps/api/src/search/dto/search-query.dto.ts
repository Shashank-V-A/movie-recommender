import { IsOptional, IsString, IsEnum, IsInt, Min, Max, IsArray } from 'class-validator';
import { Type, Transform } from 'class-transformer';

export class SearchQueryDto {
  @IsString()
  q: string;

  @IsOptional()
  @IsString()
  language?: string = 'en-US';

  @IsOptional()
  @IsString()
  region?: string = 'US';

  @IsOptional()
  @IsEnum(['movie', 'series', 'all'])
  type?: 'movie' | 'series' | 'all' = 'all';

  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(1)
  page?: number = 1;

  @IsOptional()
  @Transform(({ value }) => value?.split(',').filter(Boolean))
  @IsArray()
  genres?: string[];

  @IsOptional()
  @Type(() => Number)
  @IsInt()
  yearFrom?: number;

  @IsOptional()
  @Type(() => Number)
  @IsInt()
  yearTo?: number;

  @IsOptional()
  @Type(() => Number)
  @Min(0)
  @Max(10)
  minRating?: number;

  @IsOptional()
  @Type(() => Number)
  @IsInt()
  minRuntime?: number;

  @IsOptional()
  @Type(() => Number)
  @IsInt()
  maxRuntime?: number;

  @IsOptional()
  @Transform(({ value }) => value?.split(',').filter(Boolean))
  @IsArray()
  providers?: string[];
}

