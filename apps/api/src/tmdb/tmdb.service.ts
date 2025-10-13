import { Injectable } from '@nestjs/common';
import { HttpService } from '@nestjs/axios';
import { ConfigService } from '@nestjs/config';
import { firstValueFrom } from 'rxjs';
import { CacheService } from '../cache/cache.service';

@Injectable()
export class TmdbService {
  private readonly baseUrl: string;
  private readonly apiKey: string;
  private readonly imageBaseUrl = 'https://image.tmdb.org/t/p';

  constructor(
    private httpService: HttpService,
    private configService: ConfigService,
    private cacheService: CacheService,
  ) {
    this.baseUrl = this.configService.get<string>('TMDB_BASE_URL', 'https://api.themoviedb.org/3');
    this.apiKey = this.configService.get<string>('TMDB_API_KEY');
  }

  private async request<T>(endpoint: string, params: Record<string, any> = {}): Promise<T> {
    const url = `${this.baseUrl}${endpoint}`;
    const response = await firstValueFrom(
      this.httpService.get<T>(url, {
        params: {
          api_key: this.apiKey,
          ...params,
        },
      }),
    );
    return response.data;
  }

  async searchMovies(query: string, language = 'en-US', page = 1) {
    const cacheKey = `tmdb:search:movie:${query}:${language}:${page}`;
    const cached = await this.cacheService.get(cacheKey);
    if (cached) return cached;

    const result = await this.request('/search/movie', { query, language, page });
    await this.cacheService.set(cacheKey, result, 3600);
    return result;
  }

  async searchTv(query: string, language = 'en-US', page = 1) {
    const cacheKey = `tmdb:search:tv:${query}:${language}:${page}`;
    const cached = await this.cacheService.get(cacheKey);
    if (cached) return cached;

    const result = await this.request('/search/tv', { query, language, page });
    await this.cacheService.set(cacheKey, result, 3600);
    return result;
  }

  async getMovieDetails(movieId: number, language = 'en-US') {
    const cacheKey = `tmdb:movie:${movieId}:${language}`;
    const cached = await this.cacheService.get(cacheKey);
    if (cached) return cached;

    const result = await this.request(`/movie/${movieId}`, { language, append_to_response: 'credits,keywords' });
    await this.cacheService.set(cacheKey, result, 7200);
    return result;
  }

  async getTvDetails(tvId: number, language = 'en-US') {
    const cacheKey = `tmdb:tv:${tvId}:${language}`;
    const cached = await this.cacheService.get(cacheKey);
    if (cached) return cached;

    const result = await this.request(`/tv/${tvId}`, { language, append_to_response: 'credits,keywords' });
    await this.cacheService.set(cacheKey, result, 7200);
    return result;
  }

  async getMovieWatchProviders(movieId: number) {
    const cacheKey = `tmdb:movie:providers:${movieId}`;
    const cached = await this.cacheService.get(cacheKey);
    if (cached) return cached;

    const result = await this.request(`/movie/${movieId}/watch/providers`);
    await this.cacheService.set(cacheKey, result, 86400);
    return result;
  }

  async getTvWatchProviders(tvId: number) {
    const cacheKey = `tmdb:tv:providers:${tvId}`;
    const cached = await this.cacheService.get(cacheKey);
    if (cached) return cached;

    const result = await this.request(`/tv/${tvId}/watch/providers`);
    await this.cacheService.set(cacheKey, result, 86400);
    return result;
  }

  async getSimilarMovies(movieId: number, language = 'en-US', page = 1) {
    return this.request(`/movie/${movieId}/similar`, { language, page });
  }

  async getSimilarTv(tvId: number, language = 'en-US', page = 1) {
    return this.request(`/tv/${tvId}/similar`, { language, page });
  }

  async getGenres(type: 'movie' | 'tv', language = 'en-US') {
    const cacheKey = `tmdb:genres:${type}:${language}`;
    const cached = await this.cacheService.get(cacheKey);
    if (cached) return cached;

    const result = await this.request(`/genre/${type}/list`, { language });
    await this.cacheService.set(cacheKey, result, 86400 * 7);
    return result;
  }

  async discoverMovies(params: Record<string, any>) {
    return this.request('/discover/movie', params);
  }

  async discoverTv(params: Record<string, any>) {
    return this.request('/discover/tv', params);
  }

  async getTrending(mediaType: 'movie' | 'tv' | 'all', timeWindow: 'day' | 'week' = 'week', language = 'en-US') {
    const cacheKey = `tmdb:trending:${mediaType}:${timeWindow}:${language}`;
    const cached = await this.cacheService.get(cacheKey);
    if (cached) return cached;

    const result = await this.request(`/trending/${mediaType}/${timeWindow}`, { language });
    await this.cacheService.set(cacheKey, result, 3600);
    return result;
  }

  getImageUrl(path: string, size: 'w200' | 'w300' | 'w500' | 'original' = 'w500'): string {
    if (!path) return null;
    return `${this.imageBaseUrl}/${size}${path}`;
  }
}

