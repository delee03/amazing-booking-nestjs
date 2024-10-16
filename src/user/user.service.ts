import { Injectable } from '@nestjs/common';
import { PrismaService } from '../Prisma/prisma.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';

@Injectable()
export class UserService {
  constructor(private prisma: PrismaService) {}

  // Tạo user mới
  async create(createUserDto: CreateUserDto) {
    return this.prisma.user.create({
      data: createUserDto,
    });
  }

  // Lấy danh sách tất cả người dùng
  async findAll() {
    const allUsers = await this.prisma.user.findMany();
    return {
      statusCode: 200,
      message: 'All users retrieved successfully',
      content: allUsers, // Mảng `data` sẽ chứa tất cả users
    };
  }

  // Lấy thông tin một người dùng bằng ID
  async findOne(id: string) {
    return this.prisma.user.findUnique({
      where: { id },
    });
  }

  // Cập nhật thông tin người dùng
  async update(id: string, updateUserDto: UpdateUserDto) {
    return this.prisma.user.update({
      where: { id },
      // data: updateUserDto,
      data: {
        name: updateUserDto.name,
        email: updateUserDto.email,
        password: updateUserDto.password,
        avatar: updateUserDto.avatar,
        role: updateUserDto.role,
        // Không cần đưa `id` vào `data` vì không được phép cập nhật khóa chính
        // bookings và ratings cũng không cần nếu không có sự thay đổi.
      },
    });
  }

  // Xóa một người dùng
  async remove(id: string) {
    const deleteUser = this.prisma.user.delete({
      where: { id },
    });
    return {
      content: [
        {
          message: `User with ID ${id} has been successfully deleted.`,
          data: [deleteUser],
        },
      ],
    };
  }
}
