import { HttpException } from '@nestjs/common';

export interface AppExceptionOptions {
  code: string;
  message: string;
  statusCode: number;
  field?: string;
  details?: unknown;
  requestId?: string;
}

export class AppException extends HttpException {
  constructor({ code, message, statusCode, field, details, requestId }: AppExceptionOptions) {
    super(
      {
        statusCode,
        code,
        message,
        field,
        details,
        requestId,
      },
      statusCode,
    );
  }
}
