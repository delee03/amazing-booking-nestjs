import { ApiProperty } from '@nestjs/swagger';
import { IsString } from 'class-validator';

export class CreateRoomImageDto {
  @ApiProperty({
    type: 'array',
    items: { type: 'string', format: 'binary' },
    description: 'Multiple image files to be uploaded',
  })
  @IsString()
  file: any[];

  @ApiProperty({ description: 'ID of the room to which the image belongs' })
  @IsString()
  roomId: string;
}
