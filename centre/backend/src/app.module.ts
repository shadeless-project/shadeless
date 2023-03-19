import { MiddlewareConsumer, Module, NestModule } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
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
import { Occurence, OccurenceSchema } from 'libs/schemas/occurence.schema';
import { Path, PathSchema } from 'libs/schemas/path.schema';
import { Censor, CensorSchema } from 'libs/schemas/censor.schema';
import { RawPacket, RawPacketSchema } from 'libs/schemas/raw_packet.schema';
import { PacketActionsQueue } from 'message-queue/packets-actions.queue';

function getAppModuleImports() {
  const modules = [
    MongooseModule.forRoot(process.env.DATABASE_URL),
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
    BurpModule,
    ProjectsModule,
    AuthModule,
    CensorsModule,
    StaticFileModule,
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
  providers: [BurpQueue, PacketActionsQueue, BurpPacketService],
})
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer): void {
    // consumer.apply(AppLoggerMiddleware).forRoutes('*');
  }
}
