import { Model } from 'mongoose';
import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';

import { UploadPacketDto } from '../burp.dto';
import { Path, PathDocument } from 'libs/schemas/path.schema';
import { User, UserDocument } from 'libs/schemas/user.schema';
import { Project, ProjectDocument } from 'libs/schemas/project.schema';
import {
  ItemStatus,
  RawPacket,
  RawPacketDocument,
} from 'libs/schemas/raw_packet.schema';
import { Occurence, OccurenceDocument } from 'libs/schemas/occurence.schema';
import { calculateHash } from 'libs/helper';

@Injectable()
export class BurpPacketService {
  constructor(
    @InjectModel(RawPacket.name)
    private rawPacketModel: Model<RawPacketDocument>,
    @InjectModel(Path.name) private pathModel: Model<PathDocument>,
    @InjectModel(Occurence.name)
    private occurenceModel: Model<OccurenceDocument>,
    @InjectModel(Project.name) private projectModel: Model<ProjectDocument>,
    @InjectModel(User.name) private userModel: Model<UserDocument>,
  ) {}

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

  async handlePacketUpload(body: UploadPacketDto) {
    const rawPacket = this.parseUploadPacket(body);
    const paths = this.parsePathsFromPacket(body);
    await Promise.all([
      this.tryAddRawPacket(rawPacket),
      this.tryUpdateOccurence(rawPacket),
      this.tryAddUser(rawPacket),
      this.tryAddProject(rawPacket),
      this.tryAddPaths(paths),
    ]);
  }

  async tryAddRawPacket(p: RawPacket) {
    try {
      await this.rawPacketModel.create(p);
    } catch (e) {}
  }
  async tryAddUser(p: RawPacket) {
    try {
      await this.userModel.create({
        codeName: p.codeName,
        project: p.project,
      });
    } catch (e) {}
  }
  async tryAddProject(p: RawPacket) {
    try {
      await this.projectModel.create({ name: p.project });
    } catch (e) {}
  }
  async tryAddPaths(paths: Path[]) {
    for (let i = 0; i < paths.length; ++i) {
      try {
        await this.pathModel.create(paths[i]);
      } catch (e) {
        await this.pathModel.updateOne(
          {
            path: paths[i].path,
            origin: paths[i].origin,
            project: paths[i].project,
          },
          { $set: { requestPacketId: paths[i].requestPacketId } },
        );
      }
    }
  }
  async tryUpdateOccurence(p: RawPacket) {
    try {
      await this.occurenceModel.findOneAndUpdate(
        { project: p.project, hash: p.hash },
        { $inc: { count: 1 } },
        { upsert: true },
      );
    } catch (e) {}
  }
}
