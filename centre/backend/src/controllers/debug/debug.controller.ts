import { Controller, Get } from '@nestjs/common';

@Controller('debug')
export class DebugController {
  constructor() {}

  @Get('/')
  async debugBull() {
    // const job = await this.audioQueue.add('transcode', { foo: 'bar' });
    return 1;
  }
}
