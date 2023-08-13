import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { getOneExist, grepRegexInDirectory } from 'libs/helper';
import { Project, ProjectDocument } from 'libs/schemas/project.schema';
import { RawPacket, RawPacketDocument } from 'libs/schemas/raw_packet.schema';
import { Model } from 'mongoose';
import {
  DashboardAdditionalDataType,
  QueryMiniDashboardAdditionalDataDto,
  QueryMiniDashboardDto,
  QueryPacketDto,
} from '../projects.dto';
import path from 'path';
import { Censor, CensorDocument, CensorType } from 'libs/schemas/censor.schema';
import { isCensorsMatchPacket } from 'controllers/static-file/static-file.controller';
import { distinctHashAgg, projectAgg } from './query-aggregation-mongo';

// Copied from findPacketsAggregation because I'm too lazy
function countFilteredPacketsAgg(
  filter: any,
  distinctCol = '',
  isHashDistinct = false,
) {
  filter = JSON.parse(JSON.stringify(filter));
  // optimize if there's no count filter
  if (
    !isObjectContainKey(filter, 'count') &&
    !isObjectContainKey(filter, 'fuzzCount')
  ) {
    return [
      { $match: filter },
      isHashDistinct ? distinctHashAgg : {},
      {
        $lookup: {
          localField: 'hash',
          from: 'occurences',
          foreignField: 'hash',
          as: 'count',
        },
      },
      { $unwind: '$count' },
      projectAgg,
      distinctCol ? { $group: { _id: '$' + distinctCol } } : {},
      { $count: 'count' },
    ].filter((a) => Object.entries(a).length !== 0);
  }

  const matchProjectOptimize: any = {};
  if (!!filter.project) {
    const { project } = filter;
    delete filter.project;
    matchProjectOptimize.$match = {
      project,
    };
  }
  const agg: any[] = [
    matchProjectOptimize,
    {
      $lookup: {
        localField: 'hash',
        from: 'occurences',
        foreignField: 'hash',
        as: 'count',
      },
    },
    { $unwind: '$count' },
    projectAgg,
    isHashDistinct ? distinctHashAgg : {},
    { $match: filter },
    distinctCol ? { $group: { _id: '$' + distinctCol } } : {},
    { $count: 'count' },
  ];

  return agg.filter((a) => Object.entries(a).length !== 0);
}

function isObjectContainKey(obj: any, key: string) {
  if (typeof obj !== 'object') return false;
  const entries = Object.entries(obj);
  if (!entries) return false;
  for (const [k, v] of entries) {
    if (key === k) return true;
    if (isObjectContainKey(v, key)) return true;
  }
  return false;
}

function findPacketsAggregation(
  filter: any,
  isHashDistinct = false,
  sort?: boolean,
  skip?: number,
  limit?: number,
) {
  filter = JSON.parse(JSON.stringify(filter));

  // optimize if there's no count filter
  if (
    !isObjectContainKey(filter, 'count') &&
    !isObjectContainKey(filter, 'fuzzCount')
  ) {
    return [
      { $match: filter },
      sort ? { $sort: { createdAt: -1, requestPacketIndex: -1 } } : {},
      isHashDistinct ? distinctHashAgg : {},
      skip ? { $skip: skip } : {},
      limit ? { $limit: limit } : {},
      {
        $lookup: {
          localField: 'hash',
          from: 'occurences',
          foreignField: 'hash',
          as: 'count',
        },
      },
      { $unwind: '$count' },
      projectAgg,
    ].filter((a) => Object.entries(a).length !== 0);
  }

  const matchProjectOptimize: any = {};
  if (!!filter.project) {
    const { project } = filter;
    delete filter.project;
    matchProjectOptimize.$match = {
      project,
    };
  }

  return [
    matchProjectOptimize,
    {
      $lookup: {
        localField: 'hash',
        from: 'occurences',
        foreignField: 'hash',
        as: 'count',
      },
    },
    { $unwind: '$count' },
    projectAgg,
    { $match: filter },
    sort ? { $sort: { createdAt: -1, requestPacketIndex: -1 } } : {},
    isHashDistinct ? distinctHashAgg : {},
    skip ? { $skip: skip } : {},
    limit ? { $limit: limit } : {},
  ].filter((a) => Object.entries(a).length !== 0);
}

