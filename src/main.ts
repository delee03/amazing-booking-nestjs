import { NestFactory, Reflector } from '@nestjs/core';
import { AppModule } from './app.module';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import * as dotenv from 'dotenv';
import * as express from 'express';
import { Request, Response, NextFunction } from 'express';
import { ValidationPipe } from '@nestjs/common';
import { JwtAuthGuard } from './auth/guards/local.guard';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  dotenv.config(); // Đọc file .env

  app.enableCors({
    origin: '*',
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
    credentials: true,
  });

  const reflector = app.get(Reflector);
  console.log({ reflector });
  app.useGlobalGuards(new JwtAuthGuard(reflector)); // Sử dụng guard JwtAuthGuard ở mức toàn cục

  app.useGlobalPipes(
    new ValidationPipe({
      stopAtFirstError: true, // Stop at first error
      whitelist: true, // Remove non-whitelisted properties in request
    }),
  ); // Sử dụng class ValidationPipe để kiểm tra dữ liệu gửi lên từ client

  // Thêm các header liên quan đến Cross-Origin-Opener-Policy và Cross-Origin-Embedder-Policy
  app.use((req: Request, res: Response, next: () => void) => {
    res.setHeader('Cross-Origin-Opener-Policy', 'same-origin');
    res.setHeader('Cross-Origin-Embedder-Policy', 'require-corp');
    next();
  });

  // Cấu hình Swagger
  const config = new DocumentBuilder()
    .setTitle('Homestay/Apartment Booking API')
    .setDescription('API for Homestay Booking System')
    .setVersion('1.1')
    .addBearerAuth(
      {
        type: 'http',
        scheme: 'bearer',
        bearerFormat: 'JWT',
      },
      'Bearer',
    ) // Thêm Bearer Token Authorization vào Swagger
    .build();

  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api', app, document); // Đường dẫn để truy cập Swagger: /api

  await app.listen(process.env.PORT ?? 3000);
}
bootstrap();
