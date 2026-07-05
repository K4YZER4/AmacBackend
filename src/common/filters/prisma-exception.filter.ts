import { Catch, ArgumentsHost } from '@nestjs/common';
import { BaseExceptionFilter } from '@nestjs/core';
import { Prisma } from '@prisma/client';
import { Response } from 'express';
import { EXCEPTION_CODES } from '../exceptions/exception-codes.exceptions.js';

@Catch(Prisma.PrismaClientKnownRequestError)
export class PrismaExceptionFilter extends BaseExceptionFilter {
  catch(exception: Prisma.PrismaClientKnownRequestError, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();

    switch (exception.code) {
      case 'P2025':
        response.status(404).json({
          statusCode: 404,
          code: EXCEPTION_CODES.RESOURCE_NOT_FOUND,
          message: 'The requested resource was not found.',
        });
        return;
      case 'P2002':
        response.status(409).json({
          statusCode: 409,
          code: EXCEPTION_CODES.RESOURCE_ALREADY_EXISTS,
          message: 'A record with this value already exists.',
        });
        return;
      default:
        super.catch(exception, host);
    }
  }
}
