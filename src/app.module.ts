import { Module } from '@nestjs/common';
import { APP_FILTER } from '@nestjs/core';
import { AppController } from './app.controller.js';
import { AppService } from './app.service.js';
import { PrismaModule } from './prisma/prisma.module.js';
import { AdoptionModule } from './modules/adoption/adoption.module.js';
import { NewsModule } from './modules/news/news.module.js';
import { PrismaExceptionFilter } from './common/filters/prisma-exception.filter.js';
@Module({
  imports: [PrismaModule, AdoptionModule, NewsModule],
  controllers: [AppController],
  providers: [
    AppService,
    {
      provide: APP_FILTER,
      useClass: PrismaExceptionFilter,
    },
  ],
})
export class AppModule {}
