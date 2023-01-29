import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Project, ProjectDocument } from 'libs/schemas/project.schema';
import { User, UserDocument } from 'libs/schemas/user.schema';
import { Model } from 'mongoose';

@Injectable()
export class ProjectUsersService {
  constructor(
    @InjectModel(User.name) private userModel: Model<UserDocument>,
    @InjectModel(Project.name) private projectModel: Model<ProjectDocument>,
  ) {}

  async getUsersInProject(projectName: string) {
    const project = await this.projectModel.findOne({ project: projectName });
    if (!project)
      throw new NotFoundException(' ', `Not found project ${projectName}`);
    const users = await this.userModel.find({ project: projectName });
    return users;
  }
}
