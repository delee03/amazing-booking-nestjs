import { ApiProperty } from '@nestjs/swagger';

export class CreateUserDto {
  @ApiProperty({ description: 'User name' })
  name: string;

  @ApiProperty({ description: 'User email' })
  email: string;

  @ApiProperty({ description: 'User password' })
  password: string;

  @ApiProperty({ description: 'User phone number' })
  phone: string;

  @ApiProperty({ description: 'User birthday' })
  birthday: string;

  @ApiProperty({ description: 'User gender' })
  gender: boolean;

  @ApiProperty({ description: 'Avatar URL (optional)', required: false })
  avatar?: string;

  @ApiProperty({ description: 'User role', default: 'USER' })
  role: 'USER' | 'ADMIN';
}