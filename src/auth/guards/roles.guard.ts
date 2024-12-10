// import {
//   Injectable,
//   CanActivate,
//   ExecutionContext,
//   ForbiddenException,
// } from '@nestjs/common';
// import { Reflector } from '@nestjs/core';

// @Injectable()
// export class RolesGuard implements CanActivate {
//   constructor(private reflector: Reflector) {}

//   canActivate(context: ExecutionContext): boolean {
//     const request = context.switchToHttp().getRequest();
//     const user = request.user; // Lấy thông tin user từ JwtAuthGuard đã gắn vào request
//     const method = request.method; // Lấy HTTP method của request

//     // Các phương thức yêu cầu role ADMIN
//     const adminOnlyMethods = ['POST', 'PUT', 'DELETE', 'PATCH'];

//     // Kiểm tra role ADMIN cho các phương thức đặc biệt
//     if (adminOnlyMethods.includes(method) && user.role !== 'ADMIN') {
//       throw new ForbiddenException(
//         'You do not have permission to perform this action',
//       );
//     }

//     return true; // Cho phép truy cập
//   }
// }
