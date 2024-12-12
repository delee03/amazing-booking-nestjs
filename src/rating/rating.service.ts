import { Injectable } from '@nestjs/common';
import { PrismaService } from '../Prisma/prisma.service';
import { CreateRatingDto } from './dto/create-rating.dto';
import { UpdateRatingDto } from './dto/update-rating.dto';

@Injectable()
export class RatingService {
  constructor(private prisma: PrismaService) {}

  // Tạo mới rating
  async create(createRatingDto: CreateRatingDto) {
    return this.prisma.rating.create({
      data: createRatingDto,
    });
  }

  // Lấy tất cả ratings
  async findAll() {
    return this.prisma.rating.findMany({
      include: {
        user: true,
        room: true,
      },
    });
  }

  async findAllPagination(pageIndex: number, pageTake: number) {
    pageIndex = pageIndex < 1 ? 1 : pageIndex;
    pageTake = pageTake < 1 ? 5 : pageTake;
    // Tính toán giá trị skip

    const skip = (pageIndex - 1) * pageTake;
    // Lấy ratings với skip và take
    const ratings = await this.prisma.rating.findMany({
      skip: skip, // Bỏ qua các phần tử đã tính toán
      take: pageTake, // Lấy số phần tử tương ứng với pageTake
      include: {
        user: true,
        room: true,
      },
      orderBy: {
        createdAt: 'desc',
      },
    });
    // Tổng số  (dùng để tính số trang)
    const totalCount = await this.prisma.rating.count();
    // Tính số trang
    const pageCount = Math.ceil(totalCount / pageTake);
    return {
      statusCode: 200,
      message: 'Danh sách đánh giá với user và room thành công',
      content: ratings, // Danh sách đánh giá
      pageCurrent: pageIndex, // Trang hiện tại
      pageCount: pageCount, // Tổng số trang
      totalCount: totalCount, // Tổng số lượng
    };
  }

  // Lấy rating theo ID
  async findOne(id: string) {
    return this.prisma.rating.findUnique({
      where: { id },
      include: {
        user: true,
        room: true,
      },
    });
  }

  // Cập nhật rating theo ID
  async update(id: string, updateRatingDto: UpdateRatingDto) {
    return this.prisma.rating.update({
      where: { id },
      data: updateRatingDto,
    });
  }

  // Xóa rating theo ID
  async remove(id: string) {
    return this.prisma.rating.delete({
      where: { id },
    });
  }

  // Lấy tất cả ratings theo roomId
  async findAllByRoomId(roomId: string) {
    return this.prisma.rating.findMany({
      where: { roomId },
      include: {
        user: true,
      },
    });
  }

  //lấy tất cả ratings theo userId
  async findAllByUserId(userId: string) {
    return this.prisma.rating.findMany({
      where: { userId },
      include: {
        room: true,
      },
    });
  }
}
