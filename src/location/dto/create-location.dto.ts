import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsOptional } from 'class-validator';

export class CreateLocationDto {
  @ApiProperty({ description: 'City of the location' })
  @IsString()
  city: string;

  @ApiProperty({ description: 'Style of the location', required: false })
  @IsOptional()
  @IsString()
  style?: string;

  @ApiProperty({ description: 'Country of the location' })
  @IsString()
  country: string;

  @ApiProperty({ description: 'Longitude of the location', required: false })
  @IsOptional()
  @IsString() // Kiểu dữ liệu là String
  longitude?: string;

  @ApiProperty({ description: 'Latitude of the location', required: false })
  @IsOptional()
  @IsString() // Kiểu dữ liệu là String
  latitude?: string;
}
