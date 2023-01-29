import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { AuthController } from './auth.controller';

@Module({
  controllers: [AuthController],
  imports: [ConfigModule.forRoot()],
  providers: [],
})
export class AuthModule {}
