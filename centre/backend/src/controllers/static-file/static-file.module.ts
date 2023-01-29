import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { Censor, CensorSchema } from 'libs/schemas/censor.schema';
import { RawPacket, RawPacketSchema } from 'libs/schemas/raw_packet.schema';
import { StaticFileController } from './static-file.controller';

@Module({
  controllers: [StaticFileController],
  imports: [
    MongooseModule.forFeature([{ name: Censor.name, schema: CensorSchema }]),
    MongooseModule.forFeature([
      { name: RawPacket.name, schema: RawPacketSchema },
    ]),
  ],
  providers: [],
})
export class StaticFileModule {}
