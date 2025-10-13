# CineFindr - Start All Services with Environment Variables

Write-Host "🎬 Starting CineFindr..." -ForegroundColor Cyan
Write-Host ""

# Set environment variables
$env:DATABASE_URL="postgresql://cinefindr:cinefindr@localhost:5432/cinefindr"
$env:REDIS_URL="redis://localhost:6379"
$env:TMDB_API_KEY="7446f3fa2b86026e6757c1d4205740dd"
$env:NEXTAUTH_SECRET="development_secret_change_in_production_min_32_chars"
$env:NEXTAUTH_URL="http://localhost:3000"
$env:NEXT_PUBLIC_API_URL="http://localhost:3001"
$env:API_PORT="3001"

Write-Host "✅ Environment variables set" -ForegroundColor Green
Write-Host "📡 Starting API server..." -ForegroundColor Yellow

# Start API server in background
$apiJob = Start-Job -ScriptBlock {
    param($dbUrl, $redisUrl, $tmdbKey, $secret)
    $env:DATABASE_URL = $dbUrl
    $env:REDIS_URL = $redisUrl
    $env:TMDB_API_KEY = $tmdbKey
    $env:NEXTAUTH_SECRET = $secret
    Set-Location "D:\Movie-Recommender\apps\api"
    npm run start:dev
} -ArgumentList $env:DATABASE_URL, $env:REDIS_URL, $env:TMDB_API_KEY, $env:NEXTAUTH_SECRET

Start-Sleep -Seconds 5

Write-Host "🌐 Starting Web server..." -ForegroundColor Yellow

# Start Web server in background
$webJob = Start-Job -ScriptBlock {
    param($dbUrl, $secret, $url, $apiUrl)
    $env:DATABASE_URL = $dbUrl
    $env:NEXTAUTH_SECRET = $secret
    $env:NEXTAUTH_URL = $url
    $env:NEXT_PUBLIC_API_URL = $apiUrl
    Set-Location "D:\Movie-Recommender\apps\web"
    npm run dev
} -ArgumentList $env:DATABASE_URL, $env:NEXTAUTH_SECRET, $env:NEXTAUTH_URL, $env:NEXT_PUBLIC_API_URL

Write-Host ""
Write-Host "⏳ Waiting for servers to start..." -ForegroundColor Yellow
Start-Sleep -Seconds 20

Write-Host ""
Write-Host "✅ CineFindr is running!" -ForegroundColor Green
Write-Host ""
Write-Host "🌐 Frontend: http://localhost:3000" -ForegroundColor Cyan
Write-Host "📡 API: http://localhost:3001" -ForegroundColor Cyan
Write-Host ""
Write-Host "Press Ctrl+C to stop all services" -ForegroundColor Yellow
Write-Host ""

# Keep script running and monitor jobs
try {
    while ($true) {
        Start-Sleep -Seconds 5
        
        # Check if jobs are still running
        if ($apiJob.State -ne 'Running') {
            Write-Host "⚠️ API server stopped" -ForegroundColor Red
        }
        if ($webJob.State -ne 'Running') {
            Write-Host "⚠️ Web server stopped" -ForegroundColor Red
        }
    }
}
finally {
    Write-Host ""
    Write-Host "🛑 Stopping services..." -ForegroundColor Yellow
    Stop-Job -Job $apiJob, $webJob
    Remove-Job -Job $apiJob, $webJob -Force
    Write-Host "✅ Services stopped" -ForegroundColor Green
}

