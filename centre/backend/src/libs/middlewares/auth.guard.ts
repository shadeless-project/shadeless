import { Injectable, CanActivate, ExecutionContext } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Request } from 'express';
import redis from 'libs/redis';
import {
  Account,
  AccountDocument,
  AccountRole,
} from 'libs/schemas/account.schema';
import { Model } from 'mongoose';

@Injectable()
export class LoginGuard implements CanActivate {
  constructor(
    @InjectModel(Account.name) private accountModel: Model<AccountDocument>,
  ) {}

  async getAccountFromCtx(ctx: ExecutionContext) {
    const request = ctx.switchToHttp().getRequest<Request>();
    const authToken = request.cookies['id'];
    const accountId = await redis.get(`cookieId:${authToken}`);
    return this.accountModel.findById(accountId);
  }
  async canActivate(context: ExecutionContext): Promise<boolean> {
    const account = await this.getAccountFromCtx(context);
    return !!account;
  }
}

@Injectable()
export class AdminGuard implements CanActivate {
  constructor(
    @InjectModel(Account.name) private accountModel: Model<AccountDocument>,
  ) {}

  async getAccountFromCtx(ctx: ExecutionContext) {
    const request = ctx.switchToHttp().getRequest<Request>();
    const authToken = request.cookies['id'];
    const accountId = await redis.get(`cookieId:${authToken}`);
    return this.accountModel.findById(accountId);
  }

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const account = await this.getAccountFromCtx(context);
    return account?.role === AccountRole.ADMIN;
  }
}
