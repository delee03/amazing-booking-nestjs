import { ApiProperty } from '@nestjs/swagger';
import {
  IsString,
  IsEmail,
  IsDateString,
  IsBoolean,
  IsOptional,
} from 'class-validator';
import { Datetime } from 'aws-sdk/clients/costoptimizationhub';
import { Type } from 'class-transformer';

export class CreateUserDto {
  @ApiProperty({ description: 'User name' })
  name: string;

  @ApiProperty({ description: 'User email' })
  email: string;

  @ApiProperty({
    description: 'User birthday in ISO string format',
    required: false,
  })
  @IsOptional()
  @IsDateString()
  birthday?: Date;

  @ApiProperty({ description: 'User gender' })
  @IsBoolean()
  gender: boolean;

  @ApiProperty({ description: 'User phone number' })
  @IsString()
  phone: string;

  @ApiProperty({ description: 'User password' })
  password: string;

  @ApiProperty({ description: 'Avatar URL (optional)', required: false })
  avatar?: string;

  @ApiProperty({ description: 'User role', default: 'USER' })
  role: 'USER' | 'ADMIN';
}
