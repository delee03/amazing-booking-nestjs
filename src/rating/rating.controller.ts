import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Query,
} from '@nestjs/common';
import { RatingService } from './rating.service';
import { CreateRatingDto } from './dto/create-rating.dto';
import { UpdateRatingDto } from './dto/update-rating.dto';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';
import { handleResponse } from 'src/common/handleRespsonse';

@ApiBearerAuth('Bearer')
@ApiTags('ratings')
@Controller('ratings')
export class RatingController {
  constructor(private readonly ratingService: RatingService) {}

  @Post()
  @ApiOperation({ summary: 'Create a new rating' })
  async create(@Body() createRatingDto: CreateRatingDto) {
    try {
      const createNew = await this.ratingService.create(createRatingDto);
      return {
        statusCode: 201,
        message: 'Bạn đã tạo đánh giá thành công',
        content: createNew,
      };
    } catch (error) {
      return {
        statusCode: 400,
        message: `Failed to create rating: ${error.message}`,
      };
    }
  }

  @Get()
  @ApiOperation({ summary: 'Get all ratings' })
  async findAll() {
    const allRatings = await this.ratingService.findAll();
    return handleResponse('Lấy tất cả ratings thành công', allRatings);
  }
  @Get('rating-pagination')
  @ApiOperation({ summary: 'Get all ratings with user & room successfully' })
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
      return await this.ratingService.findAllPagination(
        pageIndexNumber,
        pageTakeNumber,
      );
    } catch (error) {
      return {
        statusCode: 500,
        message: `Failed to paginate ratings: ${error.message}`,
      };
    }
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get rating by ID' })
  async findOne(@Param('id') id: string) {
    try {
      const ratingById = await this.ratingService.findOne(id);
      return handleResponse('Lấy dữ liệu ratingId thành công', ratingById);
    } catch (error) {
      return {
        statusCode: 400,
        message: `Failed to get rating by id ${id}: ${error}`,
      };
    }
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Update rating by ID' })
  async update(
    @Param('id') id: string,
    @Body() updateRatingDto: UpdateRatingDto,
  ) {
    try {
      const updatedRatingById = await this.ratingService.update(
        id,
        updateRatingDto,
      );
      return handleResponse(
        'Cập nhật dữ liệu ratingId thành công',
        updatedRatingById,
      );
    } catch (error) {
      return {
        statusCode: 400,
        message: `Failed to update rating by id ${id}: ${error}`,
      };
    }
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Delete rating by ID' })
  async remove(@Param('id') id: string) {
    try {
      const deletedRating = await this.ratingService.remove(id);
      return handleResponse('Xóa dữ liệu ratingId thành công', deletedRating);
    } catch (error) {
      return {
        statusCode: 400,
        message: `Failed to delete rating by id ${id}: ${error}`,
      };
    }
  }

  // Lấy tất cả ratings theo roomId
  @Get('/room/:roomId')
  @ApiOperation({ summary: 'Get all ratings by room ID' })
  async findAllByRoomId(@Param('roomId') roomId: string) {
    try {
      const allRatingByRoom = await this.ratingService.findAllByRoomId(roomId);
      return {
        statusCode: 200,
        message: `All ratings by room id ${roomId} retrieved successfully`,
        content: allRatingByRoom,
      };
    } catch (error) {
      return {
        statusCode: 400,
        message: `Failed to get all ratings by room id ${roomId}: ${error}`,
      };
    }
  }

  //lấy tất cả rating theo userId
  @Get('/user/:userId')
  @ApiOperation({ summary: 'Get all ratings by user ID' })
  async findAllByUserId(@Param('userId') userId: string) {
    try {
      const allRatingUser = await this.ratingService.findAllByUserId(userId);
      return {
        statusCode: 200,
        message: `All ratings by user id ${userId} retrieved successfully`,
        content: allRatingUser,
      };
    } catch (error) {
      return {
        statusCode: 400,
        message: `Failed to get all ratings by user id ${userId}: ${error}`,
      };
    }
  }
}
