import {
  Body,
  Controller,
  Get,
  HttpException,
  HttpStatus,
  Post,
  Req,
  UseGuards,
} from '@nestjs/common';
import { SignInDto } from './dto/sign-in.dto';
import { SignUpDto } from './dto/sign-up.dto';

import { AuthService } from './auth.service';
import { Request } from 'express';

import { GoogleTokenDto } from './dto/google-token.dto';
import { ApiTags } from '@nestjs/swagger';
import { Public } from 'src/common/decorater/public.decorater';

@ApiTags('authentication')
@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Public()
  @Post('signin')
  async signIn(@Req() req: Request, @Body() signInDto: SignInDto) {
    console.log('AuthController - Login endpoint hit', {
      body: {
        email: signInDto.email,
        hasPassword: !!signInDto.password,
      },
    });

    try {
      const result = await this.authService.signIn(signInDto);
      console.log('Login successful');
      return result;
    } catch (error) {
      console.error('Login failed:', error);
      throw error;
    }
  }
  @Public()
  @Post('signup')
  async signUp(@Body() signUpDto: SignUpDto) {
    return this.authService.signUp(signUpDto);
  }
  @Public()
  @Post('google')
  async googleLogin(@Body() googleToken: GoogleTokenDto) {
    return this.authService.googleLogin(googleToken.token);
  }
}
