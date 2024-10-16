import { ApiProperty } from '@nestjs/swagger';

export class CreateUserDto {
  @ApiProperty({ description: 'User name' })
  name: string;

  @ApiProperty({ description: 'User email' })
  email: string;

  @ApiProperty({ description: 'User password' })
  password: string;

  @ApiProperty({ description: 'Avatar URL (optional)', required: false })
  avatar?: string;

  @ApiProperty({ description: 'User role', default: 'USER' })
  role: 'USER' | 'ADMIN';
}
