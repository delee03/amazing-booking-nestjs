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

  //   async create(createRoomDto: CreateRoomDto) {
  //     return this.prisma.room.create({
  //       data: createRoomDto,
  //     });
  //   }

  // Lấy danh sách tất cả các room
  async findAll() {
    return this.prisma.room.findMany();
  }

  // Lấy thông tin room theo ID
  async findOne(id: string) {
    return this.prisma.room.findUnique({
      where: { id },
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
