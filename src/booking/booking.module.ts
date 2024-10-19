import { Module } from '@nestjs/common';
import { BookingService } from './booking.service';
import { BookingController } from './booking.controller';
import { PrismaService } from 'src/Prisma/prisma.service';

@Module({
  imports: [],
  providers: [BookingService, PrismaService],
  controllers: [BookingController],
})
export class BookingModule {}
