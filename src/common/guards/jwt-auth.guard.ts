import { Injectable } from '@nestjs/common';
import { UnauthorizedAppException } from '../exceptions/catalog-exception.js';
import { EXCEPTION_CODES } from '../exceptions/exception-codes.exceptions.js';
import { AuthGuard } from '@nestjs/passport';
import { JsonWebTokenError, TokenExpiredError } from '@nestjs/jwt';

@Injectable()
export class JwtAuthGuard extends AuthGuard('jwt') {
  handleRequest<TUser = any>(err: any, user: TUser, info: Error | null): TUser {
    if (err || !user) {
      if (info instanceof TokenExpiredError) {
        throw new UnauthorizedAppException({
          code: EXCEPTION_CODES.TOKEN_EXPIRED,
          message: 'Token expirado',
        });
      }
      if (info instanceof JsonWebTokenError) {
        throw new UnauthorizedAppException({
          code: EXCEPTION_CODES.INVALID_TOKEN,
          message: 'Token inválido',
        });
      }
      throw (
        err ||
        new UnauthorizedAppException({
          code: EXCEPTION_CODES.UNAUTHORIZED,
          message: 'No autorizado',
        })
      );
    }
    return user;
  }
}
