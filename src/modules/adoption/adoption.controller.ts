import { Body, Controller, Delete, Get, Param, Patch, Post, Query } from '@nestjs/common';
import { AdoptionService } from './adoption.service.js';
import { CreateAnimalDto } from './dto/create-animal.dto.js';
import { UpdateAnimalDto } from './dto/update-animal.dto.js';

@Controller('adoption')
export class AdoptionController {
  constructor(private readonly adoptionService: AdoptionService) {}

  @Get()
  findAll(@Query('species') species?: string, @Query('status') status?: string) {
    return this.adoptionService.findAll({ species, status });
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.adoptionService.findOne(BigInt(id));
  }

  @Post()
  create(@Body() dto: CreateAnimalDto) {
    return this.adoptionService.create(dto);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() dto: UpdateAnimalDto) {
    return this.adoptionService.update(BigInt(id), dto);
  }
  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.adoptionService.remove(BigInt(id));
  }
}
