import {
  BadRequestException,
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  UseGuards,
} from '@nestjs/common';
import { AdminGuard, AuthGuard } from 'libs/middlewares/auth.guard';
import { PostAccountDto } from './accounts.dto';
import { AccountsService } from './accounts.service';

@Controller('accounts')
@UseGuards(AuthGuard)
export class AccountsController {
  constructor(private accountsService: AccountsService) {}

  @Get('/')
  async getAccounts() {
    return this.accountsService.getAccounts();
  }

  @Post('/')
  @UseGuards(AdminGuard)
  async createAccount(@Body() account: PostAccountDto) {
    if (account.password !== account.passwordRecheck)
      throw new BadRequestException(
        '{}',
        'password and passwordRecheck mismatched',
      );

    await this.accountsService.createAccount(
      account.username,
      account.password,
      account.role,
    );
    return 'Successfully create new account';
  }

  @Delete('/:_id')
  @UseGuards(AdminGuard)
  async deleteAccount(@Param('_id') _id: string) {
    await this.accountsService.deleteAccount(_id);
    return 'Successfully deleted account';
  }
}
