import { PartialType } from '@nestjs/swagger';
import { CreateBookingDto } from './booking-create.dto';

export class UpdateBookingDto extends PartialType(CreateBookingDto) {}
