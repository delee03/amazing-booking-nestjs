// src/auth/dto/google-token.dto.ts
import { ApiProperty } from '@nestjs/swagger';

export class GoogleTokenDto {
  @ApiProperty({ description: 'Google ID token returned from Google Sign-In' })
  token: string;
}
