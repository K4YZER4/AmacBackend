import { applyDecorators, UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from '../guards/jwt-auth.guard.js';

/**
 * @Auth()
 *
 * Decorador compuesto que protege una ruta.
 * Úsalo en vez de escribir @UseGuards(JwtAuthGuard) cada vez.
 *
 * Ejemplo:
 *   @Post()
 *   @Auth()
 *   crear(@Body() dto) { ... }
 */
export const Auth = () => applyDecorators(UseGuards(JwtAuthGuard));
