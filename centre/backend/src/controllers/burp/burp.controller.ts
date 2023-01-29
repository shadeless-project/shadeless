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
import { BurpFileService } from './burp-file/burp-file.service';
import { BurpPacketService } from './burp-packet/burp-packet.service';

@Controller('burp')
export class BurpController {
  constructor(
    private fileService: BurpFileService,
    private packetService: BurpPacketService,
  ) {}

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
    this.fileService.handleFileUpload(body, file);
    return 'OK';
  }

  @Post('packets')
  @HttpCode(200)
  async uploadPackets(@Body() body: UploadPacketDto) {
    this.packetService.handlePacketUpload(body);
    return 'OK';
  }
}
