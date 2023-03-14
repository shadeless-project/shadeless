import { Model } from 'mongoose';
import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Account, AccountDocument } from 'libs/schemas/account.schema';

@Injectable()
export class AuthService {
  constructor(
    @InjectModel(Account.name) private accountModel: Model<AccountDocument>,
  ) {}

  async login(
    username: string,
    password: string,
  ): Promise<Omit<Account, 'password'>> {
    const account = await this.accountModel.findOne({ username });
    if (account && (await account.validatePassword(password))) {
      const data = JSON.parse(JSON.stringify(account));
      delete data.password;
      return data;
    }
    throw new BadRequestException('{}', 'Wrong username or password');
  }
}
