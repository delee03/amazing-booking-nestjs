import { Injectable, UnauthorizedException, Inject } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { ConfigService } from '@nestjs/config';
import { Logger } from 'winston';
import { JwtPayload } from '../interface/jwt-payload.interface';
import { AuthException } from '../exception/auth.exception';
import { PrismaService } from 'src/Prisma/prisma.service';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy, 'protected') {
  constructor(
    private configService: ConfigService,
    private prisma: PrismaService,
  ) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: configService.get<string>('JWT_SECRET'),
    });
    console.log({ secretOrKey: configService.get<string>('JWT_SECRET') });
  }

  async validate(payload: JwtPayload) {
    console.log('validate');

    // if (!payload || !payload.sub || !payload.email) {
    //   throw new AuthException('Invalid token payload');
    // }

    console.log({ payload });
    const user = await this.prisma.user.findUnique({
      where: {
        id: payload.id,
      },
      select: {
        id: true,
        email: true,
        name: true,
        avatar: true,
        birthday: true,
        phone: true,
        gender: true,
        role: true,
      },
    });
    if (!user) {
      throw new UnauthorizedException('Unauthorized');
    }

    return user;
  }
}
