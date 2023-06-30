import { Process, Processor } from '@nestjs/bull';
import { Job } from 'bull';
import { Logger } from '@nestjs/common';
import { JaelesService } from './jaeles.queue.service';
import { ScanRun } from 'libs/schemas/scan_run.schema';

@Processor(ScannerQueue.name)
export class ScannerQueue {
  private logger = new Logger(`Queue ${ScannerQueue.name}`);

  constructor(private jaelesService: JaelesService) {}

  @Process(ScannerQueue.prototype.runJaelesScan.name)
  async runJaelesScan(job: Job<ScanRun>) {
    const { data } = job;
    await this.jaelesService.runJaelesScan(data);
  }
}
