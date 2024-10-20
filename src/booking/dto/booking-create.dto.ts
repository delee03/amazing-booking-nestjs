import { ApiProperty } from '@nestjs/swagger';
import {
  IsDateString,
  IsNumber,
  IsString,
  IsEnum,
  IsBoolean,
} from 'class-validator';
import { PaymentMethod } from '@prisma/client'; // Import enum từ Prisma

export class CreateBookingDto {
  @ApiProperty({ description: 'Check-in date' })
  @IsDateString()
  checkIn: Date;

  @ApiProperty({ description: 'Check-out date' })
  @IsDateString()
  checkOut: Date;

  @ApiProperty({ description: 'Total price of the booking' })
  @IsNumber()
  totalPrice: number;

  @ApiProperty({ description: 'User ID who makes the booking' })
  @IsString()
  userId: string;

  @ApiProperty({ description: 'Room ID for the booking' })
  @IsString()
  roomId: string;

  @ApiProperty({ description: 'Number of guests' }) // Thêm trường guest
  @IsNumber()
  guests: number;

  @ApiProperty({ description: 'Payment method', enum: PaymentMethod })
  @IsEnum(PaymentMethod) // Sử dụng enum đúng từ Prisma
  paymentMethod: PaymentMethod;

  @ApiProperty({ description: 'Payment status' })
  @IsBoolean()
  paymentStatus: boolean;
}
