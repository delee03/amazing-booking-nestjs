import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/Prisma/prisma.service';
import { CreateBookingDto } from './dto/booking-create.dto';
import { UpdateBookingDto } from './dto/booking-update.dto';
import { handleResponse } from 'src/common/handleRespsonse';

@Injectable()
export class BookingService {
  constructor(private prisma: PrismaService) {}

  //tạo mới 1 booking
  async create(createBookingDto: CreateBookingDto) {
    const creatingBooking = await this.prisma.booking.create({
      data: createBookingDto,
    });
    return {
      statusCode: 201,
      message: `Booking created successfully`,
      content: creatingBooking,
    };
  }

  //lấy tất cả bookings
  async findAll() {
    const allBooking = await this.prisma.booking.findMany({
      include: {
        room: true,
        user: true,
      },
      orderBy: {
        createdAt: 'desc',
      },
    });
    return {
      statusCode: 200,
      message: `All bookings retrieved successfully`,
      content: allBooking,
    };
  }

  async findAllPagination(pageIndex: number, pageTake: number) {
    // Tính toán giá trị skip
    pageIndex = pageIndex < 1 ? 1 : pageIndex;
    pageTake = pageTake < 1 ? 5 : pageTake;
    const skip = (pageIndex - 1) * pageTake;
    // Lấy rooms với skip và take
    const bookings = await this.prisma.booking.findMany({
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
    // Tổng số booking (dùng để tính số trang)
    const totalCount = await this.prisma.booking.count();
    // Tính số trang
    const pageCount = Math.ceil(totalCount / pageTake);
    return {
      statusCode: 200,
      message: 'Danh sách đặt phòng đã phân trang thành công',
      content: bookings,
      pageCurrent: pageIndex, // Trang hiện tại
      pageCount: pageCount, // Tổng số trang
      totalCount: totalCount, // Tổng số lượng đặt phòng
    };
  }

  //lấy booking by id
  async findOne(id: string) {
    const bookingById = await this.prisma.booking.findUnique({
      where: { id },
      include: {
        room: true,
        user: true,
      },
    });

    return handleResponse('Lấy dữ liệu bookingId thành công', bookingById);
  }

  //lấy booking by user id
  async findByUserId(userId: string) {
    const bookingByUserId = await this.prisma.booking.findMany({
      where: { userId },
      include: {
        room: true,
        user: true,
      },
    });
    return {
      statusCode: 200,
      message: `All bookings by user id ${userId} retrieved successfully`,
      content: bookingByUserId,
    };
  }

  //cập nhật booking bởi id
  async update(id: string, updateBookingDTO: UpdateBookingDto) {
    const updateBooking = await this.prisma.booking.update({
      where: { id },
      data: updateBookingDTO,
    });
    return {
      statusCode: 200,
      message: `Booking with id ${id} updated successfully`,
      content: updateBooking,
    };
  }

  // Phương thức cập nhật booking với các thay đổi
  async update2(bookingId: string, data: { paymentStatus: boolean }) {
    return await this.prisma.booking.update({
      where: { id: bookingId },
      data: { paymentStatus: data.paymentStatus },
    });
  }

  //xóa booking bởi id
  async remove(id: string) {
    const bookingDeleted = await this.prisma.booking.delete({
      where: { id },
    });
    return {
      statusCode: 200,
      message: `Booking with id ${id} deleted successfully`,
      content: bookingDeleted,
    };
  }
}
