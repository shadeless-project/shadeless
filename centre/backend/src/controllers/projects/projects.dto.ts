import {
  IsBoolean,
  IsEnum,
  IsNumber,
  IsObject,
  IsOptional,
  IsString,
  Matches,
  Max,
  Min,
} from 'class-validator';
import { CensorType } from 'libs/schemas/censor.schema';
import { ProjectStatus } from 'libs/schemas/project.schema';

export class PostProjectDto {
  @IsString()
  @Matches(/^[a-z0-9]{1,128}$/i)
  name: string;

  @IsString()
  description: string;
}
export class PutStatusProjectDto {
  @IsEnum(ProjectStatus)
  status: ProjectStatus;
}

export class PutProjectDto {
  @IsEnum(ProjectStatus)
  @IsOptional()
  status?: ProjectStatus;

  @IsString()
  @IsOptional()
  description?: string;
}

export class QueryMiniDashboardDto {
  @IsString()
  @IsOptional()
  body?: string;

  @IsString()
  @IsOptional()
  requestBody?: string;

  @IsString()
  @IsOptional()
  responseBody?: string;

  @IsObject()
  criteria: any;

  @IsBoolean()
  @IsOptional()
  queryDistinct?: boolean;
}

export class QueryPacketDto {
  @IsString()
  @IsOptional()
  body?: string;

  @IsString()
  @IsOptional()
  requestBody?: string;

  @IsString()
  @IsOptional()
  responseBody?: string;

  @IsObject()
  criteria: any;

  @IsNumber()
  @Min(0)
  offset: number;

  @IsNumber()
  @Min(0)
  limit: number;

  @IsBoolean()
  @IsOptional()
  queryDistinct?: boolean;

  @IsBoolean()
  @IsOptional()
  minimal?: boolean;
}

export class QueryPacketAfterTimeDto {
  @IsString()
  @IsOptional()
  body?: string;

  @IsString()
  @IsOptional()
  requestBody?: string;

  @IsString()
  @IsOptional()
  responseBody?: string;

  @IsObject()
  criteria: any;

  @IsString()
  from: string;

  @IsBoolean()
  @IsOptional()
  queryDistinct?: boolean;

  @IsBoolean()
  @IsOptional()
  minimal?: boolean;
}

export class DeleteProjectDto {
  @IsBoolean()
  all: boolean;
}