import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseInterceptors,
  UploadedFile,
  UploadedFiles,
} from '@nestjs/common';
import { RoomImageService } from './room-image.service';
import { CreateRoomImageDto } from './dto/create-room-image.dto';
import { UpdateRoomImageDto } from './dto/update-room-image-dto';
import { ApiOperation, ApiTags, ApiConsumes } from '@nestjs/swagger';
import { FilesInterceptor } from '@nestjs/platform-express';

@ApiTags('room-images')
@Controller('room-images')
export class RoomImageController {
  constructor(private readonly roomImageService: RoomImageService) {}
  // Tạo RoomImage mới và upload file
  @Post()
  @ApiOperation({ summary: 'Upload images for room' })
  @ApiConsumes('multipart/form-data') // Xác định kiểu dữ liệu là multipart/form-data
  @UseInterceptors(FilesInterceptor('file', 5)) // Upload tối đa 5 file
  create(
    @Body() createRoomImageDto: CreateRoomImageDto,
    @UploadedFiles() files: Array<Express.Multer.File>,
  ) {
    return this.roomImageService.uploadMultipleImages(
      createRoomImageDto.roomId,
      files,
    );
  }
  @Get()
  @ApiOperation({ summary: 'Get all room images' })
  findAll() {
    return this.roomImageService.findAll();
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get room image by ID' })
  findOne(@Param('id') id: string) {
    return this.roomImageService.findOne(id);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Update room image by ID' })
  update(
    @Param('id') id: string,
    @Body() updateRoomImageDto: UpdateRoomImageDto,
  ) {
    return this.roomImageService.update(id, updateRoomImageDto);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Delete room image by ID' })
  remove(@Param('id') id: string) {
    return this.roomImageService.remove(id);
  }

  @Get('/room/:roomId')
  @ApiOperation({ summary: 'Get all room images by room ID' })
  async findAllByRoomId(@Param('roomId') roomId: string) {
    return this.roomImageService.findAllByRoomId(roomId);
  }
}
