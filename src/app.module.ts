import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AdoptionModule } from './adoption/adoption.module';
import { AdoptionModule } from './modules/adoption/adoption.module';
import { NewsModule } from './modules/news/news.module';
import { NewsModule } from './news/news.module';
import { AdoptionModule } from './adoption/adoption.module';

@Module({
  imports: [AdoptionModule, NewsModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
