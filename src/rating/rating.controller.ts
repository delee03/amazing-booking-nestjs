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
import { handleResponse } from 'src/common/handleRespsonse';

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
    const allRatings = await this.ratingService.findAll();
    return handleResponse('Lấy tất cả ratings thành công', allRatings);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get rating by ID' })
  async findOne(@Param('id') id: string) {
    const ratingById = await this.ratingService.findOne(id);
    return handleResponse('Lấy dữ liệu ratingId thành công', ratingById);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Update rating by ID' })
  async update(
    @Param('id') id: string,
    @Body() updateRatingDto: UpdateRatingDto,
  ) {
    const updatedRatingById = await this.ratingService.update(
      id,
      updateRatingDto,
    );
    return handleResponse(
      'Cập nhật dữ liệu ratingId thành công',
      updatedRatingById,
    );
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Delete rating by ID' })
  async remove(@Param('id') id: string) {
    const deletedRating = await this.ratingService.remove(id);
    return handleResponse('Xóa dữ liệu ratingId thành công', deletedRating);
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
