import { Injectable, Logger } from '@nestjs/common';
import path from 'path';
import { ScanRunDetail } from 'libs/schemas/scan_run.schema';
import { exec, system } from '@drstrain/drutil';

function escapeShellArg(arg) {
  return `'${arg.replace(/'/g, `'\\''`)}'`;
}

function getScannerLogLocation(id: string): string {
  const fileLocation = path.join('/files', 'scan-logs', id);
  return fileLocation;
}
@Injectable()
export class JaelesService {
  private logger = new Logger(JaelesService.name);

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
    }' ${headerArgs.trim()} -v -L 4 > ${getScannerLogLocation(
      scanRunDetail._id.toString(),
    )}`;
    this.logger.log(`Running command: ${cmd}`);

    const { stdout, stderr } = await exec('bash', ['-c', cmd]);
    this.logger.log(`Stdout: ${stdout}`);
    this.logger.log(`Stderr: ${stderr}`);

    // const { stdout, stderr } = await exec('whoami');
    // this.logger.log(`Stdout: ${stdout}`);
    // this.logger.log(`Stderr: ${stderr}`);
  }
}
