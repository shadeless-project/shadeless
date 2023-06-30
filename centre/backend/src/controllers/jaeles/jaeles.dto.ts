import { IsOptional, IsString, MaxLength, MinLength } from 'class-validator';

export class CreateJaelesScannerDto {
  @IsString()
  @MinLength(1)
  @MaxLength(50)
  name: string;

  @IsString()
  @MaxLength(1000)
  description: string;

  @IsString()
  @MaxLength(100)
  scanKeyword: string;
}

export class EditJaelesScannerDto {
  @IsString()
  @MinLength(1)
  @MaxLength(50)
  @IsOptional()
  name?: string;

  @IsString()
  @MaxLength(1000)
  description: string;

  @IsString()
  @MaxLength(100)
  scanKeyword: string;
}
