import { PassportStrategy } from '@nestjs/passport';
import { Strategy } from 'passport-local';
import { AuthService } from '../auth.service';
import { Injectable, UnauthorizedException } from '@nestjs/common';

@Injectable()
export class LocalStrategy extends PassportStrategy(Strategy) {
  constructor(private authService: AuthService) {
    super({ usernameField: 'email' });
  }

  async validate(email: string, password: string) {
    console.log('Inside Local Strategy Validate: ', email);
    const user = await this.authService.validateUser(email, password);
    if (!user) {
      console.log('User not found !!\n');
      throw new UnauthorizedException();
    }
    console.log('User validated: ', user.email);
    return user;
  }
}
