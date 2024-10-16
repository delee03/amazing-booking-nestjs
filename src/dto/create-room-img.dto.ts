import { ApiProperty } from '@nestjs/swagger';

export class CreateRoomImageDto {
  @ApiProperty({ description: 'URL of the room image' })
  url: string;

  @ApiProperty({ description: 'Room ID the image belongs to', required: true })
  roomId: string;
}
