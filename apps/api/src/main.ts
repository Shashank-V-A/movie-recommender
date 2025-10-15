import { NestFactory } from '@nestjs/core';
import { ValidationPipe } from '@nestjs/common';
import { AppModule } from './app.module';

async function bootstrap() {
  try {
    console.log('🚀 Starting CineFindr API...');
    
    const app = await NestFactory.create(AppModule);

    app.enableCors({
      origin: process.env.FRONTEND_URL || process.env.NEXTAUTH_URL || '*',
      credentials: true,
    });

    app.useGlobalPipes(
      new ValidationPipe({
        whitelist: true,
        transform: true,
        forbidNonWhitelisted: true,
      }),
    );

    const port = process.env.PORT || process.env.API_PORT || 3001;
    await app.listen(port);
    console.log(`🚀 CineFindr API running on port ${port}`);
    console.log(`📊 Environment: ${process.env.NODE_ENV || 'development'}`);
    console.log(`🗄️ Database: ${process.env.DATABASE_URL ? 'Connected' : 'Not configured'}`);
    console.log(`🔴 Redis: ${process.env.REDIS_URL ? 'Connected' : 'Not configured'}`);
  } catch (error) {
    console.error('❌ Failed to start CineFindr API:', error);
    process.exit(1);
  }
}

bootstrap();

