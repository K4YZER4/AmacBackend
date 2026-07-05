import { Module } from '@nestjs/common';
import { AppController } from './app.controller.js';
import { AppService } from './app.service.js';
import { PrismaModule } from './prisma/prisma.module.js';
import { AdoptionModule } from './modules/adoption/adoption.module.js';
import { NewsModule } from './modules/news/news.module.js';
@Module({
  imports: [PrismaModule, AdoptionModule, NewsModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
