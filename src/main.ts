import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

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
