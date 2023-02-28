import { IsEnum, IsString, MaxLength, MinLength } from 'class-validator';
import { AccountRole } from 'libs/schemas/account.schema';

export class PostAccountDto {
  @IsString()
  username: string;

  @IsString()
  @MinLength(5)
  @MaxLength(30)
  password: string;

  @IsString()
  passwordRecheck: string;

  @IsString()
  email: string;

  @IsEnum(AccountRole)
  role: AccountRole;
}

export class PutAccountDto {
  @IsString()
  username: string;

  @IsString()
  email: string;

  @IsEnum(AccountRole)
  role: AccountRole;
}

export class ResetPasswordAccountDto {
  @IsString()
  @MinLength(5)
  @MaxLength(30)
  password: string;

  @IsString()
  passwordRecheck: string;
}
