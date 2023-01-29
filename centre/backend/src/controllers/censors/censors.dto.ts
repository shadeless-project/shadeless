import { IsEnum, IsObject, IsOptional, IsString } from 'class-validator';
import { CensorType } from 'libs/schemas/censor.schema';

export class PostCensorDto {
  @IsObject()
  condition: any;

  @IsEnum(CensorType)
  type: CensorType;

  @IsString()
  @IsOptional()
  project: string;
}
