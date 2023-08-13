import {
  Body,
  Controller,
  HttpCode,
  NotFoundException,
  Post,
  UseGuards,
} from '@nestjs/common';
import { LoginGuard } from 'libs/middlewares/auth.guard';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { PostFuzzIncReqDto } from './ffuf.dto';
import { Occurence, OccurenceDocument } from 'libs/schemas/occurence.schema';

@Controller('ffuf')
@UseGuards(LoginGuard)
export class FfufController {
  constructor(
    @InjectModel(Occurence.name)
    private occurenceModel: Model<OccurenceDocument>,
  ) {}

  @Post('/')
  @HttpCode(200)
  async createCensor(@Body() body: PostFuzzIncReqDto) {
    const found = await this.occurenceModel.findOneAndUpdate(
      {
        project: body.project,
        hash: body.hash,
      },
      {
        $inc: { fuzzCount: 1 },
      },
    );
    if (found) return 'Successfully acknowledged';
    throw new NotFoundException(
      {},
      `Not found request to acknowledge the fuzz`,
    );
  }
}
