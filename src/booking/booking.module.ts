import { Module } from '@nestjs/common';
import { BookingService } from './booking.service';
import { BookingController } from './booking.controller';
import { PrismaService } from 'src/Prisma/prisma.service';
import { PaymentService } from './payment.service';
import { JwtStrategy } from 'src/auth/strategies/jwt.strategy';
import { JwtAuthGuard } from 'src/auth/guards/local.guard';

@Module({
  imports: [],
  providers: [
    BookingService,
    PrismaService,
    PaymentService,
    JwtStrategy,
    JwtAuthGuard,
  ],
  controllers: [BookingController],
})
export class BookingModule {}
