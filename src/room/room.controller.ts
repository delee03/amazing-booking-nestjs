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
import { handleResponse } from 'src/common/handleRespsonse';
import { handleErorr } from 'src/common/handleErorr';

@ApiTags('rooms')
@Controller('rooms')
export class RoomController {
  constructor(private readonly roomService: RoomService) {}

  @Post()
  @ApiOperation({ summary: 'Create a new room' })
  async create(@Body() createRoomDto: CreateRoomDto) {
    try {
      const roomCreated = await this.roomService.create(createRoomDto);
      return handleResponse('Tạo phòng mới thành công', roomCreated, 201);
    } catch (error) {
      return handleErorr('Tạo phòng mới thất bại', error.statusCode, error);
    }
  }

  @Get()
  @ApiOperation({ summary: 'Get all rooms' })
  async findAll() {
    try {
      const getAllRooms = await this.roomService.findAll();
      return handleResponse('Lấy tất cả phòng thành công', getAllRooms);
    } catch (error) {
      return handleErorr(
        'Lấy danh sách phòng thất bại',
        error.statusCode,
        error,
      );
    }
  }

  @Get('room-by-id/:id')
  @ApiOperation({ summary: 'Get room by ID' })
  async findOne(@Param('id') id: string) {
    try {
      const roomById = await this.roomService.findOne(id);
      return handleResponse('Lấy phòng theo ID thành công', roomById);
    } catch (error) {
      return handleErorr('Lấy phòng thất bại', error.statusCode, error);
    }
  }

  @Put(':id')
  @ApiOperation({ summary: 'Update room by ID' })
  async update(@Param('id') id: string, @Body() updateRoomDto: UpdateRoomDto) {
    try {
      const updatedRoom = await this.roomService.update(id, updateRoomDto);
      return handleResponse('Cập nhật phòng thành công', updatedRoom);
    } catch (error) {
      return handleErorr('Lỗi khi sửa phòng', 403, error);
    }
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Delete room by ID' })
  async remove(@Param('id') id: string) {
    const deletedRoom = await this.roomService.remove(id);
    return handleResponse('Xóa phòng thành công', deletedRoom);
  }

  @Post('avatar/:id')
  @ApiConsumes('multipart/form-data')
  @ApiOperation({ summary: 'Upload room avatar' })
  @UseInterceptors(FileInterceptor('file'))
  async uploadAvatar(
    @Param('id') id: string,
    @UploadedFile() file: Express.Multer.File,
    @Body() body: UploadRoomImgDto,
  ) {
    try {
      const uploadAvatar = await this.roomService.updateAvatar(id, file);
      return handleResponse('Upload Avatart thành công', uploadAvatar);
    } catch (error) {
      return handleErorr('Lỗi khi upload avatar cho room', 400, error);
    }
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
      return handleResponse(
        'Lấy danh sách phòng theo vị trí thành công',
        listRoom,
      );
    } catch (error) {
      return {
        statusCode: 500,
        message: `Failed to get rooms by location ID: ${error.message}`,
      };
    }
  }
}
