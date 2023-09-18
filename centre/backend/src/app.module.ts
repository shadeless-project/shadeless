import { MiddlewareConsumer, Module, NestModule } from '@nestjs/common';
import { InjectModel, MongooseModule } from '@nestjs/mongoose';
import { HealthcheckController } from './controllers/healthcheck/healthcheck.controller';
import { BurpModule } from './controllers/burp/burp.module';
import { ProjectsModule } from './controllers/projects/projects.module';
import { AuthModule } from 'controllers/auth/auth.module';
import { StaticFileModule } from 'controllers/static-file/static-file.module';
import { CensorsModule } from 'controllers/censors/censors.module';
import { AccountsModule } from 'controllers/account/accounts.module';
import { BullModule } from '@nestjs/bull';
import { DebugModule } from 'controllers/debug/debug.module';
import { BurpQueue } from 'message-queue/burp.queue';
import { BurpPacketService } from 'message-queue/burp.queue.service';
import { Project, ProjectSchema } from 'libs/schemas/project.schema';
import { User, UserSchema } from 'libs/schemas/user.schema';
import {
  Occurence,
  OccurenceDocument,
  OccurenceSchema,
} from 'libs/schemas/occurence.schema';
import { Censor, CensorSchema } from 'libs/schemas/censor.schema';
import { RawPacket, RawPacketSchema } from 'libs/schemas/raw_packet.schema';
import { PacketActionsQueue } from 'message-queue/packets-actions.queue';
import { FfufModule } from 'controllers/ffuf/ffuf.module';
import { Model } from 'mongoose';

function getAppModuleImports() {
  const modules = [
    MongooseModule.forRoot(process.env.DATABASE_URL),
    MongooseModule.forFeature([
      { name: Project.name, schema: ProjectSchema },
      { name: User.name, schema: UserSchema },
      { name: Occurence.name, schema: OccurenceSchema },
      { name: Censor.name, schema: CensorSchema },
      { name: RawPacket.name, schema: RawPacketSchema },
    ]),
    BurpModule,
    ProjectsModule,
    AuthModule,
    CensorsModule,
    StaticFileModule,
    FfufModule,
    AccountsModule,
    BullModule.forRoot({
      redis: {
        host: process.env.REDIS_HOST,
        port: 6379,
      },
    }),
  ];
  if (process.env.NODE_ENV !== 'production') modules.push(DebugModule);
  return modules;
}

@Module({
  imports: getAppModuleImports(),
  controllers: [HealthcheckController],
  providers: [BurpPacketService, BurpQueue, PacketActionsQueue],
})
export class AppModule implements NestModule {
  constructor(
    @InjectModel(Occurence.name)
    private occurentModel: Model<OccurenceDocument>,
  ) {}

  configure(consumer: MiddlewareConsumer): void {
    // consumer.apply(AppLoggerMiddleware).forRoutes('*');
  }

  async onModuleInit() {
    console.log(`Initialization...`);
    await this.occurentModel.updateMany(
      {
        fuzzCount: null,
      },
      {
        fuzzCount: 0,
      },
    );
  }
}
