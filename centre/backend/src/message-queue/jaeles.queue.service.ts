import { Injectable, Logger } from '@nestjs/common';
import {
  ScanRun,
  ScanRunDetail,
  ScanRunDocument,
  ScanRunStatus,
} from 'libs/schemas/scan_run.schema';
import { exec } from '@drstrain/drutil';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { getJaelesScannerLogLocation } from 'libs/helper';

function escapeShellArg(arg) {
  return `'${arg.replace(/'/g, `'\\''`)}'`;
}
@Injectable()
export class JaelesQueue {
  private logger = new Logger(JaelesQueue.name);

  constructor(
    @InjectModel(ScanRun.name)
    private scanRunModel: Model<ScanRunDocument>,
  ) {}

  async runJaelesScan(scanRunDetail: ScanRunDetail) {
    const { packet } = scanRunDetail;
    const url = `${packet.origin}${packet.path}${
      packet.querystring ? '?' + packet.querystring : ''
    }`;

    const headerArgs = packet.requestHeaders.slice(1).reduce((prev, cur) => {
      return prev + ` -H ${escapeShellArg(cur)}`;
    }, '');

    const cmd = `/bin/jaeles scan -u '${url}' -s '${
      scanRunDetail.scanner.scanKeyword
    }' ${headerArgs.trim()} -v -L 4 > ${getJaelesScannerLogLocation(
      scanRunDetail._id.toString(),
    )}`;
    this.logger.log(`Running command: ${cmd}`);

    exec('bash', ['-c', cmd]).then(async (response) => {
      const { stdout, stderr } = response;
      this.logger.log(`Stdout: ${stdout}`);
      this.logger.log(`Stderr: ${stderr}`);
      await this.scanRunModel.findByIdAndUpdate(scanRunDetail._id, {
        $set: {
          status: ScanRunStatus.DONE,
        },
      });
    });
  }
}
