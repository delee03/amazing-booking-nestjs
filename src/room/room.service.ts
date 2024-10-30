import { Injectable } from '@nestjs/common';
import { PrismaService } from '../Prisma/prisma.service';
import { CreateRoomDto } from './dto/create-room.dto';
import { UpdateRoomDto } from './dto/update-room.dto';
import { s3 } from 'spaces.config';

@Injectable()
export class RoomService {
  constructor(private prisma: PrismaService) {}

  // Tạo room mới
  async create(createRoomDto: CreateRoomDto) {
    const data = {
      ...createRoomDto,
      avatar: createRoomDto.avatar ?? 'string',
    };
    return this.prisma.room.create({
      data,
    });
  }

  // Lấy danh sách phòng với phân trang dựa trên pageIndex và pageTake
  async findAllPagination(pageIndex: number, pageTake: number) {
    // Tính toán giá trị skip
    const skip = (pageIndex - 1) * pageTake;
    // Lấy rooms với skip và take
    const rooms = await this.prisma.room.findMany({
      skip: skip, // Bỏ qua các phần tử đã tính toán
      take: pageTake, // Lấy số phần tử tương ứng với pageTake
      include: {
        location: true,
        bookings: true,
        images: true,
        ratings: true,
      },
    });
    // Tổng số phòng (dùng để tính số trang)
    const totalCount = await this.prisma.room.count();
    // Tính số trang
    const pageCount = Math.ceil(totalCount / pageTake);
    return {
      statusCode: 200,
      message: 'Danh sách phòng đã phân trang thành công',
      content: rooms,
      pageCurrent: pageIndex, // Trang hiện tại
      pageCount: pageCount, // Tổng số trang
      totalCount: totalCount, // Tổng số lượng phòng
    };
  }

  //   async create(createRoomDto: CreateRoomDto) {
  //     return this.prisma.room.create({
  //       data: createRoomDto,
  //     });
  //   }

  //get all room by location id
  async findRoomByLocation(idLocation: string) {
    return this.prisma.room.findMany({
      where: {
        locationId: idLocation,
      },
    });
  }

  // Lấy danh sách tất cả các room
  async findAll() {
    return this.prisma.room.findMany();
  }

  // Lấy thông tin room theo ID
  async findOne(id: string) {
    return this.prisma.room.findUnique({
      where: { id },
      include: {
        location: true,
        bookings: true,
        images: true,
        ratings: true,
      },
    });
  }

  // Cập nhật room theo ID
  async update(id: string, updateRoomDto: UpdateRoomDto) {
    return this.prisma.room.update({
      where: { id },
      data: updateRoomDto,
    });
  }

  // Xóa room theo ID
  async remove(id: string) {
    return this.prisma.room.delete({
      where: { id },
    });
  }

  //upload avatar cho room
  async updateAvatar(id: string, file: Express.Multer.File) {
    const uploadParams = {
      Bucket: 'room-image',
      Key: `${id}-${Date.now()}.${file.mimetype.split('/')[1]}`, //tên file duy nhất
      Body: file.buffer,
      ACL: 'public-read', //công khai file
    };
    try {
      const data = await s3.upload(uploadParams).promise();
      const avatarUrl = data.Location;
      //cập nhật avatar cho room
      return this.prisma.room.update({
        where: { id },
        data: { avatar: avatarUrl },
      });
    } catch (error) {
      throw new Error(`Failed to upload avatar: ${error.message}`);
    }
  }
}
