import { Module } from '@nestjs/common';
import { RoomController } from './room.controller';
import { RoomService } from './room.service';
import { PrismaService } from 'src/Prisma/prisma.service';

@Module({
  imports: [],
  controllers: [RoomController],
  providers: [RoomService, PrismaService],
})
export class RoomModule {}
