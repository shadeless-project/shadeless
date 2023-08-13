import { getRandomBetween, getRandomString, sleep } from '@drstrain/drutil';
import {
  Body,
  Controller,
  Get,
  HttpCode,
  Post,
  Req,
  Res,
  UseGuards,
} from '@nestjs/common';
import { AuthLoginDto } from './auth.dto';
import { LoginGuard } from 'libs/middlewares/auth.guard';
import { AuthService } from './auth.service';
import { Request, Response } from 'express';
import redis from 'libs/redis';

const cookieAge = 86400 * 7;
@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @Get()
  @UseGuards(LoginGuard)
  async checkIsLogin() {
    return 'OK';
  }

  @Post('login')
  @HttpCode(200)
  async login(@Res() response: Response, @Body() body: AuthLoginDto) {
    await sleep(getRandomBetween(2000, 3500));

    const account = await this.authService.login(body.username, body.password);
    const id = getRandomString(40);
    await redis.set(`cookieId:${id}`, account._id.toString());

    let setCookieHeader = `id=${id}; HttpOnly; SameSite=Lax; Path=/api; Max-Age=${cookieAge}`;
    if (process.env.NODE_ENV === 'production')
      setCookieHeader += '; Secure; Partitioned';
    response.setHeader('Set-Cookie', setCookieHeader);
    response.send({
      statusCode: 200,
      data: account,
      error: '',
      timestamp: new Date().toISOString(),
      path: '/auth/login/',
    });
  }

  @Post('logout')
  @HttpCode(200)
  async logout(@Req() request: Request) {
    const id = request.cookies['id'];
    await redis.del(`cookieId:${id}`);
    return 'ok';
  }
}
