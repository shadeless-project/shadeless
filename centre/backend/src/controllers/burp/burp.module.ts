import { Module } from '@nestjs/common';
import { BurpController } from './burp.controller';
import { BullModule } from '@nestjs/bull';
import { BurpQueue } from 'message-queue/burp.queue';

@Module({
  imports: [BullModule.registerQueue({ name: BurpQueue.name })],
  controllers: [BurpController],
  providers: [],
})
export class BurpModule {}
