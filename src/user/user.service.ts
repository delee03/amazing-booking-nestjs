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
    return this.prisma.user.findMany();
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
      data: updateUserDto,
    });
  }

  // Xóa một người dùng
  async remove(id: string) {
    return this.prisma.user.delete({
      where: { id },
    });
  }
}
