import { Controller, Get, UseGuards } from '@nestjs/common';
import { AuthGuard } from 'libs/middlewares/auth.guard';
import { AccountsService } from './accounts.service';

@Controller('accounts')
@UseGuards(AuthGuard)
export class AccountsController {
  constructor(private accountsService: AccountsService) {}

  @Get('/')
  async getAccounts() {
    return this.accountsService.getAccounts();
  }
}
