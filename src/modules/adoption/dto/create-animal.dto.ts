import {
  IsBoolean,
  IsDateString,
  IsIn,
  IsInt,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
  Matches,
  Min,
} from 'class-validator';

const speciesValues = ['dog', 'cat', 'other'] as const;
const sexValues = ['male', 'female', 'unknown'] as const;
const sizeValues = ['small', 'medium', 'large'] as const;
const statusValues = ['available', 'in_process', 'adopted', 'unavailable'] as const;

export class CreateAnimalDto {
  @IsString()
  @IsNotEmpty()
  @Matches(/\S/)
  name!: string;

  @IsString()
  @IsNotEmpty()
  @Matches(/\S/)
  @IsIn(speciesValues)
  species!: string;

  @IsString()
  @IsOptional()
  @Matches(/\S/)
  breed?: string;

  @IsString()
  @IsOptional()
  @IsIn(sexValues)
  sex?: string;

  @IsInt()
  @IsOptional()
  @Min(0)
  ageMonths?: number;

  @IsString()
  @IsOptional()
  @IsIn(sizeValues)
  size?: string;

  @IsString()
  @IsOptional()
  @Matches(/\S/)
  color?: string;

  @IsNumber()
  @IsOptional()
  @Min(0)
  weightKg?: number;

  @IsString()
  @IsOptional()
  @Matches(/\S/)
  description?: string;

  @IsString()
  @IsOptional()
  @Matches(/\S/)
  healthNotes?: string;

  @IsDateString()
  @IsOptional()
  intakeDate?: string;

  @IsBoolean()
  @IsOptional()
  isVaccinated?: boolean;

  @IsBoolean()
  @IsOptional()
  isNeutered?: boolean;

  @IsBoolean()
  @IsOptional()
  isDewormed?: boolean;

  @IsString()
  @IsOptional()
  @IsIn(statusValues)
  status?: string;

  @IsBoolean()
  @IsOptional()
  published?: boolean;
}
