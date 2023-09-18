import { Model } from 'mongoose';
import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';

import { User, UserDocument } from 'libs/schemas/user.schema';
import { Project, ProjectDocument } from 'libs/schemas/project.schema';
import {
  RawPacket,
  RawPacketDocument,
} from 'libs/schemas/raw_packet.schema';
import { Occurence, OccurenceDocument } from 'libs/schemas/occurence.schema';
import { calculateHash } from 'libs/helper';
import { UploadPacketDto } from 'controllers/burp/burp.dto';

@Injectable()
export class BurpPacketService {
  constructor(
    @InjectModel(RawPacket.name)
    private rawPacketModel: Model<RawPacketDocument>,
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

  async handlePacketUpload(body: UploadPacketDto) {
    const rawPacket = this.parseUploadPacket(body);
    await Promise.all([
      this.tryAddRawPacket(rawPacket),
      this.tryUpdateOccurence(rawPacket),
      this.tryAddUser(rawPacket),
      this.tryAddProject(rawPacket),
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
