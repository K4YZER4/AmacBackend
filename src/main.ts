import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module.js';
import { requestIdMiddleware } from './common/middlewares/request-id.middleware.js';
async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.use(requestIdMiddleware);
  await app.listen(process.env.PORT ?? 3000);
}
bootstrap();
