import {
  BadRequestException,
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  Param,
  Post,
  Put,
  UseGuards,
} from '@nestjs/common';
import {
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
    private usersService: ProjectUsersService,
    private projectsService: ProjectsService,
  ) {}

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
    return this.usersService.getUsersInProject(projectName);
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
  async deleteProject(@Param('name') name: string) {
    return this.projectsService.deleteProject(name);
  }

  @Delete(':name/packets')
  @UseGuards()
  async deletePackets(@Param('name') name: string) {
    return this.projectsService.deleteProject(name);
  }
}
