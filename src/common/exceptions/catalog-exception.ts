import { AppException } from './app.exceptions.js';

export interface AppExceptionOptions {
  code: string;
  message: string;
  details?: unknown;
  requestId?: string;
}

export class NotFoundAppException extends AppException {
  constructor({ code, message, details, requestId }: AppExceptionOptions) {
    super({
      statusCode: 404,
      code,
      message,
      details,
      requestId,
    });
  }
}
export class BadRequestAppException extends AppException {
  constructor({ code, message, details, requestId }: AppExceptionOptions) {
    super({
      statusCode: 400,
      code,
      message,
      details,
      requestId,
    });
  }
}
export class UnauthorizedAppException extends AppException {
  constructor({ code, message, details, requestId }: AppExceptionOptions) {
    super({
      statusCode: 401,
      code,
      message,
      details,
      requestId,
    });
  }
}
