import { getRandomString } from '@drstrain/drutil';
import { Injectable, CanActivate, ExecutionContext } from '@nestjs/common';
import { Request } from 'express';
import jwt from 'jsonwebtoken';

export const globalSecret = getRandomString(32);

@Injectable()
export class AuthGuard implements CanActivate {
  canActivate(context: ExecutionContext): boolean {
    const request = context.switchToHttp().getRequest<Request>();
    const authToken = request.header('Authorization');
    const decoded = jwt.verify(authToken, globalSecret);
    return true;
  }
}

@Injectable()
export class AdminGuard implements CanActivate {
  canActivate(context: ExecutionContext): boolean {
    const request = context.switchToHttp().getRequest<Request>();
    const authToken = request.header('Authorization');
    const decoded = jwt.verify(authToken, globalSecret) as any;
    return decoded?.user === 'admin';
  }
}
