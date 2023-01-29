import { compareSafe, getRandomBetween, sleep } from '@drstrain/drutil';
import {
  BadRequestException,
  Body,
  Controller,
  Get,
  HttpCode,
  Post,
  UseGuards,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { AuthLoginDto } from './auth.dto';
import jwt from 'jsonwebtoken';
import { AuthGuard, globalSecret } from 'libs/middlewares/auth.guard';

@Controller('auth')
export class AuthController {
  constructor(private configService: ConfigService) {}

  @Get()
  @UseGuards(AuthGuard)
  async checkIsLogin() {
    return 'OK';
  }

  @Post('login')
  @HttpCode(200)
  async login(@Body() body: AuthLoginDto) {
    const { username, password } = body;
    await sleep(getRandomBetween(2000, 5000));

    // For admin
    const adminUsername =
      this.configService.get<string>('ADMIN_USERNAME') || '';
    const adminPassword =
      this.configService.get<string>('ADMIN_PASSWORD') || '';

    if (
      compareSafe(username, adminUsername) &&
      compareSafe(password, adminPassword)
    ) {
      const resp = jwt.sign({ user: 'admin' }, globalSecret, {
        expiresIn: '7d',
      });
      return resp;
    }

    // For operator
    const operatorUsername =
      this.configService.get<string>('OPERATOR_USERNAME') || '';
    const operatorPassword =
      this.configService.get<string>('OPERATOR_PASSWORD') || '';
    if (
      compareSafe(username, operatorUsername) &&
      compareSafe(password, operatorPassword)
    ) {
      const resp = jwt.sign({ user: 'operator' }, globalSecret, {
        expiresIn: '7d',
      });
      return resp;
    }

    throw new BadRequestException('{}', 'Wrong username or password');
  }
}
