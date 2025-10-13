# Quick Setup for Windows (Without Docker)

## Current Situation

✅ Node.js v22.14.0 installed  
✅ npm 10.9.2 installed  
✅ Project dependencies installed  
❌ Docker Desktop not installed  

## What You Need to Run the Full Project

Since Docker is not installed, you have **two options**:

---

## OPTION 1: Install Docker Desktop (Recommended)

### This gives you the complete experience with database and caching.

1. **Download Docker Desktop for Windows:**
   - Go to: https://www.docker.com/products/docker-desktop
   - Download and install Docker Desktop
   - Restart your computer if prompted

2. **Create `.env` file:**
   - Copy the contents from `ENV_TEMPLATE.md`
   - Save as `.env` in the project root
   - Replace `YOUR_TMDB_API_KEY_HERE` with your actual TMDB API key
     - Get one free at: https://www.themoviedb.org/settings/api

3. **Run the project:**
   ```powershell
   npm run docker:up
   # Wait 10 seconds for services to start
   npm run setup
   npm run dev
   ```

4. **Access the app:**
   - Frontend: http://localhost:3000
   - API: http://localhost:3001

---

## OPTION 2: Run Frontend Only (Demo Mode)

### This lets you explore the UI without a backend.

Since the backend requires PostgreSQL and Redis, you can run just the frontend to see the UI:

1. **Get a TMDB API Key:**
   - Sign up free at: https://www.themoviedb.org/signup
   - Go to Settings → API
   - Request an API key (Developer option)
   - Copy your API key

2. **Create `.env` file manually:**
   
   In the project root (D:\Movie-Recommender), create a file named `.env` with this content:

   ```env
   TMDB_API_KEY=your_actual_tmdb_api_key_here
   NEXTAUTH_SECRET=development_secret_for_demo_purposes_only
   NEXTAUTH_URL=http://localhost:3000
   NEXT_PUBLIC_API_URL=http://localhost:3001
   DATABASE_URL=postgresql://user:pass@localhost:5432/db
   ```

3. **Install PostgreSQL and Redis locally (if you want the full backend):**
   
   **PostgreSQL:**
   - Download from: https://www.postgresql.org/download/windows/
   - Install with default settings
   - Remember your password
   
   **Redis:**
   - Download from: https://github.com/tporadowski/redis/releases
   - Install Redis for Windows
   - Start Redis service

4. **Run the project:**
   ```powershell
   # If you have PostgreSQL + Redis installed:
   cd apps/api
   npx prisma generate
   npx prisma migrate deploy
   npm run start:dev
   
   # In a new terminal:
   cd apps/web
   npm run dev
   ```

---

## Easiest Path: Install Docker Desktop

The **easiest and recommended way** is to install Docker Desktop. It takes 5 minutes and you'll have everything working.

### After Installing Docker:

```powershell
# 1. Create .env file (copy from ENV_TEMPLATE.md)
# 2. Add your TMDB API key to .env
# 3. Run:
npm run docker:up
Start-Sleep -Seconds 10
npm run setup
npm run dev
```

Then visit: http://localhost:3000

---

## Current Status

I've installed all npm dependencies (1143 packages). 

**Next steps are up to you:**
- Install Docker Desktop for full experience (recommended)
- OR install PostgreSQL + Redis manually
- OR just explore the code

Would you like me to help with any of these options?


