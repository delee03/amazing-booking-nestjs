import { ApiProperty, PartialType } from '@nestjs/swagger';
import { CreateRoomImageDto } from './create-room-img.dto';

export class UpdateRoomImageDto extends PartialType(CreateRoomImageDto) {
  @ApiProperty({ description: 'Room Image ID', required: true })
  id: string;
}
