import { Injectable, CanActivate, ExecutionContext } from '@nestjs/common';
import { Request } from 'express';
import jwt from 'jsonwebtoken';
import { GLOBAL } from 'libs/global';
import { AccountRole } from 'libs/schemas/account.schema';

@Injectable()
export class AuthGuard implements CanActivate {
  canActivate(context: ExecutionContext): boolean {
    const request = context.switchToHttp().getRequest<Request>();
    const authToken = request.header('Authorization');
    const decoded = jwt.verify(authToken, GLOBAL.jwtSecret);
    return true;
  }
}

@Injectable()
export class AdminGuard implements CanActivate {
  canActivate(context: ExecutionContext): boolean {
    const request = context.switchToHttp().getRequest<Request>();
    const authToken = request.header('Authorization');
    const decoded = jwt.verify(authToken, GLOBAL.jwtSecret) as any;
    return decoded?.role === AccountRole.ADMIN;
  }
}
