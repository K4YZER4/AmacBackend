import { Controller } from '@nestjs/common';
import { NewsService } from './news.service.js';

@Controller('news')
export class NewsController {
  constructor(private readonly newsService: NewsService) {}
}
