import { IsOptional, IsString, MaxLength } from 'class-validator';

export class PostFuzzIncReqDto {
  @IsString()
  @IsOptional()
  @MaxLength(100)
  project: string;

  @IsString()
  @MaxLength(100)
  hash: string;
}
