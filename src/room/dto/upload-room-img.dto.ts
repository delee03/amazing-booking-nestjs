import { ApiProperty } from '@nestjs/swagger';
import { IsString } from 'class-validator';

export class UploadRoomImgDto {
  @ApiProperty({ type: 'string', format: 'binary' })
  file: any; // Tạo trường file cho form upload
}
