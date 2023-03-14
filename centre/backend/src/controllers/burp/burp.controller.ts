import {
  Body,
  Controller,
  HttpCode,
  Post,
  UploadedFile,
  UseInterceptors,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import { UploadFileDto, UploadPacketDto } from './burp.dto';
import { InjectQueue } from '@nestjs/bull';
import { BurpQueue } from 'message-queue/burp.queue';
import { Queue } from 'bull';

@Controller('burp')
export class BurpController {
  constructor(@InjectQueue(BurpQueue.name) private burpQueue: Queue) {}

  @Post('files')
  @HttpCode(200)
  @UseInterceptors(
    FileInterceptor('file', {
      storage: diskStorage({}),
    }),
  )
  async uploadFile(
    @Body() body: UploadFileDto,
    @UploadedFile() file: Express.Multer.File,
  ) {
    await this.burpQueue.add(BurpQueue.prototype.handleFileUpload.name, {
      ...body,
      path: file.path,
    });
    return 'OK';
  }

  @Post('packets')
  @HttpCode(200)
  async uploadPackets(@Body() body: UploadPacketDto) {
    await this.burpQueue.add(BurpQueue.prototype.handlePacket.name, body);
    return 'OK';
  }
}
