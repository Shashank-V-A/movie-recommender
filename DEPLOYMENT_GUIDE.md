# 🚀 CineFindr Deployment Guide

This guide will help you deploy CineFindr to showcase in your portfolio.

## 📋 Prerequisites

- GitHub account
- Vercel account (free)
- Railway account (free)
- TMDB API key (already have: `7446f3fa2b86026e6757c1d4205740dd`)

## 🎯 Deployment Steps

### Step 1: Deploy Backend (Railway)

1. **Push to GitHub**:
   ```bash
   git add .
   git commit -m "Ready for deployment"
   git push origin main
   ```

2. **Connect to Railway**:
   - Go to [Railway.app](https://railway.app)
   - Sign up with GitHub
   - Click "New Project" → "Deploy from GitHub repo"
   - Select your CineFindr repository
   - Choose "Deploy Now"

3. **Configure Backend**:
   - Railway will detect the `apps/api` directory
   - Set these environment variables:
     ```
     TMDB_API_KEY=7446f3fa2b86026e6757c1d4205740dd
     NODE_ENV=production
     PORT=3001
     ```

4. **Add Database & Redis**:
   - In Railway dashboard, click "New" → "Database" → "Add PostgreSQL"
   - Click "New" → "Database" → "Add Redis"
   - Railway will auto-generate connection URLs

5. **Update Environment Variables**:
   - Copy the PostgreSQL URL to `DATABASE_URL`
   - Copy the Redis URL to `REDIS_URL`

### Step 2: Deploy Frontend (Vercel)

1. **Connect to Vercel**:
   - Go to [Vercel.com](https://vercel.com)
   - Sign up with GitHub
   - Click "New Project"
   - Import your CineFindr repository

2. **Configure Frontend**:
   - Set Root Directory to `apps/web`
   - Add environment variables:
     ```
     NEXT_PUBLIC_API_URL=https://your-railway-app.railway.app
     ```

3. **Deploy**:
   - Click "Deploy"
   - Vercel will build and deploy automatically

### Step 3: Database Setup

1. **Run Migrations**:
   - Connect to your Railway PostgreSQL
   - Run: `npx prisma migrate deploy`
   - Run: `npx prisma db seed`

2. **Seed Data**:
   - Run the extended seed script to populate movies
   - This will add 300+ movies and TV shows

## 🌐 Live Demo URLs

After deployment, you'll have:
- **Frontend**: `https://your-app.vercel.app`
- **Backend API**: `https://your-app.railway.app`
- **Database**: Managed by Railway
- **Redis**: Managed by Railway

## 📱 Portfolio Integration

Add this to your portfolio:

### Project Card
```html
<div class="project-card">
  <h3>CineFindr - AI Movie Recommender</h3>
  <p>Full-stack movie recommendation engine with multilingual support</p>
  <div class="tech-stack">
    <span>Next.js</span>
    <span>NestJS</span>
    <span>PostgreSQL</span>
    <span>Redis</span>
    <span>TypeScript</span>
  </div>
  <a href="https://your-app.vercel.app" target="_blank">Live Demo</a>
  <a href="https://github.com/yourusername/cinefindr" target="_blank">GitHub</a>
</div>
```

### Features to Highlight
- ✅ AI-powered movie recommendations
- ✅ Multilingual support (EN, HI, ES, FR)
- ✅ Real-time streaming provider integration
- ✅ Responsive design with dark/light themes
- ✅ Advanced search and filtering
- ✅ User preferences and saved movies
- ✅ 300+ movies and TV shows

## 🔧 Troubleshooting

### Common Issues:

1. **Build Failures**:
   - Check environment variables are set
   - Ensure all dependencies are in package.json

2. **Database Connection**:
   - Verify DATABASE_URL format
   - Check Railway service is running

3. **API Errors**:
   - Confirm TMDB_API_KEY is valid
   - Check CORS settings

## 💰 Cost Breakdown

- **Vercel**: Free tier (100GB bandwidth)
- **Railway**: Free tier ($5 credit monthly)
- **Total**: $0/month (within free limits)

## 🎯 Next Steps

1. Deploy following the steps above
2. Test all features work correctly
3. Add to your portfolio
4. Share the live demo link!

---

**Need help?** Check the troubleshooting section or create an issue in the repository.
