import { Module } from '@nestjs/common';
import { BookingService } from './booking.service';
import { BookingController } from './booking.controller';
import { PrismaService } from 'src/Prisma/prisma.service';
import { PaymentService } from './payment.service';

@Module({
  imports: [],
  providers: [BookingService, PrismaService, PaymentService],
  controllers: [BookingController],
})
export class BookingModule {}
