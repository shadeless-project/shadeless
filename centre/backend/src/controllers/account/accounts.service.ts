import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import {
  Account,
  AccountDocument,
  AccountRole,
} from 'libs/schemas/account.schema';
import { PutAccountDto, ResetPasswordAccountDto } from './accounts.dto';

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

  async editAccount(_id: string, data: PutAccountDto) {
    await this.accountModel.findByIdAndUpdate(_id, {
      $set: data,
    });
  }

  async resetAccountPassword(_id: string, data: ResetPasswordAccountDto) {
    await this.accountModel.findByIdAndUpdate(_id, {
      $set: {
        password: data.password,
      },
    });
  }

  async deleteAccount(_id: string) {
    await this.accountModel.findByIdAndDelete(_id);
  }
}
