import {
  BadRequestException,
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  NotFoundException,
  Param,
  Post,
  Put,
  UseGuards,
} from '@nestjs/common';
import {
  DeletePacketsDto,
  PostProjectDto,
  PutProjectDto,
  QueryMiniDashboardAdditionalDataDto,
  QueryMiniDashboardDto,
  QueryPacketDto,
} from './projects.dto';
import { ProjectPacketsService } from './project-packets/project-packets.service';
import { ProjectUsersService } from './project-users/project-users.service';
import { ProjectsService } from './projects/projects.service';
import { AdminGuard, LoginGuard } from 'libs/middlewares/auth.guard';
import { Queue } from 'bull';
import { InjectQueue } from '@nestjs/bull';
import { PacketActionsQueue } from 'message-queue/packets-actions.queue';
import { Project, ProjectDocument } from 'libs/schemas/project.schema';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';

function onlyOneExist(...arr: string[]): boolean {
  let cnt = 0;
  arr.forEach((val) => (cnt += +!!val));
  return cnt <= 1;
}

@Controller('projects')
@UseGuards(LoginGuard)
export class ProjectsController {
  constructor(
    private projectPacketsService: ProjectPacketsService,
    private projectUsersService: ProjectUsersService,
    private projectsService: ProjectsService,
    @InjectQueue(PacketActionsQueue.name) private actionsQueue: Queue,
    @InjectModel(Project.name) private projectModel: Model<ProjectDocument>,
  ) { }

  @Get()
  async getAllProjects() {
    return this.projectsService.getAllProjects();
  }

  @Get(':name')
  async getProject(@Param('name') projectName: string) {
    return this.projectsService.getOneProject(projectName);
  }

  @Get(':name/users')
  async getUsersInProject(@Param('name') projectName: string) {
    return this.projectUsersService.getUsersInProject(projectName);
  }

  @Post(':name/query_mini_dashboard')
  @HttpCode(200)
  async miniDashboard(
    @Param('name') projectName: string,
    @Body() queryCriteria: QueryMiniDashboardDto,
  ) {
    if (
      !onlyOneExist(
        queryCriteria.body,
        queryCriteria.requestBody,
        queryCriteria.responseBody,
      )
    )
      throw new BadRequestException(
        [],
        'There should only have 1 "body" or "requestBody" or "responseBody"',
      );
    const result = await this.projectPacketsService.getOneProjectDashboard(
      projectName,
      queryCriteria,
    );
    return result;
  }

  @Post(':name/query_mini_dashboard_additional_data')
  @HttpCode(200)
  async miniDashboardAdditionalData(
    @Param('name') projectName: string,
    @Body() queryCriteria: QueryMiniDashboardAdditionalDataDto,
  ) {
    const result =
      await this.projectPacketsService.queryDashboardAdditionalData(
        projectName,
        queryCriteria,
      );
    return result;
  }

  @Post(':name/query')
  @HttpCode(200)
  async queryPackets(
    @Param('name') projectName: string,
    @Body() queryCriteria: QueryPacketDto,
  ) {
    if (
      !onlyOneExist(
        queryCriteria.body,
        queryCriteria.requestBody,
        queryCriteria.responseBody,
      )
    )
      throw new BadRequestException(
        [],
        'There should only have 1 "body" or "requestBody" or "responseBody"',
      );
    const result = await this.projectPacketsService.queryPackets(
      projectName,
      queryCriteria,
    );
    return result;
  }

  @Post()
  @HttpCode(200)
  async createProject(@Body() project: PostProjectDto) {
    return this.projectsService.createProject(project);
  }

  @Put(':name')
  async updateProject(
    @Param('name') name: string,
    @Body() body: PutProjectDto,
  ) {
    return this.projectsService.updateProject(name, body);
  }

  @Delete(':name')
  @UseGuards(AdminGuard)
  async deleteProject(@Param('name') name: string) {
    return this.projectsService.deleteProject(name);
  }

  @Delete(':name/packets')
  @UseGuards(AdminGuard)
  async deletePackets(
    @Param('name') name: string,
    @Body() query: DeletePacketsDto,
  ) {
    const project = await this.projectModel.findOne({ name });
    if (!project) throw new NotFoundException([], `Not found project ${name}`);

    if (!onlyOneExist(query.body, query.requestBody, query.responseBody))
      throw new BadRequestException(
        [],
        'There should only have 1 "body" or "requestBody" or "responseBody"',
      );

    await this.actionsQueue.add(
      PacketActionsQueue.prototype.deletePackets.name,
      {
        ...query,
        criteria: {
          project: name,
          ...query.criteria,
        },
      },
    );
    return 'OK';
  }

}
