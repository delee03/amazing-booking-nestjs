import { Injectable, UnauthorizedException, Inject } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { ConfigService } from '@nestjs/config';
import { Logger } from 'winston';
import { JwtPayload } from '../interfaces/jwt-payload.interface';
import { AuthException } from '../exceptions/auth.exception';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
    constructor(
        private configService: ConfigService,
        @Inject('Logger') private readonly logger: Logger
    ) {
        super({
            jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
            ignoreExpiration: false,
            secretOrKey: configService.get<string>('JWT_SECRET'),
        });
    }

    async validate(payload: JwtPayload) {
        try {
            if (!payload || !payload.sub || !payload.email) {
                throw new AuthException('Invalid token payload');
            }
            this.logger.info('JWT Strategy Validate', { sub: payload.sub });
            return payload;
        } catch (error) {
            this.logger.error('Error in JWT Strategy Validate', { error });
            throw new AuthException('Unauthorized');
        }
    }
}