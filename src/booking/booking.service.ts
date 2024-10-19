import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/Prisma/prisma.service';
import { CreateBookingDto } from './dto/booking-create.dto';
import { UpdateBookingDto } from './dto/booking-update.dto';

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
    });
    return {
      statusCode: 200,
      message: `All bookings retrieved successfully`,
      content: allBooking,
    };
  }

  //lấy booking by id
  async findOne(id: string) {
    return this.prisma.booking.findUnique({
      where: { id },
      include: {
        room: true,
        user: true,
      },
    });
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
    const updateBooking = this.prisma.booking.update({
      where: { id },
      data: updateBookingDTO,
    });
    return {
      statusCode: 200,
      message: `Booking with id ${id} updated successfully`,
      content: updateBooking,
    };
  }

  //xóa booking bởi id
  async remove(id: string) {
    const bookingDeleted = this.prisma.booking.delete({
      where: { id },
    });
    return {
      statusCode: 200,
      message: `Booking with id ${id} deleted successfully`,
      content: bookingDeleted,
    };
  }
}
