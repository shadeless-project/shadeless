import { BullModule } from '@nestjs/bull';
import { Module } from '@nestjs/common';
import { DebugController } from './debug.controller';

@Module({
  imports: [
    BullModule.registerQueue({
      name: 'test',
    }),
  ],
  controllers: [DebugController],
  providers: [],
})
export class DebugModule {}
