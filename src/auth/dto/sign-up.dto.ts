import {
  IsString,
  IsEmail,
  IsNotEmpty,
  IsBoolean,
  IsDateString,
  isString,
  IsEnum,
  IsOptional,
} from 'class-validator';

export enum UserRole {
  USER = 'USER',
  ADMIN = 'ADMIN',
}
import { ApiProperty } from '@nestjs/swagger';

export class SignUpDto {
  @ApiProperty({ description: 'User name' })
  @IsString()
  @IsNotEmpty()
  name: string;

  @ApiProperty({ description: 'User email' })
  @IsString()
  @IsEmail()
  @IsNotEmpty()
  email: string;

  @ApiProperty({ description: 'User password' })
  @IsString()
  @IsNotEmpty()
  password: string;

  @ApiProperty({ description: 'User phone number' })
  @IsString()
  @IsNotEmpty()
  phone: string;

  @ApiProperty({ description: 'User avatar' })
  @IsString()
  avatar: string;

  @ApiProperty({ description: 'User birthday' })
  @IsDateString()
  birthday: string;

  @ApiProperty({ description: 'User gender' })
  @IsBoolean()
  gender: boolean;

  @ApiProperty({
    description: 'User role',
    required: false,
    default: UserRole.USER,
  })
  @IsEnum(UserRole)
  @IsOptional()
  role: UserRole = UserRole.USER; // default: 'USER'
}
