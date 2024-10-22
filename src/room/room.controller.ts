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

  @Get(':id')
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
      const pageIndexNumber = parseInt(pageIndex) || 1; // Mặc định là trang 1 nếu không truyền
      const pageTakeNumber = parseInt(pageTake) || 10; // Mặc định lấy 10 bản ghi nếu không truyền
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
}
