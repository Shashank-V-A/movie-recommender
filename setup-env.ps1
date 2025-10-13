# CineFindr Environment Setup Script
Write-Host "🎬 CineFindr Environment Setup" -ForegroundColor Cyan
Write-Host ""

# Check if .env already exists
if (Test-Path ".env") {
    Write-Host "⚠️  .env file already exists!" -ForegroundColor Yellow
    $overwrite = Read-Host "Do you want to overwrite it? (yes/no)"
    if ($overwrite -ne "yes") {
        Write-Host "❌ Setup cancelled." -ForegroundColor Red
        exit
    }
}

Write-Host "📝 Creating .env file..." -ForegroundColor Green
Write-Host ""
Write-Host "To run CineFindr, you need a TMDB API key (free):" -ForegroundColor Yellow
Write-Host "1. Sign up at: https://www.themoviedb.org/signup" -ForegroundColor White
Write-Host "2. Go to: Settings → API" -ForegroundColor White
Write-Host "3. Request an API key (choose Developer option)" -ForegroundColor White
Write-Host ""

$apiKey = Read-Host "Enter your TMDB API key (or press Enter to add it later)"

if ([string]::IsNullOrWhiteSpace($apiKey)) {
    $apiKey = "YOUR_TMDB_API_KEY_HERE_PLEASE_REPLACE"
    Write-Host "⚠️  Remember to add your TMDB API key to .env before running!" -ForegroundColor Yellow
}

# Create .env file
$envContent = @"
# =============================================================================
# TMDB API (REQUIRED)
# =============================================================================
TMDB_API_KEY=$apiKey
TMDB_BASE_URL=https://api.themoviedb.org/3

# =============================================================================
# JustWatch Partner (OPTIONAL)
# =============================================================================
JUSTWATCH_ENABLED=false
JUSTWATCH_PARTNER_KEY=
JUSTWATCH_BASE_URL=https://apis.justwatch.com/content

# =============================================================================
# Database Configuration
# =============================================================================
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
NEXTAUTH_SECRET=development_secret_change_in_production_min_32_chars
NEXTAUTH_URL=http://localhost:3000

# =============================================================================
# Google OAuth (OPTIONAL)
# =============================================================================
GOOGLE_CLIENT_ID=
GOOGLE_CLIENT_SECRET=

# =============================================================================
# Recommendation Engine Configuration
# =============================================================================
RECO_CONTENT_WEIGHT=0.6
RECO_COLLAB_WEIGHT=0.4
DEFAULT_REGION=US

# =============================================================================
# Embedding Model
# =============================================================================
EMBEDDING_MODEL=all-MiniLM-L6-v2
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
# Cache TTL (seconds)
# =============================================================================
CACHE_TTL_SEARCH=3600
CACHE_TTL_TITLE=7200
CACHE_TTL_PROVIDERS=86400
"@

Set-Content -Path ".env" -Value $envContent

Write-Host ""
Write-Host "✅ .env file created successfully!" -ForegroundColor Green
Write-Host ""
Write-Host "Next steps:" -ForegroundColor Cyan
Write-Host "1. Start Docker services: npm run docker:up" -ForegroundColor White
Write-Host "2. Wait 10 seconds for services to be ready" -ForegroundColor White
Write-Host "3. Run setup: npm run setup" -ForegroundColor White
Write-Host "4. Start development: npm run dev" -ForegroundColor White
Write-Host "5. Open browser: http://localhost:3000" -ForegroundColor White
Write-Host ""

