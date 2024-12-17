import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UserModule } from './user/user.module';
import { PrismaService } from './Prisma/prisma.service';

import { LocationModule } from './location/location.module';
import { RoomModule } from './room/room.module';
import { RoomImageModule } from './room-image/room-image.module';
import { MulterModule } from '@nestjs/platform-express';
import { AuthModule } from './auth/auth.module';
import { BookingModule } from './booking/booking.module';
import { RatingModule } from './rating/rating.module';
import { ConfigModule } from '@nestjs/config';
import { HealthController } from './health.controller';
@Module({
  imports: [
    UserModule,
    LocationModule,
    RoomModule,
    RoomImageModule,
    AuthModule,
    BookingModule,
    RatingModule,
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    // Để ConfigModule sử dụng được ở mọi nơi trong ứng dụng
    // MulterModule.register({
    //   dest: './uploads', // Thư mục tạm trước khi upload lên DigitalOcean
    // }),
  ],
  controllers: [AppController, HealthController],
  providers: [PrismaService, AppService],
  exports: [PrismaService],
})
export class AppModule {}
