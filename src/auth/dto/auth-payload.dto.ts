import { IsString, IsEmail } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class AuthPayloadDto {
    @ApiProperty({ description: 'User ID' })
    @IsString()
    id: string;

    @ApiProperty({ description: 'User email' })
    @IsString()
    @IsEmail()
    email: string;
}