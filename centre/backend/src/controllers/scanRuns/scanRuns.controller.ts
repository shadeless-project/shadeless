import { Body, Controller, Get, Param, Post, UseGuards } from '@nestjs/common';
import { TriggerScanDto } from './scanRuns.dto';
import { LoginGuard } from 'libs/middlewares/auth.guard';
import { ScanRunsService } from './scanRuns.service';

@Controller('scanRuns')
@UseGuards(LoginGuard)
export class ScanRunsController {
  constructor(private scanRunsService: ScanRunsService) {}

  @Post('/')
  async triggerScan(@Body() triggerScan: TriggerScanDto) {
    return this.scanRunsService.triggerScan(triggerScan);
  }

  @Get('/:id')
  async getScanRunDetail(@Param('id') id: string) {
    return this.scanRunsService.getScanRunDetail(id);
  }

  @Get('/:id/scan-log')
  async getScanRunLog(@Param('id') id: string) {
    return this.scanRunsService.getScanRunLog(id);
  }
}
