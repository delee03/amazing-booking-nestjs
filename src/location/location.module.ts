import { Module } from '@nestjs/common';
import { LocationService } from './location.service';
import { LocationController } from './location.controller';
import { PrismaService } from '../Prisma/prisma.service';

@Module({
  imports: [],
  providers: [LocationService, PrismaService],
  controllers: [LocationController],
  // providers: [LocationService, ], // Đảm bảo PrismaService có mặt ở đây
})
export class LocationModule {}
