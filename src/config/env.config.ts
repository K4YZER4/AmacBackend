import { z } from 'zod';

function parseExpiresIn(value: string | undefined): number {
  if (!value) return 900;
  const match = value.match(/^(\d+)\s*([smhd])$/i);
  if (!match) return 900;
  const num = parseInt(match[1], 10);
  switch (match[2].toLowerCase()) {
    case 's':
      return num;
    case 'm':
      return num * 60;
    case 'h':
      return num * 3600;
    case 'd':
      return num * 86400;
    default:
      return 900;
  }
}

const envSchema = z.object({
  DATABASE_URL: z.string().url(),
  JWT_SECRET: z.string().min(1, 'JWT_SECRET es requerido'),
  JWT_EXPIRES_IN: z.string().default('15m').transform(parseExpiresIn),
  PORT: z.coerce.number().default(3000),
});

export const env = envSchema.parse(process.env);
