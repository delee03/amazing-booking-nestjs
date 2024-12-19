import { ApiProperty } from '@nestjs/swagger';
import { IsArray, IsString, ArrayNotEmpty } from 'class-validator';

export class CreateRoomImageDto {
  // @ApiProperty({
  //   type: 'array',
  //   items: { type: 'string', format: 'binary' },
  //   description: 'Multiple image files to be uploaded',
  // })
  // @IsArray()
  // @ArrayNotEmpty()
  // @IsString({ each: true })
  // files: string[];
  @ApiProperty({
    type: 'string',
    format: 'binary',
    description: 'Multiple image files to be uploaded',
  })
  file: any; // Để Swagger hiểu đây là file upload

  @ApiProperty({ description: 'ID of the room to which the image belongs' })
  @IsString()
  roomId: string;
}
