import {
  ExceptionFilter,
  Catch,
  ArgumentsHost,
  HttpException,
  Logger,
} from '@nestjs/common';
import { Request, Response } from 'express';

@Catch()
export class HttpExceptionFilter implements ExceptionFilter {
  private logger = new Logger('HTTP');

  catch(exception: any, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const request = ctx.getRequest<Request>();

    if (exception instanceof HttpException) {
      const statusCode = exception.getStatus();
      const responseError = exception.getResponse() as any;

      const error =
        responseError.error == null
          ? responseError.message
          : responseError.error;

      this.logger.error(
        `${request.method} ${statusCode} ${request.headers['host']} ${request.originalUrl} ${request.headers['x-real-ip']}: ${exception.message}`,
      );

      response.status(statusCode).json({
        statusCode,
        timestamp: new Date().toISOString(),
        path: request.originalUrl,
        error,
        data: responseError.message,
      });
    } else {
      this.logger.error(
        `${request.method} 500 ${request.headers['host']} ${request.originalUrl} ${request.headers['x-real-ip']}: ${exception.message}`,
      );
      response.status(500).json({
        statusCode: 500,
        timestamp: new Date().toISOString(),
        path: request.originalUrl,
        error: exception.message,
        data: '',
      });
    }
  }
}
