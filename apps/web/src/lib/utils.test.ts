import { describe, it, expect } from 'vitest';
import { formatRuntime, formatDate, formatRating } from './utils';

describe('utils', () => {
  describe('formatRuntime', () => {
    it('should format runtime correctly', () => {
      expect(formatRuntime(90)).toBe('1h 30m');
      expect(formatRuntime(45)).toBe('45m');
      expect(formatRuntime(120)).toBe('2h 0m');
    });
  });

  describe('formatRating', () => {
    it('should format rating to 1 decimal', () => {
      expect(formatRating(8.567)).toBe('8.6');
      expect(formatRating(7.0)).toBe('7.0');
    });
  });

  describe('formatDate', () => {
    it('should format date correctly', () => {
      const result = formatDate('2024-01-15');
      expect(result).toContain('2024');
    });
  });
});

