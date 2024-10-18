import { Module } from '@nestjs/common';
import { RoomImageController } from './room-image.controller';
import { RoomImageService } from './room-image.service';
import { PrismaService } from 'src/Prisma/prisma.service';

@Module({
  imports: [],
  controllers: [RoomImageController],
  providers: [RoomImageService, PrismaService],
})
export class RoomImageModule {}
