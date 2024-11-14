import { Injectable } from '@nestjs/common';
import { PrismaService } from '../Prisma/prisma.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { UploadAvatarDto } from './dto/uploadavatar-user.dto';
import { s3 } from 'spaces.config';
import { ObjectId } from 'mongodb';
import * as bcrypt from 'bcrypt';

@Injectable()
export class UserService {
  constructor(private prisma: PrismaService) {}

  // Tạo user mới
  async create(createUserDto: CreateUserDto) {
    return await this.prisma.user.create({
      data: {
        ...createUserDto,
      },
    });
  }

  //get user pagination with pageIndex and pageTake
  async findAllUserPagination(pageIndex: number, pageTake: number) {
    try {
      const skipValue = (pageIndex - 1) * pageTake;
      // Kiểm tra giá trị skip và take
      console.log('Skip:', skipValue, 'Take:', pageTake);
      // Lấy users với skip và take
      const users = await this.prisma.user.findMany({
        skip: skipValue,
        take: pageTake, // Lấy số phần tử tương ứng với pageTake
        include: {
          bookings: true,
          ratings: true,
        },
      });
      const totalUsers = await this.prisma.user.count();
      const totalPages = Math.ceil(totalUsers / pageTake);
      // Kiểm tra kết quả truy vấn users
      console.log('Users:', users);
      return {
        statusCode: 200,
        message: 'Danh sách người dùng đã phân trang thành công',
        content: users,
        pageCurrent: pageIndex,
        pageCount: totalPages,
        totalCount: totalUsers,
      };
    } catch (error) {
      throw new Error(`Failed to paginate users: ${error.message}`);
    }
  }

  //upload avatar
  async updateAvatar(id: string, file: Express.Multer.File) {
    const uploadParams = {
      Bucket: 'user-avatar', // Tên của Space đã tạo
      Key: `${id}-${Date.now()}.${file.mimetype.split('/')[1]}`, // Tạo tên file duy nhất
      Body: file.buffer,
      ACL: 'public-read', //  quyền truy cập công khai
    };

    try {
      // Upload file lên Space DigitalOcean
      const data = await s3.upload(uploadParams).promise();
      const avatarUrl = data.Location;

      // Cập nhật URL avatar trong cơ sở dữ liệu
      return this.prisma.user.update({
        where: { id },
        data: { avatar: avatarUrl },
      });
    } catch (err) {
      throw new Error(`Failed to upload avatar: ${err.message}`);
    }
  }

  // Lấy danh sách tất cả người dùng
  async findAll() {
    return await this.prisma.user.findMany();
  }
  // Lấy thông tin một người dùng bằng ID
  async findOne(id: string) {
    return await this.prisma.user.findUnique({
      where: { id },
      include: {
        bookings: true,
        ratings: true,
      },
    });
  }

  // Cập nhật thông tin người dùng
  async update(id: string, updateUserDto: UpdateUserDto) {
    try {
      let passwordHash = updateUserDto.password;
      if (updateUserDto.password) {
        passwordHash = await bcrypt.hash(updateUserDto.password, 10);
      }
      return await this.prisma.user.update({
        where: { id },
        data: {
          name: updateUserDto.name,
          email: updateUserDto.email,
          password: passwordHash ? passwordHash : undefined, //// Chỉ cập nhật password nếu có mật khẩu mới, nếu không giữ nguyên mật khẩu cũ
          avatar: updateUserDto.avatar,
          role: updateUserDto.role,
        },
      });
    } catch (error) {
      throw new Error(`Failed to update user: ${error.message}`);
    }
  }

  // Xóa một người dùng
  async remove(id: string) {
    return await this.prisma.user.delete({
      where: { id },
    });
  }
}
