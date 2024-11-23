import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsNumber, IsOptional } from 'class-validator';

export class CreateRoomDto {
  @ApiProperty({ description: 'Name of the room' })
  @IsString({message: "Trường name phải là String"})
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

  @ApiProperty({ description: 'Location ID of the room' })
  @IsString()
  locationId: string;
}
