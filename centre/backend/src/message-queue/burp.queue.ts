import { Process, Processor } from '@nestjs/bull';
import { Job } from 'bull';
import { UploadFileDto, UploadPacketDto } from 'controllers/burp/burp.dto';
import fs from 'fs/promises';
import mv from 'mv';
import path from 'path';
import { Logger } from '@nestjs/common';
import { ItemStatus, RawPacket } from 'libs/schemas/raw_packet.schema';
import { Path } from 'libs/schemas/path.schema';
import { calculateHash } from 'libs/helper';
import { BurpPacketService } from './burp.queue.service';

async function mvAsync(src: string, dest: string): Promise<void> {
  return new Promise((resolve, reject) => {
    mv(src, dest, function (err) {
      if (err) reject(err);
      else resolve();
    });
  });
}

@Processor(BurpQueue.name)
export class BurpQueue {
  private logger = new Logger(`Queue ${BurpQueue.name}`);

  constructor(private burpQueueService: BurpPacketService) {}

  parseUploadPacket(body: UploadPacketDto): RawPacket {
    body.parameters = body.parameters.sort();
    const [requestPacketPrefix, requestPacketIndex] = body.requestPacketId
      .toLowerCase()
      .split('.');
    const rawPacket: RawPacket = Object.assign(
      {},
      {
        ...body,
        requestPacketIndex: +requestPacketIndex,
        requestPacketPrefix,
        reflectedParameters: body.reflectedParameters || {},
        hash: calculateHash(body),
      },
    );
    return rawPacket;
  }

  parsePathsFromPacket(body: UploadPacketDto): Path[] {
    const result: Path[] = [];
    const paths = body.path.split('/');

    let curPath = '';
    paths.forEach((val, idx) => {
      if (idx === paths.length - 1 && val == '') return;
      if (idx !== paths.length - 1 || body.staticScore <= 50) {
        curPath += val + '/';
        result.push({
          requestPacketId: body.requestPacketId,
          origin: body.origin,
          path: curPath,
          project: body.project,
          status: ItemStatus.TODO,
        });
      }
    });
    return result;
  }

  @Process(BurpQueue.prototype.handlePacket.name)
  async handlePacket(job: Job<UploadPacketDto>) {
    const { data } = job;
    await this.burpQueueService.handlePacketUpload(job.data);
    this.logger.log(
      `[${data.project}|${data.codeName}]: ${data.method} ${data.origin}${data.path}`,
    );
  }

  @Process(BurpQueue.prototype.handleFileUpload.name)
  async handleFileUpload(job: Job<UploadFileDto & { path: string }>) {
    const { data } = job;
    await fs.mkdir(path.join('/files', data.project), { recursive: true });
    try {
      await mvAsync(data.path, path.join('/files', data.project, data.id));
    } catch (err) {
      this.logger.error(err);
    }
  }
}
