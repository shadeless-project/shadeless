import { IsString, MaxLength, MinLength } from 'class-validator';

export class AuthLoginDto {
  @IsString()
  @MinLength(1)
  @MaxLength(50)
  username: string;

  @IsString()
  @MinLength(1)
  @MaxLength(50)
  password: string;
}
