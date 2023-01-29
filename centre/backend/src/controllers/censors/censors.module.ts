import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { Censor, CensorSchema } from 'libs/schemas/censor.schema';
import { CensorsController } from './censors.controller';

@Module({
  controllers: [CensorsController],
  imports: [
    MongooseModule.forFeature([{ name: Censor.name, schema: CensorSchema }]),
  ],
  providers: [],
})
export class CensorsModule {}
