import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseInterceptors,
  Put,
  UploadedFile,
  Query,
} from '@nestjs/common';
import { RoomService } from './room.service';
import { CreateRoomDto } from './dto/create-room.dto';
import { UpdateRoomDto } from './dto/update-room.dto';
import { ApiConsumes, ApiOperation, ApiTags } from '@nestjs/swagger';
import { FileInterceptor } from '@nestjs/platform-express';
import { UploadRoomImgDto } from './dto/upload-room-img.dto';

@ApiTags('rooms')
@Controller('rooms')
export class RoomController {
  constructor(private readonly roomService: RoomService) {}

  @Post()
  @ApiOperation({ summary: 'Create a new room' })
  create(@Body() createRoomDto: CreateRoomDto) {
    return this.roomService.create(createRoomDto);
  }

  @Get()
  @ApiOperation({ summary: 'Get all rooms' })
  async findAll() {
    return await this.roomService.findAll();
  }

  @Get('room-by-id/:id')
  @ApiOperation({ summary: 'Get room by ID' })
  async findOne(@Param('id') id: string) {
    return await this.roomService.findOne(id);
  }

  @Put(':id')
  @ApiOperation({ summary: 'Update room by ID' })
  async update(@Param('id') id: string, @Body() updateRoomDto: UpdateRoomDto) {
    return await this.roomService.update(id, updateRoomDto);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Delete room by ID' })
  async remove(@Param('id') id: string) {
    return await this.roomService.remove(id);
  }

  @Post(':id/avatar')
  @ApiConsumes('multipart/form-data')
  @ApiOperation({ summary: 'Upload room avatar' })
  @UseInterceptors(FileInterceptor('file'))
  async uploadAvatar(
    @Param('id') id: string,
    @UploadedFile() file: Express.Multer.File,
    @Body() body: UploadRoomImgDto,
  ) {
    return await this.roomService.updateAvatar(id, file);
  }

  @Get('room-pagination')
  @ApiOperation({ summary: 'Get all rooms with pagination' })
  async findAllPagination(
    @Query('pageIndex') pageIndex: string, // Nhận giá trị pageIndex từ Query Params
    @Query('pageTake') pageTake: string, // Nhận giá trị pageTake từ Query Params
  ) {
    try {
      // Nếu giá trị không phải số, mặc định là trang 1 và lấy 10 người dùng
      const pageIndexNumber = isNaN(parseInt(pageIndex))
        ? 1
        : parseInt(pageIndex);
      const pageTakeNumber = isNaN(parseInt(pageTake))
        ? 10
        : parseInt(pageTake);
      return await this.roomService.findAllPagination(
        pageIndexNumber,
        pageTakeNumber,
      );
    } catch (error) {
      return {
        statusCode: 500,
        message: `Failed to paginate rooms: ${error.message}`,
      };
    }
  }

  @Get('room-by-location/:id')
  @ApiOperation({ summary: 'Get all rooms by location ID' })
  async findRoomByLocation(@Param('id') id: string) {
    try {
      const listRoom = await this.roomService.findRoomByLocation(id);
      return {
        statusCode: 200,
        message: 'Lấy danh sách phòng theo vị trí thành công',
        content: listRoom,
      };
    } catch (error) {
      return {
        statusCode: 500,
        message: `Failed to get rooms by location ID: ${error.message}`,
      };
    }
  }
}
