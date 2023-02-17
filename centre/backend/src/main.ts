import { ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { NestExpressApplication } from '@nestjs/platform-express';
import fs from 'fs/promises';
import { LoggingInterceptor } from 'libs/middlewares/logger.interceptor';
import { HttpExceptionFilter } from 'libs/middlewares/exception.filter';
import { ResponseInterceptor } from 'libs/middlewares/response.interceptor';
import { AppClusterService } from './clusterize.service';
import { GLOBAL } from 'libs/global';

async function bootstrap(jwtSecret: string) {
  GLOBAL.jwtSecret = jwtSecret;
  await fs.mkdir('/files', { recursive: true });
  const app = await NestFactory.create<NestExpressApplication>(AppModule);
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      transform: true,
      disableErrorMessages: process.env.NODE_ENV === 'production',
    }),
  );
  app.useGlobalFilters(new HttpExceptionFilter());
  app.useGlobalInterceptors(new LoggingInterceptor());
  app.useGlobalInterceptors(new ResponseInterceptor());
  await app.listen(3000);
}
AppClusterService.clusterize(bootstrap);
