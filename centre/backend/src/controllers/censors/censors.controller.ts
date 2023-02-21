import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  Param,
  Post,
  Query,
  UseGuards,
} from '@nestjs/common';
import { AdminGuard, AuthGuard } from 'libs/middlewares/auth.guard';
import { Censor, CensorDocument, CensorType } from 'libs/schemas/censor.schema';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { PostCensorDto } from './censors.dto';

@Controller('censors')
@UseGuards(AuthGuard)
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

  @Delete('/:id')
  @UseGuards(AdminGuard)
  async deleteCensor(@Param('id') _id: string) {
    await this.censorModel.findOneAndDelete({ _id });
    return 'Successfully deleted censor';
  }
}
