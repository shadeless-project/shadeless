import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { File, FileSchema } from 'libs/schemas/file.schema';
import { BurpController } from './burp.controller';
import { BurpPacketService } from './burp-packet/burp-packet.service';
import { BurpFileService } from './burp-file/burp-file.service';
import { Path, PathSchema } from 'libs/schemas/path.schema';
import { User, UserSchema } from 'libs/schemas/user.schema';
import { Project, ProjectSchema } from 'libs/schemas/project.schema';
import { RawPacket, RawPacketSchema } from 'libs/schemas/raw_packet.schema';
import { Occurence, OccurenceSchema } from 'libs/schemas/occurence.schema';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: File.name, schema: FileSchema }]),
    MongooseModule.forFeature([{ name: Path.name, schema: PathSchema }]),
    MongooseModule.forFeature([{ name: User.name, schema: UserSchema }]),
    MongooseModule.forFeature([{ name: Project.name, schema: ProjectSchema }]),
    MongooseModule.forFeature([
      { name: Occurence.name, schema: OccurenceSchema },
    ]),
    MongooseModule.forFeature([
      { name: RawPacket.name, schema: RawPacketSchema },
    ]),
  ],
  controllers: [BurpController],
  providers: [BurpPacketService, BurpFileService],
})
export class BurpModule {}
