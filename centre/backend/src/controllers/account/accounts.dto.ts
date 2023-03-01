import { IsEnum, IsString, MaxLength, MinLength } from 'class-validator';
import { AccountRole } from 'libs/schemas/account.schema';

export class PostAccountDto {
  @IsString()
  @MinLength(1)
  @MaxLength(50)
  username: string;

  @IsString()
  @MinLength(5)
  @MaxLength(50)
  password: string;

  @IsString()
  @MinLength(5)
  @MaxLength(50)
  passwordRecheck: string;

  @IsString()
  @MaxLength(50)
  email: string;

  @IsEnum(AccountRole)
  role: AccountRole;
}

export class PutAccountDto {
  @IsString()
  @MinLength(1)
  @MaxLength(50)
  username: string;

  @IsString()
  @MaxLength(50)
  email: string;

  @IsEnum(AccountRole)
  role: AccountRole;
}

export class ResetPasswordAccountDto {
  @IsString()
  @MinLength(5)
  @MaxLength(50)
  password: string;

  @IsString()
  @MinLength(5)
  @MaxLength(50)
  passwordRecheck: string;
}
