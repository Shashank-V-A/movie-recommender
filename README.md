# CineFindr 🎬

A production-ready, full-stack multilingual movie and series recommender that helps users discover content across all platforms and languages with legal watch links.

## Features

### 🌍 Multilingual Support
- UI localized in English and Hindi (easily extensible)
- Search across multiple languages
- Localized movie/series metadata

### 🎯 Smart Recommendations
- **Hybrid recommendation engine** combining:
  - Content-based filtering using sentence embeddings (pgvector)
  - Collaborative filtering based on user interactions
  - Configurable weight tuning
- Cold start handling with user preferences
- Personalized recommendations based on viewing history

### 📺 Legal Streaming Links
- Integration with TMDB Watch Providers API
- Deep links to Netflix, Prime Video, Disney+, Hotstar, and more
- Region-specific availability
- Multiple monetization types (subscription, rent, buy, ads, free)
- Optional JustWatch partner API support (feature-flagged)

### 🔍 Advanced Search & Filters
- Multi-language search
- Filter by genre, year, rating, runtime, language, region
- Provider-specific filtering
- Subtitle and dubbing availability

### 🎨 Modern UI/UX
- Built with Next.js 14 App Router
- Tailwind CSS + shadcn/ui components
- Dark mode support
- Fully responsive design
- Accessibility-first (keyboard navigation, ARIA labels)

### 🏗️ Production-Ready Architecture
- Monorepo structure with workspace management
- Docker Compose for local development
- PostgreSQL with pgvector for vector search
- Redis caching for API responses
- NextAuth for authentication (email/password + Google OAuth)
- Comprehensive test coverage (Vitest, Jest, Playwright)
- GitHub Actions CI/CD pipeline

## Tech Stack

### Frontend
- **Next.js 14** (App Router, TypeScript)
- **Tailwind CSS** + **shadcn/ui**
- **i18next** for internationalization
- **SWR** + **React Query** for data fetching
- **NextAuth** for authentication

### Backend
- **NestJS** (TypeScript)
- **Prisma ORM** with PostgreSQL
- **pgvector** for embeddings
- **Redis** for caching
- **Axios** for HTTP requests

### ML/AI
- **@xenova/transformers** (sentence-transformers)
- all-MiniLM-L6-v2 model for embeddings
- Collaborative filtering with implicit feedback

### DevOps
- **Docker** + **Docker Compose**
- **GitHub Actions** CI/CD
- **Playwright** E2E testing

## Getting Started

### Prerequisites

