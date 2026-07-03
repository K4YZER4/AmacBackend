import { AppException } from './app.exceptions.js';

interface AppExceptionOptions {
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
