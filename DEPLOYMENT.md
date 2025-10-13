# 🚀 CineFindr Deployment Guide

## Portfolio Deployment Options

### Option 1: Vercel + Railway (Recommended)

#### Frontend (Vercel)
1. **Connect GitHub to Vercel**
   - Go to [vercel.com](https://vercel.com)
   - Import your GitHub repository
   - Set root directory: `apps/web`

2. **Environment Variables in Vercel**
   ```
   NEXTAUTH_SECRET=your-production-secret-min-32-chars
   NEXTAUTH_URL=https://your-app.vercel.app
   NEXT_PUBLIC_API_URL=https://your-api.railway.app
   ```

#### Backend (Railway)
1. **Deploy API to Railway**
   - Go to [railway.app](https://railway.app)
   - Connect GitHub repository
   - Set root directory: `apps/api`

2. **Add Services**
   - PostgreSQL database
   - Redis cache
   - API deployment

3. **Environment Variables in Railway**
   ```
   DATABASE_URL=postgresql://...
   REDIS_URL=redis://...
   TMDB_API_KEY=7446f3fa2b86026e6757c1d4205740dd
   NEXTAUTH_SECRET=your-production-secret-min-32-chars
   ```

### Option 2: Vercel + Supabase

#### Database Setup
1. **Create Supabase Project**
   - Go to [supabase.com](https://supabase.com)
   - Create new project
   - Get connection string

2. **Migrate Schema**
   ```bash
   # Copy Prisma schema to Supabase
   npx prisma db push
   ```

### Option 3: Netlify + PlanetScale

#### Alternative Modern Stack
- Frontend: Netlify
- Database: PlanetScale (MySQL)
- Backend: Netlify Functions

## 🎯 Portfolio Integration

### Add to Your Portfolio Website

1. **Project Card**
   ```html
   <div class="project-card">
     <h3>CineFindr - Movie Recommendation Engine</h3>
     <p>Full-stack movie recommendation app with AI-powered suggestions</p>
     <a href="https://cinefindr.vercel.app" target="_blank">Live Demo</a>
     <a href="https://github.com/yourusername/movie-recommender" target="_blank">GitHub</a>
   </div>
   ```

2. **Tech Stack Badges**
   - Next.js 14
   - NestJS
   - PostgreSQL
   - Prisma ORM
   - Redis
   - TMDB API
   - Tailwind CSS

3. **Features to Highlight**
   - AI-powered recommendations
   - Real-time search
   - Multi-language support
   - Streaming provider integration
   - User preferences & watchlists

### SEO Optimization

1. **Add Meta Tags**
   ```tsx
   // apps/web/src/app/layout.tsx
   export const metadata = {
     title: 'CineFindr - Discover Your Next Favorite Movie',
     description: 'AI-powered movie recommendation engine with personalized suggestions',
     keywords: 'movies, recommendations, AI, streaming, entertainment'
   }
   ```

2. **Open Graph Tags**
   ```tsx
   export const metadata = {
     openGraph: {
       title: 'CineFindr - Movie Recommendations',
       description: 'Discover your next favorite movie with AI',
       images: ['/og-image.jpg'],
     }
   }
   ```

## 🔧 Pre-Deployment Checklist

- [ ] Update environment variables
- [ ] Test production build locally
- [ ] Optimize images and assets
- [ ] Set up error monitoring
- [ ] Configure analytics
- [ ] Test all features
- [ ] Set up custom domain (optional)

## 📊 Performance Tips

1. **Image Optimization**
   - Use Next.js Image component
   - Implement lazy loading
   - Optimize poster images

2. **Caching Strategy**
   - Redis for API responses
   - Vercel edge caching
   - Browser caching

3. **Database Optimization**
   - Add proper indexes
   - Use connection pooling
   - Optimize queries

## 🎨 Customization for Portfolio

1. **Add Your Branding**
   - Custom logo
   - Your color scheme
   - Personal touches

2. **Add Attribution**
   - Your name in footer
   - GitHub link
   - Portfolio link

3. **Demo Data**
   - Pre-populate with popular movies
   - Showcase recommendation features
   - Add sample user profiles

## 🚨 Important Notes

- **TMDB API**: Free tier has rate limits
- **Database**: Use connection pooling for production
- **Security**: Use strong secrets in production
- **Monitoring**: Set up error tracking
- **Backup**: Regular database backups

## 📞 Support

If you need help with deployment:
1. Check Railway/Vercel documentation
2. Join their Discord communities
3. Review deployment logs
4. Test locally first

---

**Ready to deploy?** Follow the step-by-step guide above and your CineFindr will be live on the web! 🎬✨
