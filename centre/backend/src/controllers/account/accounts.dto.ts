import { IsEnum, IsString } from 'class-validator';
import { AccountRole } from 'libs/schemas/account.schema';

export class PostAccountDto {
  @IsString()
  username: string;

  @IsString()
  password: string;

  @IsString()
  passwordRecheck: string;

  @IsEnum(AccountRole)
  role: AccountRole;
}
