import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { createHash } from 'crypto';
import { PrismaService } from '../../prisma/prisma.service.js';

@Injectable()
export class AuthService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly jwtService: JwtService,
  ) {}

  async login(email: string, password: string) {
    const user = await this.prisma.user.findFirst({
      where: { email, deletedAt: null },
    });
    if (!user) {
      throw new UnauthorizedException('Credenciales inválidas');
    }
    const passwordValid: boolean = await bcrypt.compare(password, user.passwordHash);
    if (!passwordValid) {
      throw new UnauthorizedException('Credenciales inválidas');
    }
    const payload = { sub: user.id.toString(), email: user.email, role: user.role };
    const accessToken = this.jwtService.sign(payload);

    const tokenHash = createHash('sha256').update(accessToken).digest('hex');
    await this.prisma.adminSession.create({
      data: {
        userId: user.id,
        tokenHash,
        expiresAt: new Date(Date.now() + 24 * 60 * 60 * 1000),
      },
    });

    return {
      accessToken,
      user: {
        id: user.id,
        fullName: user.fullName,
        email: user.email,
        role: user.role,
      },
    };
  }

  async validateUser(userId: bigint, tokenHash: string) {
    const session = await this.prisma.adminSession.findUnique({
      where: { tokenHash },
      include: { user: true },
    });
    if (!session || session.revokedAt || session.expiresAt < new Date()) {
      throw new UnauthorizedException('Sesión inválida o expirada');
    }
    if (session.userId !== userId) {
      throw new UnauthorizedException('Token no corresponde al usuario');
    }
    if (session.user.deletedAt) {
      throw new UnauthorizedException('Usuario eliminado');
    }
    return session.user;
  }
}
