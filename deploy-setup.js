#!/usr/bin/env node

/**
 * CineFindr Deployment Setup Script
 * This script helps set up the project for deployment
 */

const fs = require('fs');
const path = require('path');

console.log('🚀 Setting up CineFindr for deployment...\n');

// Check if we're in the right directory
if (!fs.existsSync('package.json')) {
  console.error('❌ Please run this script from the project root directory');
  process.exit(1);
}

// Create production package.json for API
const apiPackageJson = {
  "name": "@cinefindr/api",
  "version": "1.0.0",
  "description": "CineFindr Backend API",
  "main": "dist/main.js",
  "scripts": {
    "build": "nest build",
    "start": "node dist/main",
    "start:prod": "node dist/main",
    "start:dev": "nest start --watch",
    "start:debug": "nest start --debug --watch",
    "lint": "eslint \"{src,apps,libs,test}/**/*.ts\" --fix",
    "test": "jest",
    "test:watch": "jest --watch",
    "test:cov": "jest --coverage",
    "test:debug": "node --inspect-brk -r tsconfig-paths/register -r ts-node/register node_modules/.bin/jest --runInBand",
    "db:pgvector": "node scripts/setup-pgvector.js",
    "seed": "ts-node scripts/seed.ts",
    "seed:extended": "ts-node scripts/seed-extended.ts",
    "embed": "ts-node scripts/embed-titles.ts",
    "reco": "ts-node scripts/compute-recommendations.ts"
  },
  "dependencies": {
    "@nestjs/common": "^10.3.0",
    "@nestjs/core": "^10.3.0",
    "@nestjs/platform-express": "^10.3.0",
    "@nestjs/config": "^3.1.1",
    "@nestjs/axios": "^3.0.1",
    "@prisma/client": "^5.8.0",
    "axios": "^1.6.5",
    "bcrypt": "^5.1.1",
    "class-transformer": "^0.5.1",
    "class-validator": "^0.14.1",
    "ioredis": "^5.3.2",
    "reflect-metadata": "^0.2.1",
    "rxjs": "^7.8.1",
    "@xenova/transformers": "^2.10.0"
  },
  "devDependencies": {
    "@nestjs/cli": "^10.2.1",
    "@nestjs/schematics": "^10.0.3",
    "@nestjs/testing": "^10.3.0",
    "@types/bcrypt": "^5.0.2",
    "@types/express": "^4.17.21",
    "@types/jest": "^29.5.11",
    "@types/node": "^20.10.6",
    "@typescript-eslint/eslint-plugin": "^6.18.0",
    "@typescript-eslint/parser": "^6.18.0",
    "eslint": "^8.56.0",
    "jest": "^29.7.0",
    "prisma": "^5.8.0",
    "source-map-support": "^0.5.21",
    "ts-jest": "^29.1.1",
    "ts-loader": "^9.5.1",
    "ts-node": "^10.9.2",
    "tsconfig-paths": "^4.2.0",
    "typescript": "^5.3.3"
  },
  "engines": {
    "node": ">=18.0.0"
  }
};

// Create production package.json for Web
const webPackageJson = {
  "name": "@cinefindr/web",
  "version": "1.0.0",
  "description": "CineFindr Frontend",
  "private": true,
  "scripts": {
    "dev": "next dev",
    "build": "next build",
    "start": "next start",
    "lint": "next lint",
    "test": "vitest",
    "test:ui": "vitest --ui",
    "test:e2e": "playwright test"
  },
  "dependencies": {
    "@tanstack/react-query": "^5.17.0",
    "@tanstack/react-query-devtools": "^5.17.0",
    "class-variance-authority": "^0.7.0",
    "clsx": "^2.1.0",
    "i18next": "^23.7.16",
    "i18next-browser-languagedetector": "^7.2.0",
    "lucide-react": "^0.312.0",
    "next": "14.1.0",
    "next-auth": "^4.24.5",
    "react": "^18.2.0",
    "react-dom": "^18.2.0",
    "react-i18next": "^14.0.0",
    "swr": "^2.2.4",
    "tailwind-merge": "^2.2.0",
    "tailwindcss-animate": "^1.0.7"
  },
  "devDependencies": {
    "@playwright/test": "^1.41.0",
    "@types/node": "^20.11.16",
    "@types/react": "^18.2.55",
    "@types/react-dom": "^18.2.19",
    "@vitejs/plugin-react": "^4.2.1",
    "autoprefixer": "^10.4.17",
    "eslint": "^8.56.0",
    "eslint-config-next": "14.1.0",
    "jsdom": "^24.0.0",
    "postcss": "^8.4.33",
    "tailwindcss": "^3.4.1",
    "typescript": "^5.3.3",
    "vitest": "^1.2.0"
  },
  "engines": {
    "node": ">=18.0.0"
  }
};

// Write package.json files
fs.writeFileSync(
  path.join('apps', 'api', 'package.json'),
  JSON.stringify(apiPackageJson, null, 2)
);

fs.writeFileSync(
  path.join('apps', 'web', 'package.json'),
  JSON.stringify(webPackageJson, null, 2)
);

console.log('✅ Created production package.json files');

// Create Railway configuration
const railwayConfig = {
  "$schema": "https://railway.app/railway.schema.json",
  "build": {
    "builder": "NIXPACKS",
    "buildCommand": "npm install && npm run build"
  },
  "deploy": {
    "startCommand": "npm run start:prod",
    "healthcheckPath": "/health",
    "healthcheckTimeout": 300,
    "restartPolicy": {
      "maxRetries": 10
    }
  }
};

fs.writeFileSync(
  path.join('apps', 'api', 'railway.json'),
  JSON.stringify(railwayConfig, null, 2)
);

console.log('✅ Created Railway configuration');

// Create Vercel configuration
const vercelConfig = {
  "buildCommand": "npm run build",
  "outputDirectory": "dist",
  "installCommand": "npm install",
  "framework": "nextjs",
  "functions": {
    "apps/web/src/app/api/**/*.ts": {
      "runtime": "nodejs18.x"
    }
  }
};

fs.writeFileSync(
  path.join('apps', 'web', 'vercel.json'),
  JSON.stringify(vercelConfig, null, 2)
);

console.log('✅ Created Vercel configuration');

console.log('\n🎉 Deployment setup complete!');
console.log('\n📋 Next steps:');
console.log('1. Push your code to GitHub');
console.log('2. Follow the DEPLOYMENT_GUIDE.md instructions');
console.log('3. Deploy backend to Railway');
console.log('4. Deploy frontend to Vercel');
console.log('5. Set up environment variables');
console.log('6. Run database migrations and seeding');
console.log('\n🚀 Your CineFindr will be live for your portfolio!');
