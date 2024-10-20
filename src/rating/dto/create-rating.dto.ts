import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsNumber, IsOptional } from 'class-validator';

export class CreateRatingDto {
  @ApiProperty({ description: 'Rating content' })
  @IsString()
  content: string;

  @ApiProperty({ description: 'Rating star (1-5)' })
  @IsNumber()
  star: number;

  @ApiProperty({ description: 'User ID who gives the rating' })
  @IsString()
  userId: string;

  @ApiProperty({ description: 'Room ID that is being rated' })
  @IsString()
  roomId: string;
}
