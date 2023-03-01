import {
  IsEnum,
  IsObject,
  IsOptional,
  IsString,
  MaxLength,
} from 'class-validator';
import { CensorType } from 'libs/schemas/censor.schema';

export class PostCensorDto {
  @IsObject()
  condition: any;

  @IsEnum(CensorType)
  type: CensorType;

  @IsString()
  @IsOptional()
  @MaxLength(100)
  project: string;

  @IsString()
  description: string;
}

export class PutCensorDto {
  @IsObject()
  condition: any;

  @IsString()
  @IsOptional()
  @MaxLength(1000)
  description: string;
}
