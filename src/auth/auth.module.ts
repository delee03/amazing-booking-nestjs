import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { JwtStrategy } from './strategies/jwt.strategy';
import { LocalStrategy } from './strategies/local.strategy';
import { LoggerModule } from './logger/logger.module';
import { JwtModule } from '@nestjs/jwt';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { PassportModule } from '@nestjs/passport';
import { PrismaModule } from '../Prisma/prisma.module';
import { PrismaService } from 'src/Prisma/prisma.service';

@Module({
  imports: [
    LoggerModule,
    PassportModule,
    ConfigModule.forRoot({ isGlobal: true }),
    JwtModule.registerAsync({
      imports: [ConfigModule],
      useFactory: async (configService: ConfigService) => {
        const jwtSecret = configService.get<string>('JWT_SECRET');

        // Validate JWT_SECRET
        if (!jwtSecret) {
          throw new Error('JWT_SECRET is not defined');
        } else if (jwtSecret.length < 32) {
          throw new Error('JWT_SECRET must be at least 32 characters long');
        } else if (jwtSecret.length > 64) {
          throw new Error('JWT_SECRET must be at most 64 characters long');
        }

        return {
          secret: Buffer.from(jwtSecret, 'base64').toString('utf-8'),
          signOptions: {
            expiresIn: configService.get<string>('JWT_EXPIRATION'),
          },
        };
      },
      inject: [ConfigService],
    }),
    PrismaModule,
  ],
  providers: [AuthService, JwtStrategy, LocalStrategy],
  controllers: [AuthController],
})
export class AuthModule {}
