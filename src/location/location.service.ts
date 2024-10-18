import { Injectable } from '@nestjs/common';
import { PrismaService } from '../Prisma/prisma.service';
import { CreateLocationDto } from './dto/create-location.dto';
import { UpdateLocationDto } from './dto/update-location.dto';

@Injectable()
export class LocationService {
  constructor(private prisma: PrismaService) {}

  // Tạo location mới
  async create(createLocationDto: CreateLocationDto) {
    return this.prisma.location.create({
      data: createLocationDto,
    });
  }

  // Lấy danh sách tất cả locations
  async findAll() {
    return this.prisma.location.findMany();
  }

  // Lấy thông tin location theo ID
  async findOne(id: string) {
    return this.prisma.location.findUnique({
      where: { id },
    });
  }

  // Cập nhật thông tin location
  async update(id: string, updateLocationDto: UpdateLocationDto) {
    return this.prisma.location.update({
      where: { id },
      data: updateLocationDto,
    });
  }

  // Xóa một location
  async remove(id: string) {
    return this.prisma.location.delete({
      where: { id },
    });
  }
}
