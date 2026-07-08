import { Body, Controller, Delete, Get, Param, Patch, Post, Query } from '@nestjs/common';
import { NewsService } from './news.service.js';
import { CreateNewsDto } from './dto/create-news.dto.js';
import { UpdateNewsDto } from './dto/update-news.dto.js';
import { Auth } from '../../common/decorators/auth.decorator.js';

@Controller('news')
export class NewsController {
  constructor(private readonly newsService: NewsService) {}

  @Get()
  findAll(@Query('category') category?: string) {
    return this.newsService.findAll({ category });
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.newsService.findOne(BigInt(id));
  }

  @Post()
  @Auth()
  create(@Body() dto: CreateNewsDto) {
    return this.newsService.create(dto);
  }

  @Patch(':id')
  @Auth()
  update(@Param('id') id: string, @Body() dto: UpdateNewsDto) {
    return this.newsService.update(BigInt(id), dto);
  }

  @Delete(':id')
  @Auth()
  remove(@Param('id') id: string) {
    return this.newsService.remove(BigInt(id));
  }
}