function minimizePacketOutput(packets: RawPacket[]) {
  return packets.map((p) => ({
    _id: p._id,
    hash: p.hash,
    origin: p.origin,
    path: p.path,
    method: p.method,
    count: (p as any).count,
  }));
}

function filterBodyQuery({
  offset = 0,
  limit = 999999999,
  body,
  requestBody,
  responseBody,
  matchedIds,
  packets,
  censors,
}: {
  offset: number;
  limit: number;
  body?: string;
  requestBody?: string;
  responseBody?: string;
  matchedIds: string[];
  packets: RawPacket[];
  censors: Censor[];
}): RawPacket[] {
  const setMatchedId: Set<string> = new Set();
  matchedIds.forEach((id) => setMatchedId.add(id));
  const results = [];
  for (let i = 0; i < packets.length && results.length < limit; ++i) {
    const p = packets[i];
    let check = false;
    if (body)
      check =
        setMatchedId.has(p.requestBodyHash) ||
        setMatchedId.has(p.responseBodyHash);
    if (requestBody) check = setMatchedId.has(p.requestBodyHash);
    if (responseBody) check = setMatchedId.has(p.responseBodyHash);
    if (check && !isCensorsMatchPacket(censors, p)) {
      if (offset > 0) offset -= 1;
      else results.push(p);
    }
  }
  return results;
}

function complexPacketCount(packets: RawPacket[]) {
  const map = new Map<string, number>();
  packets.forEach((p) => {
    map.set(p.hash, (map.get(p.hash) || 0) + 1);
  });
  const uniqueEndpoints = map.size;
  let mostRepeat = -1,
    minRepeat = 99999999;
  const hashMost = [],
    hashMin = [];
  for (const [key, value] of map) {
    mostRepeat = Math.max(value, mostRepeat);
    minRepeat = Math.min(value, minRepeat);
  }
  for (const [key, value] of map) {
    if (mostRepeat === value) hashMost.push(key);
    if (minRepeat === value) hashMin.push(key);
  }

  const rmUniquePackets = packets.reduce((prev, cur) => {
    if (!prev.find((v) => v.hash === cur.hash)) {
      prev.push(cur);
    }
    return prev;
  }, []);
  const packetMost = rmUniquePackets.filter((p) => hashMost.includes(p.hash));
  const packetMin = rmUniquePackets.filter((p) => hashMin.includes(p.hash));
  return {
    uniqueEndpoints,
    packetMost,
    packetMin,
  };
}

@Injectable()
export class ProjectPacketsService {
  constructor(
    @InjectModel(Project.name) private projectModel: Model<ProjectDocument>,
    @InjectModel(Censor.name) private censorModel: Model<CensorDocument>,
    @InjectModel(RawPacket.name)
    private rawPacketModel: Model<RawPacketDocument>,
  ) {}

  async countPacket(filter: any, distinctCol = '', isHashDistinct = false) {
    const aggForCountPackets = countFilteredPacketsAgg(
      filter,
      distinctCol,
      isHashDistinct,
    );
    const numRowsQueried = await this.rawPacketModel
      .aggregate(aggForCountPackets)
      .allowDiskUse(true);
    return numRowsQueried[0]?.count || 0;
  }

  async getAllPacketsWithDistinctCol(
    filter: any,
    distinctCol = '',
    isHashDistinct = false,
  ) {
    const aggGetPackets = countFilteredPacketsAgg(
      filter,
      distinctCol,
      isHashDistinct,
    );
    aggGetPackets.pop();
    return (
      await this.rawPacketModel.aggregate(aggGetPackets).allowDiskUse(true)
    ).map((obj) => obj._id);
  }

