import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import path from 'path';
import fs from 'fs/promises';
import { Project, ProjectDocument } from 'libs/schemas/project.schema';
import { Model } from 'mongoose';
import { PostProjectDto, PutProjectDto } from '../projects.dto';
import { File, FileDocument } from 'libs/schemas/file.schema';
import { User, UserDocument } from 'libs/schemas/user.schema';
import { RawPacket, RawPacketDocument } from 'libs/schemas/raw_packet.schema';
import { Path, PathDocument } from 'libs/schemas/path.schema';
import { Occurence, OccurenceDocument } from 'libs/schemas/occurence.schema';

@Injectable()
export class ProjectsService {
  constructor(
    @InjectModel(Project.name) private projectModel: Model<ProjectDocument>,
    @InjectModel(Occurence.name)
    private occurenceModel: Model<OccurenceDocument>,
    @InjectModel(File.name) private fileModel: Model<FileDocument>,
    @InjectModel(User.name) private userModel: Model<UserDocument>,
    @InjectModel(Path.name) private pathModel: Model<PathDocument>,
    @InjectModel(RawPacket.name)
    private rawPacketModel: Model<RawPacketDocument>,
  ) {}

  async createProject(project: PostProjectDto) {
    await this.projectModel.create(project);
    await fs.mkdir(path.join('/files', project.name), { recursive: true });
    return 'Successfully created new project';
  }

  async getAllProjects() {
    return this.projectModel.find();
  }

  async getOneProject(projectName: string) {
    const project = await this.projectModel.findOne({ name: projectName });
    if (!project)
      throw new NotFoundException({}, `Not found project ${projectName}`);
    return project;
  }

  async updateProject(projectName: string, updateDto: PutProjectDto) {
    const { modifiedCount } = await this.projectModel.updateOne(
      { name: projectName },
      { $set: updateDto },
    );
    if (!modifiedCount)
      throw new NotFoundException({}, `Not found project ${projectName}`);
    return 'Successfully update project';
  }

  async deleteProject(projectName: string) {
    await this.projectModel.deleteOne({ name: projectName });
    const filePath = path.join('/files', projectName);
    await fs.rm(filePath, { recursive: true, force: true });
    await Promise.all([
      this.fileModel.deleteMany({ project: projectName }),
      this.userModel.deleteMany({ project: projectName }),
      this.rawPacketModel.deleteMany({ project: projectName }),
      this.occurenceModel.deleteMany({ project: projectName }),
      this.pathModel.deleteMany({ project: projectName }),
    ]);
    return 'Successfully deleted project';
  }
}
