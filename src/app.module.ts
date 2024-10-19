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
@Module({
  imports: [
    UserModule,
    LocationModule,
    RoomModule,
    RoomImageModule,
    AuthModule,
    // MulterModule.register({
    //   dest: './uploads', // Thư mục tạm trước khi upload lên DigitalOcean
    // }),
  ],
  controllers: [AppController],
  providers: [PrismaService, AppService],
  exports: [PrismaService],
})
export class AppModule {}
