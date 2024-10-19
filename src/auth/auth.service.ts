import { Injectable, Inject } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { Logger } from 'winston';
import { JwtPayload } from './interfaces/jwt-payload.interface';
import { AuthException } from './exceptions/auth.exception';
import * as bcrypt from 'bcrypt';
import { PrismaService } from '../Prisma/prisma.service';
import { Role, User } from '@prisma/client';
import { SignInDto } from './dto/sign-in.dto';
import { SignUpDto, UserRole } from './dto/sign-up.dto';

@Injectable()
export class AuthService {
  constructor(
    private jwtService: JwtService,
    @Inject('Logger') private readonly logger: Logger,
    private prisma: PrismaService,
  ) {}

  // Hàm thực hiện xác thực user
  // Trả về user nếu user hợp lệ
  async validateUser(email: string, password: string): Promise<User> {
    try {
      const user = await this.findUserByEmail(email);
      console.log(
        'User found in validateUser:',
        user ? user.email : 'Validate: Not found User',
      );
      // So sánh password đã hash trong database với password người dùng nhập vào
      if (user) {
        console.log('Comparing passwords');
        const isPasswordValid = await bcrypt.compare(password, user.password);
        console.log('Password valid:', isPasswordValid ? 'Yes' : 'No');
        // Nếu password hợp lệ thì trả về user
        if (isPasswordValid) {
          console.log('Password match:' + user.email + ' is validated');
          return user;
        } else {
          throw new AuthException('Mật khẩu không đúng!');
        }
      } else {
        throw new AuthException('Không tìm thấy người dùng với email này');
      }
    } catch (error) {
      this.logger.error('Error during user validation', { error });
      throw new AuthException('User validation failed');
    }
  }

  async signIn(
    signInDto: SignInDto,
  ): Promise<{
    statusCode: number;
    content: any;
    token: string;
    dateTime: string;
  }> {
    try {
      const { email, password } = signInDto;
      const user = await this.validateUser(email, password);
      if (!user) {
        throw new AuthException('Email hoặc mật khẩu không đúng !');
      }
      const fullUser = await this.prisma.user.findUnique({
        where: { email },
        // Không trả về mật khẩu
        select: {
          id: true,
          name: true,
          email: true,
          password: false,
          birthday: true,
          avatar: true,
          gender: true,
          role: true,
        },
      });
      if (!fullUser) {
        throw new AuthException('Không tìm thấy người dùng với email này');
      }
      if (!user) {
        throw new AuthException('Email hoặc mật khẩu không đúng !');
      }
      const payload: JwtPayload = { email: user.email, sub: user.id };
      console.log(
        'Payload: Mail(' + payload.email + ') With id:' + payload.sub,
      );

      // Update last login

      // await this.prisma.user.update({
      //   where: { email: user.email },
      //   data: { lastLogin: new Date()

      //   },
      // });

      console.log('Signing in... Creating token');
      const token = this.jwtService.sign(payload);

      return {
        statusCode: 200,
        content: {
          user: {
            id: user.id,
            name: user.name,
            email: user.email,
            phone: user.phone,
            password: '', // Không trả về mật khẩu
            birthday: user.birthday,
            avatar: user.avatar,
            gender: user.gender,
            role: user.role,
          },
        },
        token: token,
        dateTime: new Date().toISOString(),
      };
    } catch (error) {
      this.logger.error('Error during sign in', { error });
      throw new AuthException('Email hoặc mật khẩu không đúng !');
    }
  }

  async signUp(signUpDto: SignUpDto): Promise<Omit<User, 'password'>> {
    try {
      // Kiểm tra user có tồn tại trong database chưa?
      const existingUser = await this.findUserByEmail(signUpDto.email);
      if (existingUser) {
        throw new AuthException('Tài khoản đã tồn tại. Thực hiện đăng nhập?');
      }

      // Hash password với bcrypt(Aglorithm: 10) => 2^10 rounds
      const hashedPassword = await bcrypt.hash(signUpDto.password, 10);
      const newUser = await this.prisma.user.create({
        data: {
          email: signUpDto.email,
          name: signUpDto.name,
          phone: signUpDto.phone,
          avatar: null,
          role: signUpDto.role,
          password: hashedPassword,
          birthday: new Date(signUpDto.birthday),
          gender: signUpDto.gender,
        },
      });

      const finalUser = await this.findUserByEmail(newUser.email);
      if (!finalUser) {
        throw new AuthException('Đăng ký tài khoản thất bại!');
      }

      return {
        id: finalUser.id,
        email: finalUser.email,
        name: finalUser.name,
        phone: finalUser.phone,
        avatar: finalUser.avatar,
        role: finalUser.role as unknown as UserRole, // Map Role tới UserRole
        birthday: finalUser.birthday,
        gender: finalUser.gender,
      };
    } catch (error) {
      this.logger.error('Error during sign up', {
        error: error.message,
        stack: error.stack,
      });
      throw new AuthException('Đăng ký tài khoản thất bại!');
    }
  }

  async verifyToken(token: string): Promise<JwtPayload> {
    try {
      const payload = await this.jwtService.verifyAsync(token);
      return payload;
    } catch (error) {
      this.logger.error('Error during token verification', { error });
      throw new AuthException('Token không hợp lệ!');
    }
  }

  private async findUserByEmail(email: string) {
    const user = await this.prisma.user.findUnique({
      where: { email },
    });
    if (user) {
      console.log('FOUND: User found in findUserByEmail:', user.email);
    } else {
      console.log('NOT FOUND: User not found in findUserByEmail');
    }
    return user;
  }
}
