# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [1.0.0] - 2025-01-01

### Added
- Initial release of CineFindr
- Multilingual movie and series recommender
- Hybrid recommendation engine (content-based + collaborative)
- Integration with TMDB API for metadata and watch providers
- Support for legal streaming links
- Next.js 14 frontend with App Router
- NestJS backend with REST API
- PostgreSQL database with Prisma ORM
- pgvector for semantic search
- Redis caching layer
- NextAuth authentication (email/password + Google OAuth)
- i18next internationalization (English, Hindi)
- Dark mode support
- Responsive design
- Comprehensive test suite (Vitest, Jest, Playwright)
- GitHub Actions CI/CD pipeline
- Docker Compose for development
- Seed scripts for TMDB data
- Embedding generation worker
- Recommendation computation jobs
- Profile preferences management
- Advanced search with filters
- Genre-based browsing
- Similar titles suggestions

### Features
- Search across movies and series in multiple languages
- Filter by genre, year, rating, runtime, language, region, and provider
- View detailed information including cast, crew, and overview
- Watch provider links with regional availability
- Personalized recommendations based on viewing history
- User preference customization
- Trending content display
- Genre-specific content rows

### Technical
- Monorepo structure with npm workspaces
- TypeScript throughout the stack
- Tailwind CSS with shadcn/ui components
- Sentence transformers for embeddings (all-MiniLM-L6-v2)
- Configurable recommendation weights
- Rate limiting and caching for external APIs
- Comprehensive error handling
- Production-ready Docker setup

[1.0.0]: https://github.com/yourusername/cinefindr/releases/tag/v1.0.0

