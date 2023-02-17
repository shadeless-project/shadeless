import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Account, AccountDocument } from 'libs/schemas/account.schema';

@Injectable()
export class AccountsService {
  constructor(
    @InjectModel(Account.name) private accountModel: Model<AccountDocument>,
  ) {}

  async getAccounts() {
    const accounts = await this.accountModel.find();
    return accounts.map((acc) => {
      delete acc.password;
      delete acc.__v;
      return acc;
    });
  }
}
