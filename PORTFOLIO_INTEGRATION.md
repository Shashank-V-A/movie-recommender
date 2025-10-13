# 🎯 Portfolio Integration Guide

## Quick Start - Deploy to Portfolio

### 🚀 **Step 1: Deploy Backend (Railway) - 5 minutes**

1. **Go to [Railway.app](https://railway.app)**
2. **Sign up with GitHub**
3. **Click "New Project" → "Deploy from GitHub repo"**
4. **Select your repository**
5. **Set root directory to `apps/api`**
6. **Add services:**
   - PostgreSQL database
   - Redis cache
7. **Set environment variables:**
   ```
   DATABASE_URL=postgresql://... (auto-generated)
   REDIS_URL=redis://... (auto-generated)
   TMDB_API_KEY=7446f3fa2b86026e6757c1d4205740dd
   NEXTAUTH_SECRET=your-secret-32-chars-minimum
   ```
8. **Deploy!** Your API will be at `https://your-api.railway.app`

### 🌐 **Step 2: Deploy Frontend (Vercel) - 3 minutes**

1. **Go to [Vercel.com](https://vercel.com)**
2. **Import your GitHub repository**
3. **Set root directory to `apps/web`**
4. **Set environment variables:**
   ```
   NEXTAUTH_SECRET=your-secret-32-chars-minimum
   NEXTAUTH_URL=https://your-app.vercel.app
   NEXT_PUBLIC_API_URL=https://your-api.railway.app
   ```
5. **Deploy!** Your app will be at `https://your-app.vercel.app`

---

## 📋 **Portfolio Website Integration**

### **Project Card HTML**
```html
<div class="project-card">
  <div class="project-image">
    <img src="cinefindr-preview.jpg" alt="CineFindr Preview" />
    <div class="project-overlay">
      <a href="https://your-app.vercel.app" target="_blank" class="demo-btn">
        🚀 Live Demo
      </a>
      <a href="https://github.com/yourusername/movie-recommender" target="_blank" class="code-btn">
        💻 View Code
      </a>
    </div>
  </div>
  
  <div class="project-content">
    <h3>CineFindr - AI Movie Recommender</h3>
    <p>
      Full-stack movie recommendation engine with AI-powered suggestions, 
      real-time search, and streaming provider integration. Built with 
      Next.js 14, NestJS, PostgreSQL, and Redis.
    </p>
    
    <div class="tech-stack">
      <span class="tech-badge">Next.js 14</span>
      <span class="tech-badge">NestJS</span>
      <span class="tech-badge">PostgreSQL</span>
      <span class="tech-badge">Prisma ORM</span>
      <span class="tech-badge">Redis</span>
      <span class="tech-badge">TypeScript</span>
      <span class="tech-badge">Tailwind CSS</span>
      <span class="tech-badge">TMDB API</span>
    </div>
    
    <div class="project-features">
      <h4>Key Features:</h4>
      <ul>
        <li>🤖 AI-powered movie recommendations</li>
        <li>🔍 Real-time search with filters</li>
        <li>🌍 Multi-language support</li>
        <li>📱 Responsive design</li>
        <li>💾 User watchlists & preferences</li>
        <li>🎬 Streaming provider integration</li>
        <li>⚡ Redis caching for performance</li>
        <li>🔐 NextAuth authentication</li>
      </ul>
    </div>
  </div>
</div>
```

### **CSS Styles**
```css
.project-card {
  background: white;
  border-radius: 12px;
  box-shadow: 0 4px 20px rgba(0,0,0,0.1);
  overflow: hidden;
  transition: transform 0.3s ease, box-shadow 0.3s ease;
}

.project-card:hover {
  transform: translateY(-5px);
  box-shadow: 0 8px 30px rgba(0,0,0,0.15);
}

.project-image {
  position: relative;
  height: 300px;
  overflow: hidden;
}

.project-image img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.project-overlay {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0,0,0,0.8);
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 15px;
  opacity: 0;
  transition: opacity 0.3s ease;
}

.project-card:hover .project-overlay {
  opacity: 1;
}

.demo-btn, .code-btn {
  padding: 12px 24px;
  border-radius: 6px;
  text-decoration: none;
  font-weight: 600;
  transition: all 0.3s ease;
}

.demo-btn {
  background: #0070f3;
  color: white;
}

.code-btn {
  background: #333;
  color: white;
}

.demo-btn:hover, .code-btn:hover {
  transform: scale(1.05);
}

.tech-badge {
  display: inline-block;
  background: #f1f3f4;
  color: #333;
  padding: 4px 12px;
  border-radius: 20px;
  font-size: 12px;
  font-weight: 500;
  margin: 2px;
}

.project-features ul {
  list-style: none;
  padding: 0;
}

.project-features li {
  padding: 4px 0;
  font-size: 14px;
}
```

---

## 🎨 **Screenshots for Portfolio**

### **Create These Screenshots:**
1. **Homepage** - Hero section with trending movies
2. **Search Results** - Filtered movie results
3. **Movie Detail** - Full movie page with streaming links
4. **Saved Movies** - User's watchlist
5. **Mobile View** - Responsive design showcase

### **Screenshot Tips:**
- Use high-resolution screenshots (1920x1080)
- Show different states (loading, empty, populated)
- Include mobile views
- Capture the AI recommendations in action

---

## 📊 **Portfolio Description Examples**

### **Short Version (1-2 sentences)**
> "CineFindr is a full-stack movie recommendation engine that uses AI to suggest personalized movies and TV shows. Built with Next.js 14, NestJS, PostgreSQL, and Redis, featuring real-time search, streaming provider integration, and multilingual support."

### **Medium Version (1 paragraph)**
> "CineFindr is a sophisticated movie recommendation platform that combines content-based and collaborative filtering to deliver personalized movie suggestions. The application features a modern Next.js 14 frontend with server-side rendering, a robust NestJS backend API, and PostgreSQL database with Redis caching for optimal performance. Users can search through thousands of movies, save favorites to watchlists, and get AI-powered recommendations based on their preferences. The app integrates with TMDB API for movie data and provides direct links to streaming platforms like Netflix, Prime Video, and Disney+."

### **Detailed Version (Full description)**
> "CineFindr is a comprehensive movie recommendation engine that demonstrates advanced full-stack development skills. The platform uses a hybrid recommendation system combining content-based filtering with sentence-transformers embeddings and collaborative filtering based on user interactions.

**Technical Architecture:**
- **Frontend:** Next.js 14 with App Router, TypeScript, Tailwind CSS, and shadcn/ui components
- **Backend:** NestJS with TypeScript, RESTful API design, and modular architecture
- **Database:** PostgreSQL with Prisma ORM and pgvector extension for vector similarity search
- **Caching:** Redis for API response caching and session management
- **Authentication:** NextAuth.js with multiple providers (Google, Email/Password)
- **External APIs:** TMDB API for movie metadata and streaming provider information

**Key Features:**
- AI-powered movie recommendations using vector embeddings
- Real-time search with advanced filtering (genre, year, rating, streaming provider)
- Multi-language support with i18next internationalization
- User profiles with personalized preferences and watchlists
- Streaming provider integration with direct links to platforms
- Responsive design optimized for all devices
- Performance optimizations with Redis caching and image optimization

**Deployment & DevOps:**
- Containerized with Docker Compose for local development
- Deployed on Vercel (frontend) and Railway (backend, database, cache)
- CI/CD pipeline with GitHub Actions for automated testing and deployment
- Environment-based configuration for development and production

This project showcases expertise in modern web development, API design, database optimization, AI/ML integration, and cloud deployment strategies."

---

## 🔗 **Portfolio Links to Include**

1. **Live Demo:** `https://your-app.vercel.app`
2. **GitHub Repository:** `https://github.com/yourusername/movie-recommender`
3. **API Documentation:** `https://your-api.railway.app/health` (if you add docs)
4. **Case Study:** Link to detailed blog post (optional)

---

## 📱 **Social Media Integration**

### **LinkedIn Post Template**
```
🚀 Just deployed CineFindr - my latest full-stack project!

🎬 An AI-powered movie recommendation engine built with:
• Next.js 14 & NestJS
• PostgreSQL & Redis
• TMDB API integration
• Real-time search & filtering

Try it out: [your-app.vercel.app]

#FullStack #NextJS #NestJS #PostgreSQL #AI #WebDev #Portfolio
```

### **Twitter/X Post**
```
🎬 Just launched CineFindr - an AI movie recommender! 

✨ Features:
• AI-powered suggestions
• Real-time search
• Streaming provider links
• Multi-language support

Built with Next.js 14, NestJS, PostgreSQL & Redis

🔗 [your-app.vercel.app]

#WebDev #AI #NextJS #Portfolio
```

---

## 🎯 **Portfolio Positioning**

### **Why This Project Stands Out:**
1. **Full-Stack Complexity** - Shows end-to-end development skills
2. **Modern Tech Stack** - Demonstrates knowledge of current technologies
3. **AI Integration** - Shows understanding of ML/AI concepts
4. **Real-World Application** - Solves actual user problems
5. **Production Ready** - Proper deployment, caching, optimization
6. **User Experience** - Thoughtful UI/UX design

### **Skills Demonstrated:**
- Frontend Development (React, Next.js, TypeScript)
- Backend Development (Node.js, NestJS, API design)
- Database Design (PostgreSQL, Prisma ORM)
- Caching Strategies (Redis)
- Authentication & Authorization
- API Integration (TMDB API)
- AI/ML Concepts (Vector embeddings, recommendations)
- DevOps & Deployment (Docker, Vercel, Railway)
- Performance Optimization
- Responsive Design

---

## 🚀 **Ready to Deploy?**

Follow the quick start guide above, and your CineFindr will be live and ready to impress potential employers or clients! 

**Need help?** The deployment process is designed to be straightforward, but if you run into issues, the Railway and Vercel documentation is excellent, and their support communities are very helpful.

Good luck with your portfolio! 🎬✨