  async getOneProjectDashboard(
    projectName: string,
    query: QueryMiniDashboardDto,
  ) {
    const project = await this.projectModel.findOne({ name: projectName });
    if (!project)
      throw new NotFoundException({}, `Not found project ${projectName}`);

    const numAllPackets = await this.rawPacketModel
      .find({ project: projectName })
      .countDocuments();
    const numAllOrigins = (
      await this.rawPacketModel.distinct('origin', { project: projectName })
    ).length;

    const filter = {
      project: projectName,
      ...query.criteria,
    };

    if (query.body || query.requestBody || query.responseBody) {
      const bodyQuery = getOneExist(
        query.body,
        query.requestBody,
        query.responseBody,
      );
      const agg = findPacketsAggregation(filter, query.queryDistinct);
      const packets = await this.rawPacketModel
        .aggregate(agg)
        .allowDiskUse(true);
      const matchedBodyId = await grepRegexInDirectory(
        path.join('/files', projectName),
        bodyQuery,
      );
      const censors = await this.censorModel.find({
        $or: [
          { project: projectName, type: CensorType.ONE },
          { type: CensorType.ALL },
        ],
      });
      const matchBodyPackets = filterBodyQuery({
        offset: 0,
        limit: 99999999,
        ...query,
        packets,
        matchedIds: matchedBodyId,
        censors,
      });
      const origins = [...new Set(matchBodyPackets.map((p) => p.origin))];
      const { uniqueEndpoints, packetMost, packetMin } =
        complexPacketCount(matchBodyPackets);
      return {
        origins,
        numPackets: matchBodyPackets.length,
        uniqueEndpoints,
        packetMost: minimizePacketOutput(packetMost),
        packetMin: minimizePacketOutput(packetMin),
        numAllPackets,
        numAllOrigins,
        numMostAppeared: packetMost[0]?.count,
        numLeastAppeared: packetMin[0]?.count,
      };
    }

    const agg = findPacketsAggregation(filter, query.queryDistinct);
    const res = await this.rawPacketModel
      .aggregate([
        ...agg,
        {
          $group: {
            _id: null,
            mostAppeared: { $max: '$count' },
            leastAppeared: { $min: '$count' },
          },
        },
      ])
      .allowDiskUse(true);
    const numMostAppeared = res.length > 0 ? res[0].mostAppeared : -1;
    const numLeastAppeared = res.length > 0 ? res[0].leastAppeared : -1;

    return {
      origins: null,
      numPackets: null,
      uniqueEndpoints: null,
      numMostAppeared,
      numLeastAppeared,
      numAllPackets,
      numAllOrigins,
      packetMost: null,
      packetMin: null,
    };
  }

  // For performance purpose
  async queryDashboardAdditionalData(
    projectName: string,
    query: QueryMiniDashboardAdditionalDataDto,
  ) {
    const filter = {
      project: projectName,
      ...query.criteria,
    };
    if (query.type === DashboardAdditionalDataType.NUM_PACKETS)
      return this.countPacket(filter, '', query.queryDistinct);
    if (query.type === DashboardAdditionalDataType.ORIGINS)
      return this.getAllPacketsWithDistinctCol(
        filter,
        'origin',
        query.queryDistinct,
      );
    if (query.type === DashboardAdditionalDataType.UNIQUE_ENDPOINTS)
      return this.countPacket(filter, 'hash', query.queryDistinct);

    return null;
  }

  async queryPackets(projectName: string, query: QueryPacketDto) {
    const project = await this.projectModel.findOne({ name: projectName });
    if (!project)
      throw new NotFoundException([], `Not found project ${projectName}`);
    const filter = {
      project: projectName,
      ...query.criteria,
    };
    if (query.body || query.requestBody || query.responseBody) {
      const bodyQuery = getOneExist(
        query.body,
        query.requestBody,
        query.responseBody,
      );
      const agg = findPacketsAggregation(filter, query.queryDistinct, true);
      const packets = await this.rawPacketModel
        .aggregate(agg)
        .allowDiskUse(true);
      const matchedBodyId = await grepRegexInDirectory(
        path.join('/files', projectName),
        bodyQuery,
      );
      const censors = await this.censorModel.find({
        $or: [
          { project: projectName, type: CensorType.ONE },
          { type: CensorType.ALL },
        ],
      });
      const resultPackets = filterBodyQuery({
        ...query,
        packets,
        matchedIds: matchedBodyId,
        censors,
      });
      if (!query.minimal) return resultPackets;
      return minimizePacketOutput(resultPackets);
    }
    const agg = findPacketsAggregation(
      filter,
      query.queryDistinct,
      true,
      query.offset,
      query.limit,
    );
    const resultPackets = await this.rawPacketModel
      .aggregate(agg)
      .allowDiskUse(true);
    if (!query.minimal) return resultPackets;
    return minimizePacketOutput(resultPackets);
  }
}
