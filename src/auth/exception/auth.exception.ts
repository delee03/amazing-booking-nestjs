import { HttpException, HttpStatus } from '@nestjs/common';

export class AuthException extends HttpException {
  constructor(message: string) {
    super(
      {
        statusCode: HttpStatus.BAD_REQUEST,
        message: 'Yêu cầu không hợp lệ!',
        content: message,
        dateTime: new Date().toISOString(),
      },
      HttpStatus.BAD_REQUEST,
    );
  }
}
