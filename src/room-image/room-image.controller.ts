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
import {
  ApiOperation,
  ApiTags,
  ApiConsumes,
  ApiBearerAuth,
} from '@nestjs/swagger';
import { FilesInterceptor } from '@nestjs/platform-express';
import { handleResponse } from 'src/common/handleRespsonse';

@ApiBearerAuth('Bearer')
@ApiTags('room-images')
@Controller('room-images')
export class RoomImageController {
  constructor(private readonly roomImageService: RoomImageService) {}
  // Tạo RoomImage mới và upload file
  @Post()
  @ApiOperation({ summary: 'Upload images for room' })
  @ApiConsumes('multipart/form-data') // Xác định kiểu dữ liệu là multipart/form-data
  @UseInterceptors(FilesInterceptor('file', 5)) // Upload tối đa 5 file
  async create(
    @Body() createRoomImageDto: CreateRoomImageDto,
    @UploadedFiles() files: Array<Express.Multer.File>,
  ) {
    try {
      const createImage = await this.roomImageService.uploadMultipleImages(
        createRoomImageDto.roomId,
        files,
      );
      return handleResponse('Upload ảnh phòng thành công', createImage, 201);
    } catch (error) {
      return {
        statusCode: 400,
        message: `Failed to upload image: ${error.message}`,
      };
    }
  }
  @Get()
  @ApiOperation({ summary: 'Get all room images' })
  async findAll() {
    try {
      const getAllImages = await this.roomImageService.findAll();
      return handleResponse('Lấy ra tất cả ảnh phòng thành công', getAllImages);
    } catch (error) {
      return {
        statusCode: 400,
        message: `Failed to get all images: ${error.message}`,
      };
    }
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get room image by ID' })
  async findOne(@Param('id') id: string) {
    try {
      const getImageById = await this.roomImageService.findOne(id);
      return handleResponse('Lấy ảnh theo ID thành công', getImageById);
    } catch (error) {
      return {
        statusCode: 400,
        message: `Failed to get image: ${error.message}`,
      };
    }
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Update room image by ID' })
  async update(
    @Param('id') id: string,
    @Body() updateRoomImageDto: UpdateRoomImageDto,
  ) {
    try {
      const updatedImage = await this.roomImageService.update(
        id,
        updateRoomImageDto,
      );
      return handleResponse('Sửa ảnh phòng thành công', updatedImage);
    } catch (error) {
      return {
        statusCode: 400,
        message: `Failed to update image: ${error.message}`,
      };
    }
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Delete room image by ID' })
  async remove(@Param('id') id: string) {
    try {
      const deletedImage = await this.roomImageService.remove(id);
      return handleResponse('XÓa ảnh phòng thành công', deletedImage);
    } catch (error) {
      return {
        statusCode: 400,
        message: `Failed to delete image: ${error.message}`,
      };
    }
  }

  @Get('/room/:roomId')
  @ApiOperation({ summary: 'Get all room images by room ID' })
  async findAllByRoomId(@Param('roomId') roomId: string) {
    try {
      const ImageByRoomId = await this.roomImageService.findAllByRoomId(roomId);
      return handleResponse(
        'Lấy ảnh theo phòng thành công',
        ImageByRoomId,
        200,
      );
    } catch (error) {
      return {
        statusCode: 400,
        message: `Failed to get all images by room id ${roomId}: ${error}`,
      };
    }
  }
}
