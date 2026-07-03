import { Module } from '@nestjs/common';
import { AdoptionService } from './adoption.service.js';
import { AdoptionController } from './adoption.controller.js';

@Module({
  controllers: [AdoptionController],
  providers: [AdoptionService],
})
export class AdoptionModule {}
