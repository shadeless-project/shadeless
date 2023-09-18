import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { Project, ProjectSchema } from 'libs/schemas/project.schema';
import { User, UserSchema } from 'libs/schemas/user.schema';
import { ProjectsController } from './projects.controller';
import { ProjectPacketsService } from './project-packets/project-packets.service';
import { ProjectUsersService } from './project-users/project-users.service';
import { ProjectsService } from './projects/projects.service';
import { RawPacket, RawPacketSchema } from 'libs/schemas/raw_packet.schema';
import { Censor, CensorSchema } from 'libs/schemas/censor.schema';
import { Occurence, OccurenceSchema } from 'libs/schemas/occurence.schema';
import { Account, AccountSchema } from 'libs/schemas/account.schema';
import { PacketActionsQueue } from 'message-queue/packets-actions.queue';
import { BullModule } from '@nestjs/bull';

@Module({
  controllers: [ProjectsController],
  imports: [
    MongooseModule.forFeature([
      { name: Account.name, schema: AccountSchema },
      { name: Project.name, schema: ProjectSchema },
      { name: User.name, schema: UserSchema },
      { name: Occurence.name, schema: OccurenceSchema },
      { name: Censor.name, schema: CensorSchema },
      { name: RawPacket.name, schema: RawPacketSchema },
    ]),
    BullModule.registerQueue({ name: PacketActionsQueue.name }),
  ],
  providers: [
    ProjectsService,
    ProjectUsersService,
    ProjectPacketsService,
  ],
})
export class ProjectsModule { }
