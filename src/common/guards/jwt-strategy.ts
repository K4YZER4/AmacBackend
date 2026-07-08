import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { Request } from 'express';
import { createHash } from 'crypto';
import { AuthService } from '../../modules/auth/auth.service.js';
import { env } from '../../config/env.config.js';
import { UnauthorizedAppException } from '../exceptions/catalog-exception.js';
import { EXCEPTION_CODES } from '../exceptions/exception-codes.exceptions.js';
interface JwtPayload {
  sub: string;
  email: string;
  role: string;
}

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(private readonly authService: AuthService) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: env.JWT_SECRET,
      passReqToCallback: true,
    });
  }

  async validate(req: Request, payload: JwtPayload) {
    const token = ExtractJwt.fromAuthHeaderAsBearerToken()(req);
    if (!token) {
      throw new UnauthorizedAppException({
        code: EXCEPTION_CODES.UNAUTHORIZED,
        message: 'Token no proporcionado',
      });
    }
    const tokenHash = createHash('sha256').update(token).digest('hex');
    return this.authService.validateUser(BigInt(payload.sub), tokenHash);
  }
}
