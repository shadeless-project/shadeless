import { Model } from 'mongoose';
import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import jwt from 'jsonwebtoken';
import { Account, AccountDocument } from 'libs/schemas/account.schema';
import { GLOBAL } from 'libs/global';

@Injectable()
export class AuthService {
  constructor(
    @InjectModel(Account.name) private accountModel: Model<AccountDocument>,
  ) {}

  async login(username: string, password: string) {
    const account = await this.accountModel.findOne({ username });
    console.log(account);
    if (account && (await account.validatePassword(password))) {
      const data = JSON.parse(JSON.stringify(account));
      delete data.password;
      const resp = jwt.sign(data, GLOBAL.jwtSecret, {
        expiresIn: '7d',
      });
      return resp;
    }
    throw new BadRequestException('{}', 'Wrong username or password');
  }
}
