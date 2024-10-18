import { ExecutionContext, Injectable, UnauthorizedException, Body } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { Observable } from 'rxjs';

@Injectable()
export class LocalGuard extends AuthGuard('local') {
  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest();
    console.log('Inside Local Guard canActivate');
    console.log('Request Body:', request.body);
    console.log('Request Headers:', request.headers);
    const result = (await super.canActivate(context)) as boolean;
    if (!result) {
      console.log('Local Guard canActivate result:', result);
    }
    return result;
  }

  handleRequest(err: any, user: any, info: any) {
    console.log('LocalAuthGuard handleRequest', {
      hasError: !!err,
      errorMessage: err?.message,
      hasUser: !!user,
      info: info
    });

    if (err || !user) {
      const message = err?.message || info?.message || 'Authentication failed';
      console.log('Authentication failed:', message);
      throw new UnauthorizedException(message);
    }

    return user;
  }
}