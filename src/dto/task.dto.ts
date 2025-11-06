import { IsBoolean, IsEnum, IsNotEmpty, IsNumber, IsNumberString, IsOptional, IsString } from 'class-validator';
import { sortOrderEnum } from '../utils/types';
import { Transform } from 'class-transformer';

export class FilterTaskDto {
  @IsOptional()
  @IsString()
  @IsNotEmpty()
  title?: string;

  // transform into Array<string> since it may initially be string
  @IsOptional()
  @IsNumberString(undefined, { each: true })
  @Transform(({ value }) => typeof value === 'string'? [value] : value)
  ids?: string[];

  @IsOptional()
  @IsBoolean()
  // transforming to boolean since it may initially be a string
  @Transform(({ value }) => String(value).toLowerCase() === 'true')
  completed?: boolean;

  @IsOptional()
  @IsEnum(sortOrderEnum)
  order?: sortOrderEnum;

  @IsOptional()
  @IsNumberString()
  page?: number | string;
  
  @IsOptional()
  @IsNumberString()
  limit?: number | string;
}

export class CreateTaskDto {
  @IsString()
  @IsNotEmpty()
  title!: string;

  @IsOptional()
  @IsBoolean()
  completed?: boolean;
}

export class UpdateTaskDto {
  @IsOptional()
  @IsString()
  @IsNotEmpty()
  title?: string;

  @IsOptional()
  @IsBoolean()
  completed?: boolean;
}
