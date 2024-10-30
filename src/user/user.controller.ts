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
} from '@nestjs/swagger';
// Removed unused import for Multer

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
  create(@Body() createUserDto: CreateUserDto) {
    return this.userService.create(createUserDto);
  }

  @Get()
  @ApiOperation({ summary: 'Get all users' })
  @ApiResponse({ status: 200, description: 'Return all users.' })
  findAll() {
    return this.userService.findAll();
  }

  @Get('user-by-id/:id')
  @ApiOperation({ summary: 'Get a user by ID' })
  @ApiResponse({
    status: 200,
    description: 'Return the user with the specified ID.',
  })
  async findOne(@Param('id') id: string) {
    return await this.userService.findOne(id);
  }

  @Put(':id')
  @ApiOperation({ summary: 'Update a user by ID' })
  @ApiResponse({
    status: 200,
    description: 'The user has been successfully updated.',
  })
  update(@Param('id') id: string, @Body() updateUserDto: UpdateUserDto) {
    return this.userService.update(id, updateUserDto);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Delete a user by ID' })
  @ApiResponse({
    status: 200,
    description: 'The user has been successfully deleted.',
  })
  remove(@Param('id') id: string) {
    return this.userService.remove(id);
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
    return this.userService.updateAvatar(id, file);
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
