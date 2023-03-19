import { Process, Processor } from '@nestjs/bull';
import { Logger } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Job } from 'bull';
import { DeletePacketsDto } from 'controllers/projects/projects.dto';
import { getOneExist, grepRegexInDirectory } from 'libs/helper';
import { Occurence, OccurenceDocument } from 'libs/schemas/occurence.schema';
import { RawPacket, RawPacketDocument } from 'libs/schemas/raw_packet.schema';
import { Model } from 'mongoose';
import path from 'path';
import { distinctHashAgg } from '../controllers/projects/project-packets/query-aggregation-mongo';

function findPacketsAggregation(filter: any, isHashDistinct = false) {
  filter = JSON.parse(JSON.stringify(filter));
  return [{ $match: filter }, isHashDistinct ? distinctHashAgg : {}].filter(
    (a) => Object.entries(a).length !== 0,
  ) as any[];
}

function filterBodyQuery({
  body,
  requestBody,
  responseBody,
  matchedIds,
  packets,
}: {
  body?: string;
  requestBody?: string;
  responseBody?: string;
  matchedIds: string[];
  packets: RawPacket[];
}): RawPacket[] {
  const setMatchedId: Set<string> = new Set();
  matchedIds.forEach((id) => setMatchedId.add(id));
  const results = [];
  for (let i = 0; i < packets.length; ++i) {
    const p = packets[i];
    let check = false;
    if (body)
      check =
        setMatchedId.has(p.requestBodyHash) ||
        setMatchedId.has(p.responseBodyHash);
    if (requestBody) check = setMatchedId.has(p.requestBodyHash);
    if (responseBody) check = setMatchedId.has(p.responseBodyHash);
    if (check) results.push(p);
  }
  return results;
}

@Processor(PacketActionsQueue.name)
export class PacketActionsQueue {
  private logger = new Logger(`Queue ${PacketActionsQueue.name}`);

  constructor(
    @InjectModel(RawPacket.name)
    private rawPacketModel: Model<RawPacketDocument>,
    @InjectModel(Occurence.name)
    private occurenceModel: Model<OccurenceDocument>,
  ) {}

  async deleteOnePacket(p: RawPacket) {
    await this.occurenceModel.findOneAndUpdate(
      { project: p.project, hash: p.hash },
      { $inc: { count: -1 } },
    );
    await this.rawPacketModel.findByIdAndDelete(p._id);
  }

  @Process(PacketActionsQueue.prototype.deletePackets.name)
  async deletePackets(job: Job<DeletePacketsDto>) {
    const { data: query } = job;
    this.logger.log(`Receive delete query: ${JSON.stringify(query, null, 2)}`);
    if (query.body || query.requestBody || query.responseBody) {
      const bodyQuery = getOneExist(
        query.body,
        query.requestBody,
        query.responseBody,
      );
      const agg = findPacketsAggregation(query.criteria, query.queryDistinct);
      const packets = await this.rawPacketModel
        .aggregate(agg)
        .allowDiskUse(true);
      const matchedBodyId = await grepRegexInDirectory(
        path.join('/files', query.criteria.project),
        bodyQuery,
      );
      const resultPackets = filterBodyQuery({
        ...query,
        packets,
        matchedIds: matchedBodyId,
      });
      for (let i = 0; i < resultPackets.length; ++i) {
        await this.deleteOnePacket(resultPackets[i]);
      }
      this.logger.log(
        `Successfully deleted query ${JSON.stringify(
          query,
          null,
          2,
        )}, deleted ${resultPackets.length}`,
      );
      return 0;
    }
    const agg = findPacketsAggregation(query.criteria, query.queryDistinct);
    const resultPackets = await this.rawPacketModel
      .aggregate(agg)
      .allowDiskUse(true);
    try {
      for (let i = 0; i < resultPackets.length; ++i) {
        await this.deleteOnePacket(resultPackets[i]);
      }
    } catch (e) {
      console.log(e);
    }
    this.logger.log(
      `Successfully deleted query ${JSON.stringify(query, null, 2)}, deleted ${
        resultPackets.length
      }`,
    );
    return 0;
  }
}
