import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service.js';
import { CreateNewsDto } from './dto/create-news.dto.js';
import { UpdateNewsDto } from './dto/update-news.dto.js';

function slugify(text: string): string {
  return text
    .toLowerCase()
    .trim()
    .replace(/[^\w\s-]/g, '')
    .replace(/[\s_]+/g, '-')
    .replace(/-+/g, '-')
    .replace(/^-+|-+$/g, '');
}

@Injectable()
export class NewsService {
  constructor(private readonly prisma: PrismaService) {}

  async findAll(filters?: { category?: string }) {
    return this.prisma.news.findMany({
      where: {
        deletedAt: null,
        ...(filters?.category && { category: filters.category }),
      },
      orderBy: { publishedAt: { sort: 'desc', nulls: 'last' } },
    });
  }

  async findOne(id: bigint) {
    return this.prisma.news.findFirst({
      where: { id, deletedAt: null },
    });
  }

  async create(dto: CreateNewsDto) {
    const slug = dto.slug || slugify(dto.title);
    return this.prisma.news.create({
      data: {
        title: dto.title,
        slug,
        category: dto.category,
        summary: dto.summary,
        ...(dto.content !== undefined && { content: dto.content }),
        ...(dto.imageUrl !== undefined && { imageUrl: dto.imageUrl }),
        ...(dto.eventDate !== undefined && { eventDate: dto.eventDate }),
        ...(dto.published !== undefined && { published: dto.published }),
        ...(dto.published && { publishedAt: new Date() }),
      },
    });
  }

  async update(id: bigint, dto: UpdateNewsDto) {
    const data: Record<string, unknown> = {};
    if (dto.title !== undefined) {
      data.title = dto.title;
      if (dto.slug !== undefined) {
        data.slug = dto.slug;
      }
    } else if (dto.slug !== undefined) {
      data.slug = dto.slug;
    }
    if (dto.category !== undefined) data.category = dto.category;
    if (dto.summary !== undefined) data.summary = dto.summary;
    if (dto.content !== undefined) data.content = dto.content;
    if (dto.imageUrl !== undefined) data.imageUrl = dto.imageUrl;
    if (dto.eventDate !== undefined) data.eventDate = dto.eventDate;
    if (dto.published !== undefined) {
      data.published = dto.published;
      if (dto.published) data.publishedAt = new Date();
    }

    return this.prisma.news.update({
      where: { id },
      data,
    });
  }

  async remove(id: bigint) {
    return this.prisma.news.update({
      where: { id },
      data: { deletedAt: new Date() },
    });
  }
}
