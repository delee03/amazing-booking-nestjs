import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import * as dotenv from 'dotenv';
import * as express from 'express';
import { Request, Response, NextFunction } from 'express';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  dotenv.config(); // Đọc file .env

  

  app.enableCors({
    origin: ['http://localhost:5173', 'http://localhost:5174'],
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
    credentials: true,
  });

  // Thêm các header liên quan đến Cross-Origin-Opener-Policy và Cross-Origin-Embedder-Policy
  app.use((req: Request, res: Response, next: () => void) => {
    res.setHeader('Cross-Origin-Opener-Policy', 'same-origin');
    res.setHeader('Cross-Origin-Embedder-Policy', 'require-corp');
    next();
  });

  // Cấu hình Swagger
  const config = new DocumentBuilder()
    .setTitle('Hotel Booking API')
    .setDescription('API for Hotel Booking System')
    .setVersion('1.0')
    .addTag('hotels')
    .build();

  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api', app, document); // Đường dẫn để truy cập Swagger: /api

  await app.listen(3000);
}
bootstrap();
