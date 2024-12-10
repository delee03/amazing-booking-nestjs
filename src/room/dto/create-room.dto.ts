import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsNumber, IsOptional, IsBoolean } from 'class-validator';

export class CreateRoomDto {
  @ApiProperty({ description: 'Name of the room' })
  @IsString({ message: 'Trường name phải là String' })
  name: string;

  @ApiProperty({ description: 'Description of the room', required: false })
  @IsOptional()
  @IsString()
  description?: string;

  @ApiProperty({ description: 'Number of rooms' })
  @IsNumber()
  soLuong: number;

  @ApiProperty({ description: 'Number of guests' })
  @IsNumber()
  soKhach: number;

  @ApiProperty({ description: 'Amenities of the room' })
  @IsString()
  tienNghi: string;

  @ApiProperty({ description: 'Price of the room' })
  @IsNumber()
  price: number;

  @ApiProperty({ description: 'Avatar URL of the room', required: false })
  @IsOptional()
  @IsString()
  avatar?: string;

  @ApiProperty({ description: 'Room type' })
  @IsString()
  type: string;

  @ApiProperty({ description: 'Room status' })
  @IsBoolean()
  status: boolean; // Đổi từ string -> boolean

  @ApiProperty({ description: 'Address of homestay' })
  @IsString()
  address: string;

  @ApiProperty({ description: 'Longitude of the homestay/hotel' })
  @IsString()
  longitude: string; // Đổi longtitude -> longitude (đúng chính tả)

  @ApiProperty({ description: 'Latitude of the homestay/hotel' })
  @IsString()
  latitude: string;

  @ApiProperty({ description: 'Location ID of the room' })
  @IsString()
  locationId: string;
}
