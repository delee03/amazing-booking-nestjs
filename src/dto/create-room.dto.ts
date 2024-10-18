import { ApiProperty } from '@nestjs/swagger';

export class CreateRoomDto {
  @ApiProperty({ description: 'Room name' })
  name: string;

  @ApiProperty({ description: 'Room description (optional)', required: false })
  description?: string;

  @ApiProperty({ description: 'Number of rooms available' })
  soLuong: number;

  @ApiProperty({ description: 'Maximum number of guests' })
  soKhach: number;

  @ApiProperty({ description: 'Room amenities' })
  tienNghi: string;

  @ApiProperty({ description: 'Room price per night' })
  price: number;

  @ApiProperty({ description: 'Location ID', required: true })
  locationId: string;
}
