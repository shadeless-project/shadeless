import {
  Injectable,
  NestInterceptor,
  ExecutionContext,
  CallHandler,
  Logger,
} from '@nestjs/common';
import { Observable } from 'rxjs';
import { tap } from 'rxjs/operators';
import { Request, Response } from 'express';

@Injectable()
export class LoggingInterceptor implements NestInterceptor {
  private logger = new Logger('HTTP');

  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    const before = Date.now();
    return next.handle().pipe(
      tap(() => {
        const request = context.getArgByIndex<Request>(0);
        const response = context.getArgByIndex<Response>(1);
        const ms = Date.now() - before;
        try {
          response.setHeader('X-Process-Ms', ms.toString());
        } catch (err) {}
        this.logger.log(
          `${request.method} ${response.statusCode} ${request.headers['host']} ${request.originalUrl} ${request.headers['x-real-ip']} ${ms}ms`,
        );
      }),
    );
  }
}
