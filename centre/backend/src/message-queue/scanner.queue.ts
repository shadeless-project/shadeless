import { Process, Processor } from '@nestjs/bull';
import { Job } from 'bull';
import { Logger } from '@nestjs/common';
import { JaelesService } from './jaeles.queue.service';
import { ScanRunDetail } from 'libs/schemas/scan_run.schema';

@Processor(ScannerQueue.name)
export class ScannerQueue {
  private logger = new Logger(`Queue ${ScannerQueue.name}`);

  constructor(private jaelesService: JaelesService) {}

  @Process(ScannerQueue.prototype.runJaelesScan.name)
  async runJaelesScan(job: Job<ScanRunDetail>) {
    const { data } = job;
    this.logger.log(
      `Received scan job project=${data.project.name};requestPacketId=${data.packet.requestPacketId};scannerId=${data.scanner._id},scannerKeyword=${data.scanner.scanKeyword}`,
    );
    await this.jaelesService.runJaelesScan(data);
  }
}
