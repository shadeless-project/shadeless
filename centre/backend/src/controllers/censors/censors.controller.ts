import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  Param,
  Post,
  Put,
  Query,
  UseGuards,
} from '@nestjs/common';
import { AdminGuard, LoginGuard } from 'libs/middlewares/auth.guard';
import { Censor, CensorDocument, CensorType } from 'libs/schemas/censor.schema';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { PostCensorDto, PutCensorDto } from './censors.dto';

@Controller('censors')
@UseGuards(LoginGuard)
export class CensorsController {
  constructor(
    @InjectModel(Censor.name) private censorModel: Model<CensorDocument>,
  ) {}

  @Get('/')
  async getCensors(@Query('project') project: string) {
    return this.censorModel.find({
      $or: [{ project, type: CensorType.ONE }, { type: CensorType.ALL }],
    });
  }

  @Post('/')
  @HttpCode(200)
  async createCensor(@Body() body: PostCensorDto) {
    await this.censorModel.create(body);
    return 'Successfully created censor';
  }

  @Put('/:id')
  @UseGuards(AdminGuard)
  async editCensor(@Param('id') _id: string, @Body() body: PutCensorDto) {
    await this.censorModel.findByIdAndUpdate(_id, {
      $set: body,
    });
    return 'Successfully deleted censor';
  }

  @Delete('/:id')
  @UseGuards(AdminGuard)
  async deleteCensor(@Param('id') _id: string) {
    await this.censorModel.findByIdAndDelete(_id);
    return 'Successfully deleted censor';
  }
}
