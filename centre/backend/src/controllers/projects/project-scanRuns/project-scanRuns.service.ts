import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Project, ProjectDocument } from 'libs/schemas/project.schema';
import { ScanRun, ScanRunDocument } from 'libs/schemas/scan_run.schema';
import { Model } from 'mongoose';

@Injectable()
export class ProjectScanRunsService {
  constructor(
    @InjectModel(ScanRun.name) private scanRunModel: Model<ScanRunDocument>,
    @InjectModel(Project.name) private projectModel: Model<ProjectDocument>,
  ) {}

  async getScanRunDetails(projectName: string) {
    const project = await this.projectModel.findOne({ project: projectName });
    if (!project)
      throw new NotFoundException(' ', `Not found project ${projectName}`);

    const agg: any[] = [
      { $match: { project: projectName } },
      {
        $lookup: {
          localField: 'project',
          from: 'projects',
          foreignField: 'name',
          as: 'project',
        },
      },
      { $unwind: '$project' },
      {
        $lookup: {
          localField: 'requestPacketId',
          from: 'rawpackets',
          foreignField: 'requestPacketId',
          as: 'packet',
        },
      },
      { $unwind: '$packet' },
      {
        $lookup: {
          localField: 'scannerId',
          from: 'jaelesscanners',
          foreignField: '_id',
          as: 'scanner',
        },
      },
      { $unwind: '$scanner' },
    ];

    const results = await this.scanRunModel.aggregate(agg).allowDiskUse(true);
    return results;
  }
}
