import {
  BadRequestException,
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
  UseGuards,
} from '@nestjs/common';
import { LoginGuard } from 'libs/middlewares/auth.guard';
import { JaelesScannerService } from './jaeles_scanner.service';
import { JaelesSignatureService } from './jaeles_signature.service';
import { CreateJaelesScannerDto, EditJaelesScannerDto } from './jaeles.dto';

@Controller('jaeles')
@UseGuards(LoginGuard)
export class JaelesController {
  constructor(
    private jaelesScannerService: JaelesScannerService,
    private jaelesSignatureService: JaelesSignatureService,
  ) {}

  @Get('/signatures')
  async getJaelesSignatureFiles() {
    return this.jaelesSignatureService.getSignatureFiles();
  }

  @Get('/signatures/:fileName')
  async getOneJaelesSignatureFile(@Param('fileName') fileName: string) {
    if (!fileName.match(/\.(yaml|yml)$/))
      throw new BadRequestException('{}', 'Wrong fileName');

    return this.jaelesSignatureService.getOneSignatureFile(fileName);
  }

  @Get('/scanners')
  async getScanners() {
    return this.jaelesScannerService.getScanners();
  }

  @Post('/scanners')
  async createNewScanner(@Body() body: CreateJaelesScannerDto) {
    return this.jaelesScannerService.createScanner(body);
  }

  @Put('/scanners/:id')
  async editScanner(
    @Param('id') id: string,
    @Body() data: EditJaelesScannerDto,
  ) {
    return this.jaelesScannerService.editScanner(id, data);
  }

  @Delete('/scanners/:id')
  async deleteScanner(@Param('id') id: string) {
    return this.jaelesScannerService.deleteScanner(id);
  }
}
