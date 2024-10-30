import {
  Controller,
  Get,
  Post,
  Put,
  Body,
  Param,
  Delete,
  Patch,
  Query,
  Redirect,
} from '@nestjs/common';
import { BookingService } from './booking.service';
import { CreateBookingDto } from './dto/booking-create.dto';
import { UpdateBookingDto } from './dto/booking-update.dto';
import { ApiTags, ApiOperation } from '@nestjs/swagger';
import { PaymentService } from './payment.service';

@Controller('booking')
@ApiTags('booking')
export class BookingController {
  constructor(
    private readonly bookingService: BookingService,

    private readonly paymentService: PaymentService,
  ) {}

  @Post()
  @ApiOperation({ summary: 'Create a new booking' })
  async create(@Body() createBookingDto: CreateBookingDto) {
    return this.bookingService.create(createBookingDto);
  }

  @Get()
  @ApiOperation({ summary: 'Get all bookings' })
  async findAll() {
    return this.bookingService.findAll();
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get a booking by id' })
  async findOne(@Param('id') id: string) {
    return this.bookingService.findOne(id);
  }

  @Get('user/:userId')
  @ApiOperation({ summary: 'Get all bookings by user id' })
  async findByUserId(@Param('userId') userId: string) {
    return this.bookingService.findByUserId(userId);
  }

  @Put(':id')
  @ApiOperation({ summary: 'Update a booking by id' })
  async update(
    @Param('id') id: string,
    @Body() updateBookingDTO: UpdateBookingDto,
  ) {
    return this.bookingService.update(id, updateBookingDTO);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Delete a booking by id' })
  async remove(@Param('id') id: string) {
    return this.bookingService.remove(id);
  }

  @Get('/vnpay_return')
  @Redirect('/profile') // Redirect về trang lịch sử đặt phòng của user
  async vnpayReturn(@Query() query: any) {
    const { vnp_TxnRef, vnp_ResponseCode } = query;

    if (vnp_ResponseCode === '00') {
      // Thanh toán thành công
      await this.paymentService.updateBookingStatus(vnp_TxnRef);
      return { url: '/profile?status=success' };
    } else {
      // Thanh toán thất bại
      return { url: '/profile?status=failure' };
    }
  }
  // Endpoint để tạo URL thanh toán
  @Get('vnpay-url/:bookingId')
  async getVnpayUrl(@Param('bookingId') bookingId: string) {
    const amount = await this.paymentService.getBookingAmount(bookingId);
    return this.paymentService.createPaymentUrl(bookingId, amount);
  }
}
