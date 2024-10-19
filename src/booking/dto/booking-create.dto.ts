import { ApiProperty } from '@nestjs/swagger';
import { IsDateString, IsNumber, IsString } from 'class-validator';

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
}
