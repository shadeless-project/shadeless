import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { Account, AccountSchema } from 'libs/schemas/account.schema';
import { Censor, CensorSchema } from 'libs/schemas/censor.schema';
import { CensorsController } from './censors.controller';

@Module({
  controllers: [CensorsController],
  imports: [
    MongooseModule.forFeature([{ name: Censor.name, schema: CensorSchema }]),
    MongooseModule.forFeature([{ name: Account.name, schema: AccountSchema }]),
  ],
  providers: [],
})
export class CensorsModule {}