- Node.js 18+ and npm 9+
- Docker and Docker Compose
- TMDB API Key ([get one here](https://www.themoviedb.org/settings/api))

### Installation

1. **Clone the repository:**
```bash
git clone https://github.com/yourusername/cinefindr.git
cd cinefindr
```

2. **Set up environment variables:**
```bash
cp .env.example .env
```

Edit `.env` and add your TMDB API key and other configuration:
```env
TMDB_API_KEY=your_tmdb_api_key_here
NEXTAUTH_SECRET=your_secure_random_string_here
# ... other variables as needed
```

3. **Start Docker services:**
```bash
npm run docker:up
```

4. **Install dependencies and setup database:**
```bash
npm run setup
```

This will:
- Install all npm dependencies
- Run Prisma migrations
- Enable pgvector extension
- Seed the database with genres, providers, and sample titles

5. **Start development servers:**
```bash
npm run dev
```

The application will be available at:
- **Frontend:** http://localhost:3000
- **API:** http://localhost:3001

### First Run

After setup, you can:
- Browse trending titles on the homepage
- Search for movies and series
- View title details with watch provider links
- Set preferences in the profile page
- Sign in with demo account: `demo@cinefindr.com` / `password123`

## Scripts

### Root Level
```bash
npm run setup          # Complete setup: install, migrate, seed
npm run dev            # Start all services in development mode
npm run build          # Build all apps
npm run test           # Run all tests
npm run lint           # Lint all code
npm run docker:up      # Start Docker services
npm run docker:down    # Stop Docker services
```

### Backend (apps/api)
```bash
npm run seed           # Seed database with TMDB data
npm run embed          # Generate embeddings for titles
npm run reco           # Compute recommendation scores
npm run db:pgvector    # Enable pgvector extension
```

### Frontend (apps/web)
```bash
npm run dev            # Start Next.js dev server
npm run build          # Build for production
npm run test           # Run Vitest unit tests
npm run test:e2e       # Run Playwright E2E tests
```

## Project Structure

```
cinefindr/
├── apps/
│   ├── api/                    # NestJS backend
│   │   ├── prisma/
│   │   │   ├── schema.prisma   # Database schema
│   │   │   └── migrations/     # Database migrations
│   │   ├── scripts/            # Seed, embed, reco jobs
│   │   └── src/
│   │       ├── admin/          # Admin endpoints
│   │       ├── genres/         # Genre API
│   │       ├── interactions/   # User interaction tracking
│   │       ├── profile/        # User profile management
│   │       ├── providers/      # Streaming provider API
│   │       ├── recommendations/# Recommendation engine
│   │       ├── search/         # Search API
│   │       ├── titles/         # Title details API
│   │       ├── tmdb/           # TMDB integration
│   │       └── cache/          # Redis caching
│   └── web/                    # Next.js frontend
│       ├── src/
│       │   ├── app/            # App Router pages
│       │   ├── components/     # React components
│       │   ├── lib/            # Utilities
│       │   └── test/           # Test setup
│       ├── e2e/                # Playwright tests
│       └── public/             # Static assets
├── .github/
│   └── workflows/
│       └── ci.yml              # GitHub Actions
├── docker-compose.yml          # Docker services
└── package.json                # Root package.json
```

## API Endpoints

### Public Endpoints

- `GET /api/search` - Search movies/series with filters
- `GET /api/titles/:id` - Get title details
- `GET /api/titles/:id/similar` - Get similar titles
- `GET /api/genres` - Get all genres
- `GET /api/providers?region=US` - Get streaming providers

### Authenticated Endpoints

- `GET /api/recommendations` - Get personalized recommendations
- `POST /api/interactions` - Record user interaction
- `GET /api/profile` - Get user profile
- `POST /api/profile` - Update user preferences

### Admin Endpoints

- `POST /api/admin/sync/tmdb` - Sync data from TMDB
- `POST /api/admin/reco/rebuild` - Rebuild recommendation cache

## Database Schema

Key models:
- **User** - User accounts
- **Profile** - User preferences (genres, languages, providers, region)
- **Title** - Movies and series metadata
- **TitleAvailability** - Streaming provider links per region
- **Embedding** - Vector embeddings for content-based recommendations
- **Interaction** - User engagement events (impressions, clicks, likes, etc.)
- **RecoScore** - Pre-computed recommendation scores
- **Provider** - Streaming service information
- **Genre** - Genre taxonomy

## Recommendation Engine

### Content-Based Filtering
1. Embeddings generated from title + overview + genres + cast
2. Uses sentence-transformers (all-MiniLM-L6-v2)
3. Stored in pgvector for fast similarity search
4. Cosine similarity for finding similar content

### Collaborative Filtering
1. Implicit feedback from user interactions
2. Events weighted: IMPRESSION (0.1), CLICK (0.3), LIKE (1.0), SAVE (1.2), START (0.5), COMPLETE (1.5)
3. Item-item similarity based on user overlap
4. Computed via scheduled jobs

### Hybrid Scoring
```
score = (RECO_CONTENT_WEIGHT * contentSimilarity) + (RECO_COLLAB_WEIGHT * collabScore)
```

Default weights: 60% content, 40% collaborative (configurable via env vars)

## Configuration

### Environment Variables

#### Required
- `TMDB_API_KEY` - TMDB API key
- `DATABASE_URL` - PostgreSQL connection string
- `REDIS_URL` - Redis connection string
- `NEXTAUTH_SECRET` - NextAuth secret key

#### Optional
- `JUSTWATCH_ENABLED` - Enable JustWatch integration (default: false)
- `JUSTWATCH_PARTNER_KEY` - JustWatch partner API key
- `GOOGLE_CLIENT_ID` - Google OAuth client ID
- `GOOGLE_CLIENT_SECRET` - Google OAuth client secret
- `RECO_CONTENT_WEIGHT` - Content weight in hybrid scoring (default: 0.6)
- `RECO_COLLAB_WEIGHT` - Collaborative weight (default: 0.4)
- `DEFAULT_REGION` - Default region for availability (default: US)
- `EMBEDDING_MODEL` - Sentence transformer model (default: all-MiniLM-L6-v2)

## Testing

### Unit Tests
```bash
# API tests (Jest)
cd apps/api && npm test

# Frontend tests (Vitest)
cd apps/web && npm test
```

### E2E Tests
```bash
cd apps/web && npm run test:e2e
```

### Coverage
```bash
# API coverage
cd apps/api && npm run test:cov
```

## Deployment

### Docker Production

```bash
# Build images
docker-compose -f docker-compose.yml build

# Run in production
docker-compose -f docker-compose.yml up -d
```

### Environment-Specific Configuration

1. Set production environment variables
2. Configure PostgreSQL with pgvector
3. Set up Redis instance
4. Configure reverse proxy (nginx/Caddy)
5. Enable SSL/TLS certificates

## Attribution & Compliance

This product uses the TMDB API but is not endorsed or certified by TMDB.

- TMDB attribution displayed in footer and About page
- Rate limiting and caching respect TMDB guidelines
- Only official provider links shown (no piracy)
- User region respected for availability

## Contributing

1. Fork the repository
2. Create a feature branch: `git checkout -b feature/amazing-feature`
3. Commit changes: `git commit -m 'Add amazing feature'`
4. Push to branch: `git push origin feature/amazing-feature`
5. Open a Pull Request

## License

This project is licensed under the MIT License.

## Acknowledgments

- [TMDB](https://www.themoviedb.org/) for movie/series data
- [pgvector](https://github.com/pgvector/pgvector) for vector similarity search
- [Xenova/transformers.js](https://github.com/xenova/transformers.js) for ML models
- [shadcn/ui](https://ui.shadcn.com/) for UI components

## Support

For issues and questions:
- GitHub Issues: [Report a bug](https://github.com/yourusername/cinefindr/issues)
- Documentation: See this README and code comments

---

Built with ❤️ for movie and series enthusiasts worldwide

