import { ApiProperty } from '@nestjs/swagger';

export class CreateLocationDto {
  @ApiProperty({ description: 'City name' })
  city: string;

  @ApiProperty({ description: 'Location style (optional)', required: false })
  style?: string;

  @ApiProperty({ description: 'Country name' })
  country: string;

  @ApiProperty({ description: 'Longitude (optional)', required: false })
  longitude?: number;

  @ApiProperty({ description: 'Latitude (optional)', required: false })
  latitude?: number;
}
