export interface Title {
  id: string;
  tmdbId?: number;
  type: 'MOVIE' | 'SERIES';
  originalTitle: string;
  localizedTitle?: string;
  overview?: string;
  posterPath?: string;
  posterUrl?: string;
  backdropPath?: string;
  releaseDate?: string;
  runtime?: number;
  rating?: number;
  voteCount?: number;
  popularity?: number;
  genres?: string[] | number[];
  languages?: string[];
  cast?: any[];
  crew?: any[];
  availability?: any[];
}
