import {
  Controller,
  Get,
  Head,
  NotFoundException,
  Param,
  Res,
  UseGuards,
} from '@nestjs/common';
import { LoginGuard } from 'libs/middlewares/auth.guard';
import path from 'path';
import { Response } from 'express';
import fs from 'fs';
import fsPromise from 'fs/promises';
import { Censor, CensorDocument, CensorType } from 'libs/schemas/censor.schema';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { RawPacket, RawPacketDocument } from 'libs/schemas/raw_packet.schema';

function isConditionMatch(condition: any, packet: RawPacket): boolean {
  return Object.entries(condition).reduce(
    (prev, [key, val]) => prev && packet[key] === val,
    true,
  );
}

export const isCensorsMatchPacket = (censors: Censor[], packet: RawPacket) =>
  !!censors.find(({ condition }) => isConditionMatch(condition, packet));

@Controller('files')
export class StaticFileController {
  constructor(
    @InjectModel(Censor.name) private censorModel: Model<CensorDocument>,
    @InjectModel(RawPacket.name)
    private rawPacketModel: Model<RawPacketDocument>,
  ) {}

  validateInput(projectName: string, fileHash: string) {
    if (/^[\w-]{1,128}$/i.test(projectName) && /^[0-9a-f]{64}$/i.test(fileHash))
      return true;
    throw new NotFoundException('Wrong format static file');
  }

  @Head('/:projectName/:fileHash')
  async headFile(
    @Param('projectName') projectName: string,
    @Param('fileHash') fileHash: string,
  ) {
    this.validateInput(projectName, fileHash);
    const fileLocation = path.join('/files', projectName, fileHash);
    try {
      await fsPromise.access(fileLocation, fs.constants.R_OK);
    } catch (err) {
      throw new NotFoundException('Not found', err.message);
    }
    return 1;
  }

  @Get('/:projectName/:fileHash')
  @UseGuards(LoginGuard)
  async getFile(
    @Param('projectName') projectName: string,
    @Param('fileHash') fileHash: string,
    @Res() response: Response,
  ) {
    this.validateInput(projectName, fileHash);
    response.setHeader('Content-Type', 'application/octet-stream');

    const fileLocation = path.join('/files', projectName, fileHash);
    const fileContent = await fsPromise.readFile(fileLocation);
    if (fileContent.length === 0) return response.end(fileContent);

    const censors = await this.censorModel.find({
      $or: [
        { project: projectName, type: CensorType.ONE },
        { type: CensorType.ALL },
      ],
    });
    const relatedPackets = await this.rawPacketModel.find({
      project: projectName,
      $or: [{ requestBodyHash: fileHash }, { responseBodyHash: fileHash }],
    });

    if (relatedPackets.find((p) => isCensorsMatchPacket(censors, p))) {
      return response.end('*'.repeat(Math.min(fileContent.length, 512)));
    }
    return response.end(fileContent);
  }
}
