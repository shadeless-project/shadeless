import { InjectQueue } from '@nestjs/bull';
import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Queue } from 'bull';
import {
  JaelesScanner,
  JaelesScannerDocument,
} from 'libs/schemas/jaeles_scanner.schema';
import { Project, ProjectDocument } from 'libs/schemas/project.schema';
import { ScanRun, ScanRunDocument } from 'libs/schemas/scan_run.schema';
import { ScannerQueue } from 'message-queue/scanner.queue';
import { Model } from 'mongoose';
import { TriggerScanDto } from '../projects.dto';
import { RawPacket, RawPacketDocument } from 'libs/schemas/raw_packet.schema';

@Injectable()
export class ProjectScannersService {
  constructor(
    @InjectModel(Project.name) private projectModel: Model<ProjectDocument>,
    @InjectModel(ScanRun.name) private scanRunModel: Model<ScanRunDocument>,
    @InjectModel(RawPacket.name)
    private rawPacketModel: Model<RawPacketDocument>,
    @InjectModel(JaelesScanner.name)
    private jaelesScannerModel: Model<JaelesScannerDocument>,

    @InjectQueue(ScannerQueue.name) private scannerQueue: Queue,
  ) {}

  async getScanRuns(projectName: string) {
    const project = await this.projectModel.findOne({ project: projectName });
    if (!project)
      throw new NotFoundException(' ', `Not found project ${projectName}`);
    const runScans = await this.scanRunModel.find({
      project: projectName,
    });
    return runScans;
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
    await this.scannerQueue.add(
      ScannerQueue.prototype.runJaelesScan.name,
      scanRun,
    );
    const cnt = await this.scanRunModel.countDocuments({
      project: scanRun.project,
    });

    return `Scan run #${cnt} is triggered and is running in the background`;
  }
}
