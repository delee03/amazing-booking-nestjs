import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
} from '@nestjs/common';
import { RatingService } from './rating.service';
import { CreateRatingDto } from './dto/create-rating.dto';
import { UpdateRatingDto } from './dto/update-rating.dto';
import { ApiTags, ApiOperation } from '@nestjs/swagger';

@ApiTags('ratings')
@Controller('ratings')
export class RatingController {
  constructor(private readonly ratingService: RatingService) {}

  @Post()
  @ApiOperation({ summary: 'Create a new rating' })
  async create(@Body() createRatingDto: CreateRatingDto) {
    const createNew = await this.ratingService.create(createRatingDto);
    return {
      statusCode: 201,
      message: 'Bạn đã tạo đánh giá thành công',
      content: createNew,
    };
  }

  @Get()
  @ApiOperation({ summary: 'Get all ratings' })
  async findAll() {
    return await this.ratingService.findAll();
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get rating by ID' })
  async findOne(@Param('id') id: string) {
    return await this.ratingService.findOne(id);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Update rating by ID' })
  async update(
    @Param('id') id: string,
    @Body() updateRatingDto: UpdateRatingDto,
  ) {
    return await this.ratingService.update(id, updateRatingDto);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Delete rating by ID' })
  async remove(@Param('id') id: string) {
    return await this.ratingService.remove(id);
  }

  // Lấy tất cả ratings theo roomId
  @Get('/room/:roomId')
  @ApiOperation({ summary: 'Get all ratings by room ID' })
  async findAllByRoomId(@Param('roomId') roomId: string) {
    const allRatingByRoom = await this.ratingService.findAllByRoomId(roomId);
    return {
      statusCode: 200,
      message: `All ratings by room id ${roomId} retrieved successfully`,
      content: allRatingByRoom,
    };
  }

  //lấy tất cả rating theo userId
  @Get('/user/:userId')
  @ApiOperation({ summary: 'Get all ratings by user ID' })
  async findAllByUserId(@Param('userId') userId: string) {
    const allRatingUser = await this.ratingService.findAllByUserId(userId);
    return {
      statusCode: 200,
      message: `All ratings by user id ${userId} retrieved successfully`,
      content: allRatingUser,
    };
  }
}
