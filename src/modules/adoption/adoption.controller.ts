import { Controller } from '@nestjs/common';
import { AdoptionService } from './adoption.service.js';

@Controller('adoption')
export class AdoptionController {
  constructor(private readonly adoptionService: AdoptionService) {}
}
