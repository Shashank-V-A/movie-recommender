# 🎬 CineFindr - AI-Powered Movie Recommendation Engine

A full-stack, multilingual movie and TV series recommendation platform built with modern web technologies.

## ✨ Features

- 🎯 **AI-Powered Recommendations** - Hybrid content-based and collaborative filtering
- 🌍 **Multilingual Support** - English, Hindi, Spanish, and French
- 🔍 **Advanced Search & Filtering** - By genre, year, rating, and more
- 💾 **Save Functionality** - Save your favorite movies and shows
- 🎥 **Streaming Integration** - Direct links to Netflix, Prime Video, Disney+, and more
- 📱 **Responsive Design** - Works perfectly on desktop and mobile
- 🌙 **Dark/Light Themes** - User preference support

## 🚀 Live Demo

[![Deploy on Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https://github.com/Shashank-V-A/movie-recommender)

**Frontend**: [https://cinefindr.vercel.app](https://cinefindr.vercel.app)  
**Backend API**: [https://cinefindr-api.railway.app](https://cinefindr-api.railway.app)

## 🛠 Tech Stack

### Frontend
- **Next.js 14** - React framework with App Router
- **TypeScript** - Type-safe development
- **Tailwind CSS** - Utility-first styling
- **shadcn/ui** - Modern UI components
- **i18next** - Internationalization
- **React Query** - Data fetching and caching

### Backend
- **NestJS** - Node.js framework
- **TypeScript** - Type-safe API development
- **PostgreSQL** - Primary database
- **Prisma ORM** - Database toolkit
- **Redis** - Caching layer
- **pgvector** - Vector similarity search

### External APIs
- **TMDB API** - Movie and TV show metadata
- **JustWatch API** - Streaming provider information

## 🏗 Architecture

```
┌─────────────────┐    ┌─────────────────┐    ┌─────────────────┐
│   Next.js App   │    │   NestJS API    │    │   PostgreSQL    │
│   (Frontend)    │◄──►│   (Backend)     │◄──►│   (Database)    │
│                 │    │                 │    │                 │
│ • React Query   │    │ • Prisma ORM    │    │ • Vector Search │
│ • i18next       │    │ • Redis Cache   │    │ • Full-text     │
│ • Tailwind CSS  │    │ • TMDB API      │    │ • Relationships │
└─────────────────┘    └─────────────────┘    └─────────────────┘
```

## 📦 Quick Start

### Prerequisites
- Node.js 18+
- PostgreSQL 14+
- Redis 6+

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/Shashank-V-A/movie-recommender.git
   cd movie-recommender
   ```

2. **Install dependencies**
   ```bash
   npm install
   cd apps/api && npm install
   cd ../web && npm install
   ```

3. **Environment Setup**
   ```bash
   # Copy environment template
   cp .env.example .env
   
   # Add your TMDB API key
   echo "TMDB_API_KEY=your_tmdb_api_key" >> .env
   ```

4. **Database Setup**
   ```bash
   cd apps/api
   npx prisma migrate deploy
   npx ts-node scripts/seed-extended.ts
   ```

5. **Start Development**
   ```bash
   # Terminal 1: Start API
   cd apps/api && npm run start:dev
   
   # Terminal 2: Start Frontend
   cd apps/web && npm run dev
   ```

## 🌐 Deployment

### Railway (Backend)
[![Deploy on Railway](https://railway.app/button.svg)](https://railway.app/template/deploy)

1. Connect your GitHub repository
2. Set root directory to `apps/api`
3. Add PostgreSQL and Redis services
4. Set environment variables:
   - `TMDB_API_KEY`
   - `DATABASE_URL` (auto-provided)
   - `REDIS_URL` (auto-provided)

### Vercel (Frontend)
[![Deploy on Vercel](https://vercel.com/button)](https://vercel.com/new/clone)

1. Import from GitHub
2. Set root directory to `apps/web`
3. Add environment variable:
   - `NEXT_PUBLIC_API_URL` (your Railway API URL)

## 📁 Project Structure

```
movie-recommender/
├── apps/
│   ├── api/                 # NestJS Backend
│   │   ├── src/
│   │   │   ├── titles/      # Movie/TV endpoints
│   │   │   ├── search/      # Search functionality
│   │   │   ├── recommendations/ # AI recommendations
│   │   │   ├── genres/      # Genre management
│   │   │   └── ...
│   │   ├── prisma/          # Database schema
│   │   └── scripts/         # Seeding scripts
│   └── web/                 # Next.js Frontend
│       ├── src/
│       │   ├── app/         # App Router pages
│       │   ├── components/  # React components
│       │   └── lib/         # Utilities
│       └── public/          # Static assets
├── docker-compose.yml       # Local development
└── README.md
```

## 🎯 Key Features Implementation

### AI Recommendations
- **Content-based filtering** using sentence-transformers embeddings
- **Collaborative filtering** based on user interactions
- **Hybrid approach** combining both methods for better results

### Multilingual Support
- **Dynamic language switching** with persistence
- **Localized content** from TMDB API
- **UI translations** for multiple languages

### Streaming Integration
- **Direct provider links** to Netflix, Prime Video, Disney+, etc.
- **Regional availability** detection
- **Provider logos** and metadata

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 👨‍💻 Author

**Shashank V A**
- GitHub: [@Shashank-V-A](https://github.com/Shashank-V-A)
- Portfolio: [Your Portfolio URL]

## 🙏 Acknowledgments

- [TMDB](https://www.themoviedb.org/) for movie/TV metadata
- [JustWatch](https://www.justwatch.com/) for streaming provider data
- [Vercel](https://vercel.com/) for frontend hosting
- [Railway](https://railway.app/) for backend hosting

---

⭐ **Star this repository if you found it helpful!**