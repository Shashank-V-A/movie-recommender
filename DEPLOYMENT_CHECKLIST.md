# ✅ CineFindr Deployment Checklist

## 🚀 Quick Deployment Steps

### 1. GitHub Setup
- [ ] Push code to GitHub repository
- [ ] Ensure all files are committed
- [ ] Repository is public (for portfolio showcase)

### 2. Backend Deployment (Railway)
- [ ] Go to [Railway.app](https://railway.app)
- [ ] Sign up with GitHub
- [ ] Create new project from GitHub repo
- [ ] Select `apps/api` as root directory
- [ ] Add environment variables:
  - [ ] `TMDB_API_KEY=7446f3fa2b86026e6757c1d4205740dd`
  - [ ] `NODE_ENV=production`
  - [ ] `PORT=3001`
- [ ] Add PostgreSQL database
- [ ] Add Redis database
- [ ] Copy database URLs to environment variables:
  - [ ] `DATABASE_URL` (from PostgreSQL)
  - [ ] `REDIS_URL` (from Redis)
- [ ] Deploy backend
- [ ] Test API endpoint: `https://your-app.railway.app/health`

### 3. Frontend Deployment (Vercel)
- [ ] Go to [Vercel.com](https://vercel.com)
- [ ] Sign up with GitHub
- [ ] Import repository
- [ ] Set root directory to `apps/web`
- [ ] Add environment variables:
  - [ ] `NEXT_PUBLIC_API_URL=https://your-railway-app.railway.app`
- [ ] Deploy frontend
- [ ] Test website: `https://your-app.vercel.app`

### 4. Database Setup
- [ ] Connect to Railway PostgreSQL
- [ ] Run migrations: `npx prisma migrate deploy`
- [ ] Seed database: `npx ts-node scripts/seed-extended.ts`
- [ ] Verify data is populated

### 5. Testing
- [ ] Test homepage loads
- [ ] Test search functionality
- [ ] Test genre filtering
- [ ] Test language switching
- [ ] Test save functionality
- [ ] Test streaming links
- [ ] Test responsive design

### 6. Portfolio Integration
- [ ] Update portfolio with live demo link
- [ ] Add project description
- [ ] Include tech stack
- [ ] Add screenshots
- [ ] Update GitHub README
- [ ] Share on social media

## 🔧 Troubleshooting

### Common Issues:
1. **Build fails**: Check environment variables
2. **API errors**: Verify TMDB API key
3. **Database connection**: Check DATABASE_URL format
4. **CORS errors**: Verify FRONTEND_URL in backend

### Environment Variables Reference:
```
# Backend (Railway)
TMDB_API_KEY=7446f3fa2b86026e6757c1d4205740dd
NODE_ENV=production
PORT=3001
DATABASE_URL=postgresql://...
REDIS_URL=redis://...

# Frontend (Vercel)
NEXT_PUBLIC_API_URL=https://your-railway-app.railway.app
```

## 📱 Final URLs
- **Frontend**: `https://your-app.vercel.app`
- **Backend**: `https://your-app.railway.app`
- **GitHub**: `https://github.com/yourusername/cinefindr`

## 🎯 Success Criteria
- [ ] Website loads without errors
- [ ] All features work correctly
- [ ] Responsive design works on mobile
- [ ] Language switching works
- [ ] Movies load and display properly
- [ ] Search and filtering work
- [ ] Save functionality works
- [ ] Streaming links work

## 💰 Cost Estimate
- **Vercel**: Free (100GB bandwidth)
- **Railway**: Free ($5 monthly credit)
- **Total**: $0/month (within free limits)

---

**Need help?** Check the full DEPLOYMENT_GUIDE.md or create an issue in your repository.
