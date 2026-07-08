import { Injectable } from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { PrismaService } from '../../prisma/prisma.service.js';
import { CreateNewsDto } from './dto/create-news.dto.js';
import { UpdateNewsDto } from './dto/update-news.dto.js';
import { EXCEPTION_CODES } from '../../common/exceptions/exception-codes.exceptions.js';
import {
  NotFoundAppException,
  BadRequestAppException,
} from '../../common/exceptions/catalog-exception.js';

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
    const news = await this.prisma.news.findFirst({
      where: { id, deletedAt: null },
    });
    if (!news) {
      throw new NotFoundAppException({
        code: EXCEPTION_CODES.RESOURCE_NOT_FOUND,
        message: `News with id ${id} not found or has been deleted.`,
      });
    }
    return news;
  }

  async create(dto: CreateNewsDto) {
    const slug = dto.slug || slugify(dto.title);

    const existingSlug = await this.prisma.news.findFirst({
      where: { slug, deletedAt: null },
    });
    if (existingSlug) {
      throw new BadRequestAppException({
        code: EXCEPTION_CODES.RESOURCE_ALREADY_EXISTS,
        message: `The slug "${slug}" is already in use.`,
      });
    }

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

    if (data.slug !== undefined) {
      const existingSlug = await this.prisma.news.findFirst({
        where: { slug: data.slug as string, deletedAt: null, NOT: { id } },
      });
      if (existingSlug) {
        throw new BadRequestAppException({
          code: EXCEPTION_CODES.RESOURCE_ALREADY_EXISTS,
          message: `The slug "${data.slug as string}" is already in use.`,
        });
      }
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

    try {
      return await this.prisma.news.update({
        where: { id, deletedAt: null },
        data,
      });
    } catch (error) {
      if (error instanceof Prisma.PrismaClientKnownRequestError && error.code === 'P2025') {
        throw new NotFoundAppException({
          code: EXCEPTION_CODES.RESOURCE_NOT_FOUND,
          message: `News with id ${id} not found or has been deleted.`,
        });
      }
      throw error;
    }
  }

  async remove(id: bigint) {
    try {
      return await this.prisma.news.update({
        where: { id, deletedAt: null },
        data: { deletedAt: new Date() },
      });
    } catch (error) {
      if (error instanceof Prisma.PrismaClientKnownRequestError && error.code === 'P2025') {
        throw new NotFoundAppException({
          code: EXCEPTION_CODES.RESOURCE_NOT_FOUND,
          message: `News with id ${id} not found or has been deleted.`,
        });
      }
      throw error;
    }
  }
}
