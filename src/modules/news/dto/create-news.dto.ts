import { IsBoolean, IsDateString, IsIn, IsNotEmpty, IsOptional, IsString, Matches } from 'class-validator';

const categoryValues = ['donation', 'missing', 'event', 'raffle', 'announcement'] as const;

export class CreateNewsDto {
  @IsString()
  @IsNotEmpty()
  @Matches(/\S/)
  title!: string;

  @IsString()
  @IsOptional()
  @Matches(/\S/)
  slug?: string;

  @IsString()
  @IsNotEmpty()
  @Matches(/\S/)
  @IsIn(categoryValues)
  category!: string;

  @IsString()
  @IsNotEmpty()
  @Matches(/\S/)
  summary!: string;

  @IsString()
  @IsOptional()
  @Matches(/\S/)
  content?: string;

  @IsString()
  @IsOptional()
  @Matches(/\S/)
  imageUrl?: string;

  @IsDateString()
  @IsOptional()
  eventDate?: string;

  @IsBoolean()
  @IsOptional()
  published?: boolean;
}
