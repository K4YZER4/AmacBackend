import { Injectable } from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { PrismaService } from '../../prisma/prisma.service.js';
import { CreateAnimalDto } from './dto/create-animal.dto.js';
import { UpdateAnimalDto } from './dto/update-animal.dto.js';
import { EXCEPTION_CODES } from '../../common/exceptions/exception-codes.exceptions.js';
import { NotFoundAppException } from '../../common/exceptions/catalog-exception.js';
@Injectable()
export class AdoptionService {
  constructor(private readonly prisma: PrismaService) {}

  async findAll(filters?: { species?: string; status?: string }) {
    const animals = await this.prisma.animal.findMany({
      where: {
        deletedAt: null,
        ...(filters?.species && { species: filters.species }),
        ...(filters?.status && { status: filters.status }),
      },
      include: { images: true },
      orderBy: { createdAt: 'desc' },
    });
    return animals;
  }

  async findOne(id: bigint) {
    return await this.checkIfAnimalExists(id, { images: true });
  }

  async create(dto: CreateAnimalDto) {
    return this.prisma.animal.create({
      data: {
        name: dto.name,
        species: dto.species,
        ...(dto.breed !== undefined && { breed: dto.breed }),
        ...(dto.sex !== undefined && { sex: dto.sex }),
        ...(dto.ageMonths !== undefined && { ageMonths: dto.ageMonths }),
        ...(dto.size !== undefined && { size: dto.size }),
        ...(dto.color !== undefined && { color: dto.color }),
        ...(dto.weightKg !== undefined && { weightKg: dto.weightKg }),
        ...(dto.description !== undefined && { description: dto.description }),
        ...(dto.healthNotes !== undefined && { healthNotes: dto.healthNotes }),
        ...(dto.intakeDate !== undefined && { intakeDate: dto.intakeDate }),
        ...(dto.isVaccinated !== undefined && { isVaccinated: dto.isVaccinated }),
        ...(dto.isNeutered !== undefined && { isNeutered: dto.isNeutered }),
        ...(dto.isDewormed !== undefined && { isDewormed: dto.isDewormed }),
        ...(dto.status !== undefined && { status: dto.status }),
        ...(dto.published !== undefined && { published: dto.published }),
      },
    });
  }

  async update(id: bigint, dto: UpdateAnimalDto) {
    await this.checkIfAnimalExists(id);
    return this.prisma.animal.update({
      where: { id, deletedAt: null },
      data: {
        ...(dto.name !== undefined && { name: dto.name }),
        ...(dto.species !== undefined && { species: dto.species }),
        ...(dto.breed !== undefined && { breed: dto.breed }),
        ...(dto.sex !== undefined && { sex: dto.sex }),
        ...(dto.ageMonths !== undefined && { ageMonths: dto.ageMonths }),
        ...(dto.size !== undefined && { size: dto.size }),
        ...(dto.color !== undefined && { color: dto.color }),
        ...(dto.weightKg !== undefined && { weightKg: dto.weightKg }),
        ...(dto.description !== undefined && { description: dto.description }),
        ...(dto.healthNotes !== undefined && { healthNotes: dto.healthNotes }),
        ...(dto.intakeDate !== undefined && { intakeDate: dto.intakeDate }),
        ...(dto.isVaccinated !== undefined && { isVaccinated: dto.isVaccinated }),
        ...(dto.isNeutered !== undefined && { isNeutered: dto.isNeutered }),
        ...(dto.isDewormed !== undefined && { isDewormed: dto.isDewormed }),
        ...(dto.status !== undefined && { status: dto.status }),
        ...(dto.published !== undefined && { published: dto.published }),
      },
    });
  }

  async remove(id: bigint) {
    await this.checkIfAnimalExists(id);
    return this.prisma.animal.update({
      where: { id, deletedAt: null },
      data: { deletedAt: new Date() },
    });
  }
  private async checkIfAnimalExists(id: bigint, include?: Prisma.AnimalInclude) {
    const animal = await this.prisma.animal.findFirst({
      where: { id, deletedAt: null },
      include,
    });
    if (!animal) {
      throw new NotFoundAppException({
        code: EXCEPTION_CODES.RESOURCE_NOT_FOUND,
        message: `Animal with id ${id} not found or has been deleted.`,
      });
    }
    return animal;
  }
}
