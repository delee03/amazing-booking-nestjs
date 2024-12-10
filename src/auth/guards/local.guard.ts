import {
  BadRequestException,
  ExecutionContext,
  ForbiddenException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { JsonWebTokenError, JwtService, TokenExpiredError } from '@nestjs/jwt';
import { AuthGuard } from '@nestjs/passport';
import { IS_PUBLIC_KEY } from 'src/common/decorater/public.decorater';
import { ROLES_KEY } from 'src/common/decorater/roles.decorater';

@Injectable()
export class JwtAuthGuard extends AuthGuard('protected') {
  constructor(private readonly reflector: Reflector) {
    super();
  }
  canActivate(context: ExecutionContext) {
    const isPublic = this.reflector.getAllAndOverride<boolean>(IS_PUBLIC_KEY, [
      context.getHandler(),
      context.getClass(),
    ]);
    if (isPublic) {
      return true;
    }

    return super.canActivate(context);
  }

  handleRequest(err: any, user: any, info: any, context: ExecutionContext) {
    console.log('request');
    console.log({
      err,
      user,
      info,
    });
    // You can throw an exception based on either "info" or "err" arguments

    if (info instanceof TokenExpiredError) {
      throw new UnauthorizedException('Token expired');
    }
    if (info instanceof JsonWebTokenError) {
      throw new UnauthorizedException('Invalid token');
    }
    if (err || !user) {
      throw new UnauthorizedException('Unauthorized');
    }
    // Lấy metadata từ decorator @Roles
    const reflector = this.reflector;
    const requiredRoles = reflector.getAllAndOverride<string[]>(ROLES_KEY, [
      context.getHandler(),
      context.getClass(),
    ]);

    if (requiredRoles && requiredRoles.length > 0) {
      console.log('Required Roles:', requiredRoles);
      console.log('User Role:', user.role);

      // Kiểm tra role của user
      if (!requiredRoles.includes(user.role)) {
        throw new ForbiddenException(
          'You do not have permission to perform this action',
        );
      }
    }

    return user; // Trả về user nếu tất cả điều kiện hợp lệ
  }
}
