# Environment Variables Template

Copy this to `.env` in the root directory and fill in your values.

```env
# =============================================================================
# TMDB API (REQUIRED)
# =============================================================================
# Get your API key from: https://www.themoviedb.org/settings/api
TMDB_API_KEY=your_tmdb_api_key_here
TMDB_BASE_URL=https://api.themoviedb.org/3

# =============================================================================
# JustWatch Partner (OPTIONAL - Feature Flagged)
# =============================================================================
# Set to true only if you have a JustWatch partner API key
JUSTWATCH_ENABLED=false
JUSTWATCH_PARTNER_KEY=
JUSTWATCH_BASE_URL=https://apis.justwatch.com/content

# =============================================================================
# Database Configuration
# =============================================================================
# For local development, these defaults are fine
DATABASE_URL=postgresql://cinefindr:cinefindr@localhost:5432/cinefindr
POSTGRES_USER=cinefindr
POSTGRES_PASSWORD=cinefindr
POSTGRES_DB=cinefindr

# =============================================================================
# Redis Cache
# =============================================================================
REDIS_URL=redis://localhost:6379

# =============================================================================
# NextAuth (REQUIRED)
# =============================================================================
# Generate a secure random string (32+ characters)
# You can use: openssl rand -base64 32
NEXTAUTH_SECRET=your_secure_random_string_change_in_production
NEXTAUTH_URL=http://localhost:3000

# =============================================================================
# Google OAuth (OPTIONAL)
# =============================================================================
# Get credentials from: https://console.cloud.google.com/
# Authorized redirect URI: http://localhost:3000/api/auth/callback/google
GOOGLE_CLIENT_ID=
GOOGLE_CLIENT_SECRET=

# =============================================================================
# Recommendation Engine Configuration
# =============================================================================
# Content-based weight (0.0 to 1.0)
RECO_CONTENT_WEIGHT=0.6
# Collaborative filtering weight (0.0 to 1.0)
# Note: weights should sum to 1.0 for best results
RECO_COLLAB_WEIGHT=0.4
# Default region for watch provider availability
DEFAULT_REGION=US

# =============================================================================
# Embedding Model
# =============================================================================
# Sentence transformer model name
EMBEDDING_MODEL=all-MiniLM-L6-v2
# Vector dimension (384 for all-MiniLM-L6-v2)
EMBEDDING_DIMENSION=384

# =============================================================================
# API Configuration
# =============================================================================
API_PORT=3001
API_BASE_URL=http://localhost:3001

# =============================================================================
# Frontend Configuration
# =============================================================================
NEXT_PUBLIC_API_URL=http://localhost:3001

# =============================================================================
# Cache TTL (Time To Live in seconds)
# =============================================================================
CACHE_TTL_SEARCH=3600        # 1 hour
CACHE_TTL_TITLE=7200         # 2 hours
CACHE_TTL_PROVIDERS=86400    # 24 hours
```

## Required Variables

These variables **must** be set:

1. `TMDB_API_KEY` - Get from https://www.themoviedb.org/settings/api
2. `NEXTAUTH_SECRET` - Generate with `openssl rand -base64 32`

## Optional Variables

These enhance functionality but aren't required:

- **Google OAuth** - Enable Google sign-in
- **JustWatch** - Alternative provider data source
- **Recommendation Weights** - Tune recommendation algorithm
- **Cache TTL** - Adjust caching behavior

## Production Considerations

For production deployments, ensure you:

1. ✅ Use strong, unique values for all secrets
2. ✅ Update `NEXTAUTH_URL` to your production domain
3. ✅ Use managed database services (not local PostgreSQL)
4. ✅ Use managed Redis services (not local Redis)
5. ✅ Set appropriate cache TTLs for your traffic
6. ✅ Never commit `.env` to version control
7. ✅ Use environment-specific `.env.production`, `.env.staging`, etc.

## Region Codes

Common region codes for `DEFAULT_REGION`:
- `US` - United States
- `GB` - United Kingdom
- `IN` - India
- `CA` - Canada
- `AU` - Australia
- `DE` - Germany
- `FR` - France
- `ES` - Spain
- `IT` - Italy
- `JP` - Japan

See full list: https://en.wikipedia.org/wiki/ISO_3166-1_alpha-2

## Generating Secure Secrets

### On macOS/Linux:
```bash
# Generate NEXTAUTH_SECRET
openssl rand -base64 32

# Or use Node.js
node -e "console.log(require('crypto').randomBytes(32).toString('base64'))"
```

### On Windows (PowerShell):
```powershell
# Generate random string
[Convert]::ToBase64String((1..32 | ForEach-Object { Get-Random -Maximum 256 }))
```

## Example Development .env

```env
TMDB_API_KEY=abc123xyz789yourkeyhere
NEXTAUTH_SECRET=supersecretrandomstring32characterslong
DATABASE_URL=postgresql://cinefindr:cinefindr@localhost:5432/cinefindr
REDIS_URL=redis://localhost:6379
NEXTAUTH_URL=http://localhost:3000
NEXT_PUBLIC_API_URL=http://localhost:3001
DEFAULT_REGION=US
```

## Example Production .env

```env
TMDB_API_KEY=abc123xyz789yourkeyhere
NEXTAUTH_SECRET=prod_supersecretrandomstring32characterslong
DATABASE_URL=postgresql://user:pass@prod-db.example.com:5432/cinefindr
REDIS_URL=redis://prod-redis.example.com:6379
NEXTAUTH_URL=https://cinefindr.example.com
NEXT_PUBLIC_API_URL=https://api.cinefindr.example.com
GOOGLE_CLIENT_ID=your-google-client-id
GOOGLE_CLIENT_SECRET=your-google-client-secret
DEFAULT_REGION=US
RECO_CONTENT_WEIGHT=0.7
RECO_COLLAB_WEIGHT=0.3
```

---

Save this as `.env` in your project root and fill in your actual values.

