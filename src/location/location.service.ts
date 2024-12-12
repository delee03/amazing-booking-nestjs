import { Injectable } from '@nestjs/common';
import { PrismaService } from '../Prisma/prisma.service';
import { CreateLocationDto } from './dto/create-location.dto';
import { UpdateLocationDto } from './dto/update-location.dto';

@Injectable()
export class LocationService {
  constructor(private prisma: PrismaService) {}

  // Tạo location mới
  async create(createLocationDto: CreateLocationDto) {
    return await this.prisma.location.create({
      data: createLocationDto,
    });
  }

  // Lấy danh sách tất cả locations
  async findAll() {
    return await this.prisma.location.findMany({
      orderBy: {
        createdAt: 'desc',
      },
    });
  }

  // Lấy danh sách locations với phân trang
  async findAllPagination(pageIndex: number, pageTake: number) {
    pageIndex = pageIndex < 1 ? 1 : pageIndex;
    pageTake = pageTake < 1 ? 5 : pageTake;
    // Tính toán giá trị skip

    const skip = (pageIndex - 1) * pageTake;
    // Lấy ratings với skip và take
    const locations = await this.prisma.location.findMany({
      skip: skip, // Bỏ qua các phần tử đã tính toán
      take: pageTake, // Lấy số phần tử tương ứng với pageTake
      orderBy: {
        createdAt: 'desc',
      },
    });
    // Tổng số  (dùng để tính số trang)
    const totalCount = await this.prisma.location.count();
    // Tính số trang
    const pageCount = Math.ceil(totalCount / pageTake);
    return {
      statusCode: 200,
      message: 'Danh sách địa điểm thành công',
      content: locations, // Danh sách địa điểm
      pageCurrent: pageIndex, // Trang hiện tại
      pageCount: pageCount, // Tổng số trang
      totalCount: totalCount, // Tổng số lượng
    };
  }

  // Lấy thông tin location theo ID
  async findOne(id: string) {
    if (!id) {
      throw new Error('Location ID is required');
    }
    return await this.prisma.location.findUnique({
      where: { id },
    });
  }

  // Cập nhật thông tin location
  async update(id: string, updateLocationDto: UpdateLocationDto) {
    return await this.prisma.location.update({
      where: { id },
      data: updateLocationDto,
    });
  }

  // Xóa một location
  async remove(id: string) {
    return await this.prisma.location.delete({
      where: { id },
    });
  }
}
