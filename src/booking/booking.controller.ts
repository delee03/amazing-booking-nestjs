import {
  Controller,
  Get,
  Post,
  Put,
  Body,
  Param,
  Delete,
  Patch,
} from '@nestjs/common';
import { BookingService } from './booking.service';
import { CreateBookingDto } from './dto/booking-create.dto';
import { UpdateBookingDto } from './dto/booking-update.dto';
import { ApiTags, ApiOperation } from '@nestjs/swagger';

@Controller('booking')
@ApiTags('booking')
export class BookingController {
  constructor(private readonly bookingService: BookingService) {}

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
}
