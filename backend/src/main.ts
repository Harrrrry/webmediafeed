import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { join } from 'path';
import * as express from 'express';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.enableCors(); // Enable CORS for all origins
  // Serve /uploads as static files
  app.use('/uploads', express.static(join(__dirname, '..', '..', 'uploads')));
  await app.listen(5000);
}

bootstrap();
