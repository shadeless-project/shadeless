import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { Account, AccountSchema } from 'libs/schemas/account.schema';
import { FfufController } from './ffuf.controller';
import { Occurence, OccurenceSchema } from 'libs/schemas/occurence.schema';

@Module({
  controllers: [FfufController],
  imports: [
    MongooseModule.forFeature([
      { name: Occurence.name, schema: OccurenceSchema },
      { name: Account.name, schema: AccountSchema },
    ]),
  ],
  providers: [],
})
export class FfufModule { }
