import { ExceptionFilter, Catch, ArgumentsHost, HttpException } from '@nestjs/common';
import { Response, Request } from 'express';
import { EXCEPTION_CODES } from '../exceptions/exception-codes.exceptions.js';

@Catch(HttpException)
export class HttpExceptionFilter implements ExceptionFilter<HttpException> {
  catch(exception: HttpException, host: ArgumentsHost): void {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const request = ctx.getRequest<Request>();

    const status = exception.getStatus();
    const exceptionResponse = exception.getResponse();
    const requestId = (request as any).requestId;

    const body =
      typeof exceptionResponse === 'string'
        ? {
            statusCode: status,
            code: EXCEPTION_CODES.INTERNAL_ERROR,
            message: exceptionResponse,
            requestId,
          }
        : {
            ...exceptionResponse,
            requestId,
          };

    response.status(status).json(body);
  }
}
