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
