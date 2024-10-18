import { ApiProperty } from '@nestjs/swagger';

export class CreateRatingDto {
  @ApiProperty({ description: 'Rating content' })
  content: string;

  @ApiProperty({ description: 'Star rating (from 1 to 5)' })
  star: number;

  @ApiProperty({ description: 'User ID who made the rating', required: true })
  userId: string;

  @ApiProperty({ description: 'Room ID being rated', required: true })
  roomId: string;
}
