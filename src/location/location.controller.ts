import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Put,
} from '@nestjs/common';
import { LocationService } from './location.service';
import { CreateLocationDto } from './dto/create-location.dto';
import { UpdateLocationDto } from './dto/update-location.dto';
import {
  ApiOperation,
  ApiTags,
  ApiResponse,
  ApiBearerAuth,
} from '@nestjs/swagger';
import { handleResponse } from 'src/common/handleRespsonse';
import { Roles } from 'src/common/decorater/roles.decorater';

@ApiBearerAuth('Bearer')
@ApiTags('locations')
@Controller('locations')
export class LocationController {
  constructor(private readonly locationService: LocationService) {}

  @Roles('ADMIN')
  @Post()
  @ApiOperation({ summary: 'Create a new location' })
  @ApiResponse({
    status: 201,
    description: 'The location has been successfully created.',
  })
  async create(@Body() createLocationDto: CreateLocationDto) {
    try {
      const createdLocation =
        await this.locationService.create(createLocationDto);
      return handleResponse(
        'Tạo mới địa điểm thành công',
        createdLocation,
        201,
      );
    } catch (error) {
      return {
        statusCode: 400,
        message: `Failed to create location: ${error.message}`,
      };
    }
  }

  @Get()
  @ApiOperation({ summary: 'Get All Locations' })
  async findAll() {
    try {
      const getAllLocations = await this.locationService.findAll();
      return handleResponse(
        'Lấy tất cả địa điểm thành công',
        getAllLocations,
        200,
      );
    } catch (error) {
      return {
        statusCode: 400,
        message: `Failed to get all locations: ${error.message}`,
      };
    }
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get Location By Id' })
  async findOne(@Param('id') id: string) {
    try {
      const getLocationById = await this.locationService.findOne(id);
      return handleResponse(
        'Lấy địa điểm theo ID thành công',
        getLocationById,
        200,
      );
    } catch (error) {
      return {
        statusCode: 400,
        message: `Failed to get location by ID: ${error.message}`,
      };
    }
  }

  @Roles('ADMIN')
  @Put(':id')
  @ApiOperation({ summary: 'Update Location' })
  async update(
    @Param('id') id: string,
    @Body() updateLocationDto: UpdateLocationDto,
  ) {
    try {
      const updatedLocation = await this.locationService.update(
        id,
        updateLocationDto,
      );
      return handleResponse('Cập nhật địa điểm thành công', updatedLocation);
    } catch (error) {
      return {
        statusCode: 400,
        message: `Failed to update location: ${error.message}`,
      };
    }
  }

  @Delete(':id')
  @ApiResponse({
    status: 201,
    description: 'The  has been successfully deleted.',
  })
  @ApiOperation({ summary: 'Remove a Location' })
  async remove(@Param('id') id: string) {
    try {
      const deletedLocation = await this.locationService.remove(id);
      return handleResponse('Xóa địa điểm thành công', deletedLocation);
    } catch (error) {
      return {
        statusCode: 400,
        message: `Failed to delete location: ${error.message}`,
      };
    }
  }
}
