import { Injectable } from '@nestjs/common';
import { PrismaService } from '../Prisma/prisma.service';
import { CreateRoomImageDto } from './dto/create-room-image.dto';
import { UpdateRoomImageDto } from './dto/update-room-image-dto';
import { s3 } from 'spaces.config';

@Injectable()
export class RoomImageService {
  constructor(private prisma: PrismaService) {}

  // Tạo RoomImage mới và upload ảnh lên DigitalOcean Spaces
  async uploadMultipleImages(
    roomId: string,
    files: Array<Express.Multer.File>,
  ) {
    const imageUrls = [];
    for (let file of files) {
      const uploadParams = {
        Bucket: 'room-image', // Tên của Space bạn đã tạo
        Key: `${roomId}-${Date.now()}-${file.originalname}`, // Tạo tên file duy nhất
        Body: file.buffer,
        ACL: 'public-read', // Đặt quyền công khai nếu cần
      };
      try {
        // Upload file lên DigitalOcean Spaces
        const data = await s3.upload(uploadParams).promise();
        const imageUrl = data.Location;

        // Push URL của ảnh vào mảng
        imageUrls.push(imageUrl);

        // Lưu URL của ảnh vào cơ sở dữ liệu
        await this.prisma.roomImage.create({
          data: {
            url: imageUrl,
            roomId: roomId,
          },
        });
      } catch (err) {
        console.error(`Failed to upload room image: ${err.message}`);
      }
    }

    return {
      message: `${files.length} images uploaded successfully`,
      imageUrls,
    };
  }

  // Lấy tất cả RoomImages
  async findAll() {
    return this.prisma.roomImage.findMany({
      include: {
        room: true,
      },
    });
  }

  // Lấy RoomImage theo ID
  async findOne(id: string) {
    return this.prisma.roomImage.findUnique({
      where: { id },
    });
  }

  // Lấy tất cả RoomImage theo Room ID
  async findAllByRoomId(roomId: string) {
    return this.prisma.roomImage.findMany({
      where: { roomId },
    });
  }

  // Cập nhật RoomImage theo ID
  async update(id: string, updateRoomImageDto: UpdateRoomImageDto) {
    return this.prisma.roomImage.update({
      where: { id },
      data: updateRoomImageDto,
    });
  }

  // Xóa RoomImage theo ID
  async remove(id: string) {
    return this.prisma.roomImage.delete({
      where: { id },
    });
  }
}
