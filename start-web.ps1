# Start Next.js Web Server with Environment Variables

$env:NEXTAUTH_SECRET="development_secret_change_in_production_min_32_chars"
$env:NEXTAUTH_URL="http://localhost:3000"
$env:DATABASE_URL="postgresql://cinefindr:cinefindr@localhost:5432/cinefindr"
$env:NEXT_PUBLIC_API_URL="http://localhost:3001"

Write-Host "Starting Next.js web server with environment variables..." -ForegroundColor Green

cd apps\web
npm run dev

