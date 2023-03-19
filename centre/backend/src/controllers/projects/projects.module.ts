import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { Project, ProjectSchema } from 'libs/schemas/project.schema';
import { User, UserSchema } from 'libs/schemas/user.schema';
import { ProjectsController } from './projects.controller';
import { ProjectPacketsService } from './project-packets/project-packets.service';
import { ProjectUsersService } from './project-users/project-users.service';
import { ProjectsService } from './projects/projects.service';
import { RawPacket, RawPacketSchema } from 'libs/schemas/raw_packet.schema';
import { Path, PathSchema } from 'libs/schemas/path.schema';
import { Censor, CensorSchema } from 'libs/schemas/censor.schema';
import { Occurence, OccurenceSchema } from 'libs/schemas/occurence.schema';
import { Account, AccountSchema } from 'libs/schemas/account.schema';
import { PacketActionsQueue } from 'message-queue/packets-actions.queue';
import { BullModule } from '@nestjs/bull';
import { BurpQueue } from 'message-queue/burp.queue';

@Module({
  controllers: [ProjectsController],
  imports: [
    MongooseModule.forFeature([{ name: Account.name, schema: AccountSchema }]),
    MongooseModule.forFeature([{ name: Project.name, schema: ProjectSchema }]),
    MongooseModule.forFeature([{ name: User.name, schema: UserSchema }]),
    MongooseModule.forFeature([
      { name: Occurence.name, schema: OccurenceSchema },
    ]),
    MongooseModule.forFeature([{ name: Path.name, schema: PathSchema }]),
    MongooseModule.forFeature([{ name: Censor.name, schema: CensorSchema }]),
    MongooseModule.forFeature([
      { name: RawPacket.name, schema: RawPacketSchema },
    ]),
    BullModule.registerQueue({ name: BurpQueue.name }),
    BullModule.registerQueue({ name: PacketActionsQueue.name }),
  ],
  providers: [ProjectPacketsService, ProjectUsersService, ProjectsService],
})
export class ProjectsModule {}
