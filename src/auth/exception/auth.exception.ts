import {
  HttpException,
  HttpStatus,
  ExceptionFilter,
  Catch,
  ArgumentsHost,
} from '@nestjs/common';

export class AuthException extends HttpException {
  constructor(message: string) {
    super(
      {
        statusCode: HttpStatus.BAD_REQUEST,
        message: message,
        content: message,
        dateTime: new Date().toISOString(),
      },
      HttpStatus.BAD_REQUEST,
    );
  }
}

// @Catch(AuthException)
// export class AuthExceptionFilter implements ExceptionFilter {
//   catch(exception: AuthException, host: ArgumentsHost) {
//     const ctx = host.switchToHttp();
//     const response = ctx.getResponse();
//     const status = exception.getStatus();

//     response.status(status).json({
//       statusCode: status,
//       message: exception.message,
//       error: exception.getResponse(),
//     });
//   }
// }
