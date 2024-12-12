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
  UseGuards,
} from '@nestjs/common';
import { BookingService } from './booking.service';
import { CreateBookingDto } from './dto/booking-create.dto';
import { UpdateBookingDto } from './dto/booking-update.dto';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';
import { PaymentService } from './payment.service';
import { JwtAuthGuard } from 'src/auth/guards/local.guard';
import { AuthGuard } from '@nestjs/passport';
import { Roles } from 'src/common/decorater/roles.decorater';
import { Public } from 'src/common/decorater/public.decorater';

@ApiBearerAuth('Bearer')
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
    try {
      return await this.bookingService.create(createBookingDto);
    } catch (error) {
      return {
        statusCode: 400,
        message: `Failed to create booking: ${error.message}`,
      };
    }
  }

  // @UseGuards(AuthGuard('protected'))
  @Roles('ADMIN')
  @Get()
  @ApiOperation({ summary: 'Get all bookings' })
  async findAll() {
    try {
      return this.bookingService.findAll();
    } catch (error) {
      return {
        statusCode: 400,
        message: `Failed to get all bookings: ${error.message}`,
      };
    }
  }

  @Roles('ADMIN')
  @Get('booking-pagination')
  @ApiOperation({ summary: 'Get all bookings with pagination' })
  async findAllPagination(
    @Query('pageIndex') pageIndex: string, // Nhận giá trị pageIndex từ Query Params
    @Query('pageTake') pageTake: string, // Nhận giá trị pageTake từ Query Params
  ) {
    try {
      // Nếu giá trị không phải số, mặc định là trang 1 và lấy 10 người dùng
      const pageIndexNumber = isNaN(parseInt(pageIndex))
        ? 1
        : parseInt(pageIndex);
      const pageTakeNumber = isNaN(parseInt(pageTake))
        ? 10
        : parseInt(pageTake);
      return await this.bookingService.findAllPagination(
        pageIndexNumber,
        pageTakeNumber,
      );
    } catch (error) {
      return {
        statusCode: 500,
        message: `Failed to paginate booking: ${error.message}`,
      };
    }
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get a booking by id' })
  async findOne(@Param('id') id: string) {
    try {
      return this.bookingService.findOne(id);
    } catch (error) {
      return {
        statusCode: 400,
        message: `Failed to get booking by id ${id}: ${error}`,
      };
    }
  }

  @Get('user/:userId')
  @ApiOperation({ summary: 'Get all bookings by user id' })
  async findByUserId(@Param('userId') userId: string) {
    try {
      return await this.bookingService.findByUserId(userId);
    } catch (error) {
      return {
        statusCode: 400,
        message: `Failed to get booking by user id ${userId}: ${error}`,
      };
    }
  }

  @Roles('ADMIN')
  @Put(':id')
  @ApiOperation({ summary: 'Update a booking by id' })
  async update(
    @Param('id') id: string,
    @Body() updateBookingDTO: UpdateBookingDto,
  ) {
    try {
      return this.bookingService.update(id, updateBookingDTO);
    } catch (error) {
      return {
        statusCode: 400,
        message: `Failed to update booking by id ${id}: ${error}`,
      };
    }
  }

  @Roles('ADMIN')
  @Delete(':id')
  @ApiOperation({ summary: 'Delete a booking by id' })
  async remove(@Param('id') id: string) {
    try {
      return await this.bookingService.remove(id);
    } catch (error) {
      return {
        statusCode: 400,
        message: `Failed to delete booking by id ${id}: ${error}`,
      };
    }
  }

  // Endpoint để tạo URL thanh toán
  @Get('vnpay-url/:bookingId')
  async getVnpayUrl(@Param('bookingId') bookingId: string) {
    try {
      const amount = await this.paymentService.getBookingAmount(bookingId);
      return this.paymentService.createPaymentUrl(bookingId, amount);
    } catch (error) {
      return {
        statusCode: 400,
        message: `Failed to get vnpay url: ${error}`,
      };
    }
  }
}
