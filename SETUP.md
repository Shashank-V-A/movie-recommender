# CineFindr Setup Guide

This guide walks you through setting up CineFindr from scratch.

## Prerequisites

Before you begin, ensure you have:

- **Node.js 18+** and **npm 9+** installed
  ```bash
  node --version  # Should be >= 18.0.0
  npm --version   # Should be >= 9.0.0
  ```

- **Docker Desktop** or **Docker Engine** with **Docker Compose**
  ```bash
  docker --version
  docker-compose --version
  ```

- **TMDB API Key**
  1. Create a free account at https://www.themoviedb.org/
  2. Go to Settings → API
  3. Request an API key (choose "Developer" option)
  4. Copy your API key

## Step-by-Step Setup

### 1. Clone the Repository

```bash
git clone https://github.com/yourusername/cinefindr.git
cd cinefindr
```

### 2. Configure Environment

```bash
# Copy the example environment file
cp .env.example .env
```

Edit `.env` with your favorite editor and configure:

```env
# REQUIRED: Add your TMDB API key
TMDB_API_KEY=your_actual_tmdb_api_key_here

# REQUIRED: Generate a secure random string for NextAuth
NEXTAUTH_SECRET=your_secure_random_string_32_chars_min

# Database (defaults are fine for local development)
DATABASE_URL=postgresql://cinefindr:cinefindr@localhost:5432/cinefindr
POSTGRES_USER=cinefindr
POSTGRES_PASSWORD=cinefindr
POSTGRES_DB=cinefindr

# Redis (default is fine for local)
REDIS_URL=redis://localhost:6379

# API URLs (defaults are fine for local)
API_PORT=3001
NEXTAUTH_URL=http://localhost:3000
NEXT_PUBLIC_API_URL=http://localhost:3001

# OPTIONAL: Google OAuth (leave blank if not using)
GOOGLE_CLIENT_ID=
GOOGLE_CLIENT_SECRET=

# OPTIONAL: JustWatch (disabled by default)
JUSTWATCH_ENABLED=false
JUSTWATCH_PARTNER_KEY=

# Recommendation weights (defaults are fine)
RECO_CONTENT_WEIGHT=0.6
RECO_COLLAB_WEIGHT=0.4
DEFAULT_REGION=US
```

### 3. Start Docker Services

```bash
# Start PostgreSQL and Redis in the background
npm run docker:up
```

Wait ~10 seconds for services to be ready. You can verify with:
```bash
docker-compose ps
```

Both `cinefindr-db` and `cinefindr-redis` should show as "healthy".

### 4. Run Setup

```bash
# This installs dependencies, runs migrations, and seeds the database
npm run setup
```

This command will:
1. Install all npm dependencies (may take 2-5 minutes)
2. Generate Prisma client
3. Run database migrations
4. Enable pgvector extension
5. Seed genres and providers
6. Fetch and seed ~60 titles from TMDB (movies + series)
7. Create a demo user account

**Demo Account Credentials:**
- Email: `demo@cinefindr.com`
- Password: `password123`

### 5. Generate Embeddings (Optional but Recommended)

```bash
# Generate content embeddings for better recommendations
npm run embed
```

This downloads the ML model (~90MB) on first run and generates embeddings for all titles. Takes ~2-5 minutes.

### 6. Start Development Servers

```bash
npm run dev
```

This starts both:
- **Backend API** on http://localhost:3001
- **Frontend** on http://localhost:3000

Wait for both servers to be ready (~30 seconds), then open http://localhost:3000 in your browser.

## Verification

### Check the Homepage
1. Visit http://localhost:3000
2. You should see the CineFindr hero section
3. Trending titles should appear below

### Try Search
1. Type a movie name in the search bar (e.g., "Inception")
2. Click Search or press Enter
3. Results should appear with posters and ratings

### View Title Details
1. Click on any movie/series card
2. Title detail page should load with:
   - Poster and backdrop
   - Overview
   - Cast and crew
   - Watch provider buttons (if available in your region)

### Test Profile
1. Click the user icon in the header
2. Navigate to Profile
3. Select your preferred genres and languages
4. Click Save

## Troubleshooting

### Port Already in Use

If you see "port 3000 already in use" or similar:

```bash
# Find and kill the process
# On macOS/Linux:
lsof -ti:3000 | xargs kill -9
lsof -ti:3001 | xargs kill -9

# On Windows PowerShell:
Get-Process -Id (Get-NetTCPConnection -LocalPort 3000).OwningProcess | Stop-Process
Get-Process -Id (Get-NetTCPConnection -LocalPort 3001).OwningProcess | Stop-Process
```

### Database Connection Errors

```bash
# Restart Docker services
npm run docker:down
npm run docker:up

# Wait 10 seconds, then retry setup
npm run setup
```

### TMDB API Errors

If you see "401 Unauthorized" or "Invalid API key":
1. Double-check your TMDB API key in `.env`
2. Ensure there are no quotes around the key
3. Restart the dev server: `npm run dev`

### Missing Titles

If the homepage is empty:
```bash
# Re-run the seed script
cd apps/api
npm run seed
```

### Clear Everything and Start Over

```bash
# Stop and remove all containers
npm run docker:down

# Remove volumes (WARNING: deletes all data)
docker-compose down -v

# Start fresh
npm run docker:up
npm run setup
npm run dev
```

## Next Steps

### Add More Content

```bash
# Seed more titles (this will add more from TMDB)
cd apps/api
npm run seed
```

### Compute Recommendations

```bash
# After generating embeddings and adding user interactions
npm run reco
```

### Enable Google OAuth

1. Create OAuth credentials at https://console.cloud.google.com/
2. Add `http://localhost:3000/api/auth/callback/google` as authorized redirect URI
3. Add credentials to `.env`:
   ```env
   GOOGLE_CLIENT_ID=your_client_id
   GOOGLE_CLIENT_SECRET=your_client_secret
   ```
4. Restart dev server

### Run Tests

```bash
# Unit tests
npm run test

# E2E tests (requires services running)
npm run test:e2e
```

## Development Workflow

### Making Changes

1. **API changes:**
   - Edit files in `apps/api/src/`
   - NestJS auto-reloads on save
   - View logs in terminal

2. **Frontend changes:**
   - Edit files in `apps/web/src/`
   - Next.js auto-reloads on save
   - Changes appear instantly in browser

3. **Database schema changes:**
   ```bash
   cd apps/api
   # Edit prisma/schema.prisma
   npx prisma migrate dev --name your_migration_name
   npx prisma generate
   ```

### Viewing Logs

```bash
# View all Docker logs
npm run docker:logs

# View specific service
docker-compose logs -f db
docker-compose logs -f redis
```

### Database Management

```bash
cd apps/api

# View data in Prisma Studio
npx prisma studio
# Opens at http://localhost:5555

# Reset database (WARNING: deletes all data)
npx prisma migrate reset
```

## Production Deployment

See README.md "Deployment" section for production setup instructions.

## Getting Help

- Check the main README.md for detailed documentation
- Review code comments for implementation details
- Open an issue on GitHub for bugs
- Check existing issues for common problems

## Success Checklist

- [ ] Docker services running (db + redis)
- [ ] `.env` file configured with TMDB API key
- [ ] Database migrated and seeded
- [ ] Embeddings generated
- [ ] API running on :3001
- [ ] Frontend running on :3000
- [ ] Can view homepage with titles
- [ ] Can search for movies/series
- [ ] Can view title details with watch providers
- [ ] Can update profile preferences

If all checked, you're ready to go! 🎉

