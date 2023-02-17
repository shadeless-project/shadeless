import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import {
  Account,
  AccountDocument,
  AccountRole,
} from 'libs/schemas/account.schema';

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

  async createAccount(username: string, password: string, role: AccountRole) {
    await this.accountModel.create({
      username,
      password,
      role,
    });
  }

  async deleteAccount(_id: string) {
    await this.accountModel.findByIdAndDelete(_id);
  }
}
