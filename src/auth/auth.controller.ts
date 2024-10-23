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
import { LocalGuard } from './guards/local.guard';
import { JwtAuthGuard } from './guards/jwt.guard';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @UseGuards(LocalGuard)
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

  @Post('signup')
  async signUp(@Body() signUpDto: SignUpDto) {
    return this.authService.signUp(signUpDto);
  }

  //   @UseGuards(JwtAuthGuard)
  //   @Get('profile')
  //   getProfile(@Req() req: Request) {
  //     return req.user;
  //   }

  //   @Get('status')
  //   @UseGuards(JwtAuthGuard)
  //   status(@Req() req: Request) {
  //     console.log('Inside AuthController status method');
  //     console.log(req.user);
  //     return req.user;
  //   }
}
