import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import {
  Account,
  AccountDocument,
  AccountRole,
  hashBcrypt,
} from 'libs/schemas/account.schema';
import {
  PostAccountDto,
  PutAccountDto,
  ResetPasswordAccountDto,
} from './accounts.dto';

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

  async createAccount(data: PostAccountDto) {
    const foundUser = await this.accountModel.findOne({
      username: data.username,
    });
    if (foundUser)
      throw new BadRequestException(
        '',
        `Already existed another account with username ${data.username}`,
      );
    await this.accountModel.create(data);
  }

  async editAccount(_id: string, data: PutAccountDto) {
    const editingUser = await this.accountModel.findById(_id);
    if (data.username && editingUser.username !== data.username) {
      const foundUser = await this.accountModel.findOne({
        username: data.username,
      });
      if (foundUser)
        throw new BadRequestException(
          '',
          `Already existed another account with username ${data.username}`,
        );
    }
    await this.accountModel.findByIdAndUpdate(_id, {
      $set: data,
    });
  }

  async resetAccountPassword(_id: string, data: ResetPasswordAccountDto) {
    await this.accountModel.findByIdAndUpdate(_id, {
      $set: { password: await hashBcrypt(data.password) },
    });
  }

  async deleteAccount(_id: string) {
    await this.accountModel.findByIdAndDelete(_id);
  }
}
