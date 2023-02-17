import { getRandomBetween, sleep } from '@drstrain/drutil';
import {
  Body,
  Controller,
  Get,
  HttpCode,
  Post,
  UseGuards,
} from '@nestjs/common';
import { AuthLoginDto } from './auth.dto';
import { AuthGuard } from 'libs/middlewares/auth.guard';
import { AuthService } from './auth.service';

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @Get()
  @UseGuards(AuthGuard)
  async checkIsLogin() {
    return 'OK';
  }

  @Post('login')
  @HttpCode(200)
  async login(@Body() body: AuthLoginDto) {
    await sleep(getRandomBetween(2000, 4000));
    return this.authService.login(body.username, body.password);
  }
}
