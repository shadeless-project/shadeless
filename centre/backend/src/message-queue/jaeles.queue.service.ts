import { Model } from 'mongoose';
import { Injectable, Logger } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';

import { Path, PathDocument } from 'libs/schemas/path.schema';
import { User, UserDocument } from 'libs/schemas/user.schema';
import { Project, ProjectDocument } from 'libs/schemas/project.schema';
import { RawPacket, RawPacketDocument } from 'libs/schemas/raw_packet.schema';
import { Occurence, OccurenceDocument } from 'libs/schemas/occurence.schema';
import path from 'path';
import { ScanRun } from 'libs/schemas/scan_run.schema';
import { exec } from '@drstrain/drutil';

@Injectable()
export class JaelesService {
  private logger = new Logger(JaelesService.name);

  constructor(
    @InjectModel(RawPacket.name)
    private rawPacketModel: Model<RawPacketDocument>,
    @InjectModel(Path.name) private pathModel: Model<PathDocument>,
    @InjectModel(Occurence.name)
    private occurenceModel: Model<OccurenceDocument>,
    @InjectModel(Project.name) private projectModel: Model<ProjectDocument>,
    @InjectModel(User.name) private userModel: Model<UserDocument>,
  ) {}

  getScannerLogLocation(id: string): string {
    const fileLocation = path.join('/files', 'scan-logs', id);
    return fileLocation;
  }

  async runJaelesScan(scanRun: ScanRun) {
    const packet = await this.rawPacketModel.findOne({
      requestPacketId: scanRun.requestPacketId,
    });
    if (!packet) return;

    const url = `${packet.origin}${packet.path}${
      packet.querystring ? '?' + packet.querystring : ''
    }`;

    const headerArgs = packet.requestHeaders.slice(1).reduce((prev, cur) => {
      return [...prev, '-H', cur];
    }, []);

    console.log(url);
    console.log(headerArgs);

    // const { stdout } = await exec('jaeles', ['scan', '-u', url, ...headerArgs]);
  }
}
