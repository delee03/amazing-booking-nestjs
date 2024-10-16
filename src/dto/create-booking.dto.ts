import { ApiProperty } from '@nestjs/swagger';

export class CreateBookingDto {
  @ApiProperty({ description: 'Check-in date' })
  checkIn: Date;

  @ApiProperty({ description: 'Check-out date' })
  checkOut: Date;

  @ApiProperty({ description: 'Total price of the booking' })
  totalPrice: number;

  @ApiProperty({ description: 'User ID for the booking', required: true })
  userId: string;

  @ApiProperty({ description: 'Room ID for the booking', required: true })
  roomId: string;
}
