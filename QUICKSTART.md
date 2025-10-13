# CineFindr Quick Start Guide

Get CineFindr running in 5 minutes!

## Prerequisites

✅ Node.js 18+ and npm 9+  
✅ Docker Desktop or Docker Engine  
✅ TMDB API Key (get free at https://www.themoviedb.org/settings/api)

## Installation

### 1. Clone & Setup Environment

```bash
# Clone the repository
git clone https://github.com/yourusername/cinefindr.git
cd cinefindr

# Create environment file
cat > .env << 'EOF'
# TMDB API (REQUIRED - get from https://www.themoviedb.org/settings/api)
TMDB_API_KEY=your_tmdb_api_key_here
TMDB_BASE_URL=https://api.themoviedb.org/3

# JustWatch Partner (Optional - disabled by default)
JUSTWATCH_ENABLED=false
JUSTWATCH_PARTNER_KEY=
JUSTWATCH_BASE_URL=https://apis.justwatch.com/content

# Database
DATABASE_URL=postgresql://cinefindr:cinefindr@localhost:5432/cinefindr
POSTGRES_USER=cinefindr
POSTGRES_PASSWORD=cinefindr
POSTGRES_DB=cinefindr

# Redis
REDIS_URL=redis://localhost:6379

# NextAuth (REQUIRED - generate a random 32+ character string)
NEXTAUTH_SECRET=change_this_to_a_random_32_character_string_in_production
NEXTAUTH_URL=http://localhost:3000

# Google OAuth (Optional - leave blank if not using)
GOOGLE_CLIENT_ID=
GOOGLE_CLIENT_SECRET=

# Recommendation Engine (defaults are good)
RECO_CONTENT_WEIGHT=0.6
RECO_COLLAB_WEIGHT=0.4
DEFAULT_REGION=US

# Embedding Model
EMBEDDING_MODEL=all-MiniLM-L6-v2
EMBEDDING_DIMENSION=384

# API Configuration
API_PORT=3001
API_BASE_URL=http://localhost:3001
NEXT_PUBLIC_API_URL=http://localhost:3001

# Cache TTL (seconds)
CACHE_TTL_SEARCH=3600
CACHE_TTL_TITLE=7200
CACHE_TTL_PROVIDERS=86400
EOF

# Edit .env and add your TMDB API key
nano .env  # or use your favorite editor
```

### 2. One-Command Setup

```bash
# Start Docker, install dependencies, setup database, and seed data
npm run docker:up && sleep 10 && npm run setup
```

This will:
- Start PostgreSQL with pgvector
- Start Redis
- Install all dependencies
- Run database migrations
- Seed genres, providers, and ~60 titles from TMDB
- Create demo user (email: demo@cinefindr.com, password: password123)

### 3. Generate Embeddings (Optional but Recommended)

```bash
# Generate ML embeddings for better recommendations (takes 2-5 min)
npm run embed
```

### 4. Start Development

```bash
# Start both frontend and backend
npm run dev
```

## Access the Application

🌐 **Frontend:** http://localhost:3000  
🔧 **API:** http://localhost:3001  
📊 **Prisma Studio:** `cd apps/api && npx prisma studio` (opens on :5555)

## Demo Account

**Email:** demo@cinefindr.com  
**Password:** password123

## Quick Commands

```bash
# Development
npm run dev              # Start all services
npm run build            # Build for production
npm run test             # Run all tests
npm run lint             # Lint all code

# Docker
npm run docker:up        # Start services
npm run docker:down      # Stop services
npm run docker:logs      # View logs

# Database
npm run seed             # Add more titles from TMDB
npm run embed            # Generate embeddings
npm run reco             # Compute recommendation scores

# API-specific (in apps/api)
cd apps/api
npm run start:dev        # Start API only
npm test                 # Run API tests
npx prisma studio        # Open database UI

# Frontend-specific (in apps/web)
cd apps/web
npm run dev              # Start Next.js only
npm test                 # Run unit tests
npm run test:e2e         # Run E2E tests
```

## Testing the App

1. **Browse Trending** - Homepage shows trending movies/series
2. **Search** - Try searching "Inception" or "Breaking Bad"
3. **View Details** - Click any title to see details + watch providers
4. **Set Preferences** - Click user icon → Profile → Select genres/languages
5. **Get Recommendations** - Homepage "For You" section (after setting preferences)

## Features to Try

- 🔍 Advanced search with filters (genre, year, rating, etc.)
- 🎬 Title details with cast, crew, ratings
- 📺 Watch provider deep links (Netflix, Prime, Disney+, etc.)
- 🌍 Multi-language support (toggle between English/Hindi in header)
- 🌙 Dark mode (toggle in header)
- ⭐ Similar titles suggestions
- 🎯 Personalized recommendations

## Troubleshooting

### "Port already in use"
```bash
# Kill processes on ports 3000 and 3001
lsof -ti:3000 | xargs kill -9
lsof -ti:3001 | xargs kill -9
```

### "Database connection failed"
```bash
# Restart Docker services
npm run docker:down
npm run docker:up
# Wait 10 seconds, then retry
```

### "TMDB API error"
- Check your API key in `.env`
- Ensure no extra quotes or spaces
- Verify key is active at https://www.themoviedb.org/settings/api

### "No titles showing"
```bash
# Re-run seed
cd apps/api && npm run seed
```

### Start fresh
```bash
# Nuclear option: delete everything and start over
npm run docker:down
docker-compose down -v
rm -rf node_modules apps/*/node_modules
npm run docker:up && sleep 10 && npm run setup
```

## What's Next?

- ✅ Read [README.md](README.md) for full documentation
- ✅ Check [SETUP.md](SETUP.md) for detailed setup guide
- ✅ See [CONTRIBUTING.md](CONTRIBUTING.md) to contribute
- ✅ Review API docs and database schema in README
- ✅ Deploy to production (see README "Deployment" section)

## Project Structure Overview

```
cinefindr/
├── apps/
│   ├── api/          # NestJS backend (port 3001)
│   └── web/          # Next.js frontend (port 3000)
├── .github/          # CI/CD workflows
├── docker-compose.yml
└── package.json      # Root workspace
```

## Key Technologies

- **Frontend:** Next.js 14, React, Tailwind, shadcn/ui
- **Backend:** NestJS, Prisma, PostgreSQL, Redis
- **ML:** Sentence transformers, pgvector
- **Auth:** NextAuth (email + Google OAuth)
- **Data:** TMDB API
- **Tests:** Vitest, Jest, Playwright

## Support

📖 Full docs: [README.md](README.md)  
🐛 Issues: GitHub Issues  
💬 Questions: GitHub Discussions

---

**Enjoy discovering your next favorite movie or series! 🎬✨**

