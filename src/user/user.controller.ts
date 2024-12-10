import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Put,
  UploadedFile,
  UseInterceptors,
  Query,
  UseGuards,
  Req,
} from '@nestjs/common';

import { FileInterceptor } from '@nestjs/platform-express';
import { UserService } from './user.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { UploadAvatarDto } from './dto/uploadavatar-user.dto';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiConsumes,
  ApiBearerAuth,
} from '@nestjs/swagger';
import { handleResponse } from 'src/common/handleRespsonse';
import { AuthGuard } from '@nestjs/passport';
import { Request } from 'express';
import { Role } from '@prisma/client';
import { Roles } from 'src/common/decorater/roles.decorater';
// Removed unused import for Multer

// @UseGuards(AuthGuard('protected'))
@ApiBearerAuth('Bearer')
@ApiTags('users')
@Controller('users')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Post()
  @ApiOperation({ summary: 'Create a new user' })
  @ApiResponse({
    status: 201,
    description: 'The user has been successfully created.',
  })
  async create(@Body() createUserDto: CreateUserDto) {
    const createdUser = await this.userService.create(createUserDto);
    return handleResponse('Tạo mới user thành công', createdUser, 201);
  }

  @Get()
  @ApiOperation({ summary: 'Get all users' })
  @ApiResponse({ status: 200, description: 'Return all users.' })
  async findAll(@Req() req: Request) {
    // console.log({ authen: req.user });
    const getAllUsers = await this.userService.findAll();
    return handleResponse('Lấy tất cả user thành công', getAllUsers);
  }

  @Get('user-by-id/:id')
  @ApiOperation({ summary: 'Get a user by ID' })
  @ApiResponse({
    status: 200,
    description: 'Return the user with the specified ID.',
  })
  async findOne(@Param('id') id: string) {
    const getUserById = await this.userService.findOne(id);
    return handleResponse('Lấy thông tin user thành công', getUserById);
  }

  @Roles('ADMIN')
  @Put(':id')
  @ApiOperation({ summary: 'Update a user by ID' })
  @ApiResponse({
    status: 200,
    description: 'The user has been successfully updated.',
  })
  async update(@Param('id') id: string, @Body() updateUserDto: UpdateUserDto) {
    const updateUser = await this.userService.update(id, updateUserDto);
    return handleResponse('Cập nhật thông tin user thành công', updateUser);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Delete a user by ID' })
  @ApiResponse({
    status: 200,
    description: 'The user has been successfully deleted.',
  })
  async remove(@Param('id') id: string) {
    const deletedUser = await this.userService.remove(id);
    return handleResponse('Xóa user thành công', deletedUser, 200);
  }

  @Post('avatar/:id')
  @ApiOperation({ summary: 'Upload an avatar for a user' })
  @ApiConsumes('multipart/form-data') // Xác định kiểu dữ liệu là multipart/form-data
  @UseInterceptors(FileInterceptor('file'))
  async uploadAvatar(
    @Param('id') id: string,
    @UploadedFile() file: Express.Multer.File,
    @Body() body: UploadAvatarDto,
  ) {
    const updateAvatar = await this.userService.updateAvatar(id, file);
    return handleResponse(
      'Upload avatar cho người dùng thành công',
      updateAvatar,
      201,
    );
  }

  @Get('user-pagination')
  @ApiOperation({ summary: 'Get all users with pagination' })
  async findAllPagination(
    @Query('pageIndex') pageIndex: string,
    @Query('pageTake') pageTake: string,
  ) {
    try {
      // Nếu giá trị không phải số, mặc định là trang 1 và lấy 10 người dùng
      const pageIndexNumber = isNaN(parseInt(pageIndex))
        ? 1
        : parseInt(pageIndex);
      const pageTakeNumber = isNaN(parseInt(pageTake))
        ? 10
        : parseInt(pageTake);
      return await this.userService.findAllUserPagination(
        pageIndexNumber,
        pageTakeNumber,
      );
    } catch (error) {
      return {
        statusCode: 500,
        message: `Failed to paginate users: ${error.message}`,
      };
    }
  }
}
