import { InjectQueue } from '@nestjs/bull';
import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Queue } from 'bull';
import {
  JaelesScanner,
  JaelesScannerDocument,
} from 'libs/schemas/jaeles_scanner.schema';
import { Project, ProjectDocument } from 'libs/schemas/project.schema';
import { RawPacket, RawPacketDocument } from 'libs/schemas/raw_packet.schema';
import {
  ScanRun,
  ScanRunDetail,
  ScanRunDocument,
} from 'libs/schemas/scan_run.schema';
import { ScannerQueue } from 'message-queue/scanner.queue';
import { Model } from 'mongoose';
import { TriggerScanDto } from './scanRuns.dto';
import { getJaelesScannerLogLocation } from 'libs/helper';
import fsPromise from 'fs/promises';

@Injectable()
export class ScanRunsService {
  constructor(
    @InjectModel(Project.name) private projectModel: Model<ProjectDocument>,
    @InjectModel(ScanRun.name) private scanRunModel: Model<ScanRunDocument>,
    @InjectModel(RawPacket.name)
    private rawPacketModel: Model<RawPacketDocument>,
    @InjectModel(JaelesScanner.name)
    private jaelesScannerModel: Model<JaelesScannerDocument>,

    @InjectQueue(ScannerQueue.name) private scannerQueue: Queue,
  ) {}

  async getScanRunDetail(id: string) {
    const scanRun = await this.scanRunModel.findById(id);
    if (!scanRun)
      throw new NotFoundException(' ', `Not found scanRun with specified id`);

    const project = await this.projectModel.findOne({
      project: scanRun.project,
    });
    if (!project)
      throw new NotFoundException(
        ' ',
        `Not found project ${scanRun.project}. It seems the project was removed`,
      );

    const packet = await this.rawPacketModel.findOne({
      requestPacketId: scanRun.requestPacketId,
    });
    if (!packet)
      throw new NotFoundException(
        ' ',
        `Not found packet ${scanRun.requestPacketId}. It seems the packet was removed !`,
      );

    const scanner = await this.jaelesScannerModel.findById(scanRun.scannerId);
    if (!scanner)
      throw new NotFoundException(
        ' ',
        `Not found scanner ${scanRun.scannerId}. It seems the scanner was removed !`,
      );

    const scanRunDetail: ScanRunDetail = {
      _id: scanRun._id,
      project,
      scanner,
      packet,
      status: scanRun.status,
    };
    return scanRunDetail;
  }

  async triggerScan(triggerScan: TriggerScanDto) {
    const project = await this.projectModel.findOne({
      project: triggerScan.project,
    });
    if (!project)
      throw new NotFoundException(
        ' ',
        `Not found project ${triggerScan.project}`,
      );
    const scanner = await this.jaelesScannerModel.findById(
      triggerScan.scannerId,
    );
    if (!scanner) throw new NotFoundException(' ', `Not found scanner`);

    const packet = await this.rawPacketModel.findOne({
      requestPacketId: triggerScan.requestPacketId,
    });
    if (!packet)
      throw new NotFoundException(
        ' ',
        `Not found packet associated with id ${triggerScan.requestPacketId}`,
      );

    const scanRun = await this.scanRunModel.create(triggerScan);
    const scanRunDetail: ScanRunDetail = {
      _id: scanRun._id,
      project,
      scanner,
      packet,
      status: scanRun.status,
    };

    await this.scannerQueue.add(
      ScannerQueue.prototype.runJaelesScan.name,
      scanRunDetail,
    );
    const cnt = await this.scanRunModel.countDocuments({
      project: scanRun.project,
    });

    return `Scan run #${cnt} is triggered and is running in the background`;
  }

  async getScanRunLog(id: string) {
    const loc = getJaelesScannerLogLocation(id);
    const content = await fsPromise.readFile(loc, 'utf-8');
    return content;
  }
}
