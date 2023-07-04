import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { Project, ProjectSchema } from 'libs/schemas/project.schema';
import { RawPacket, RawPacketSchema } from 'libs/schemas/raw_packet.schema';
import { BullModule } from '@nestjs/bull';
import { ScannerQueue } from 'message-queue/scanner.queue';
import { ScanRun, ScanRunSchema } from 'libs/schemas/scan_run.schema';
import {
  JaelesScanner,
  JaelesScannerSchema,
} from 'libs/schemas/jaeles_scanner.schema';
import { ScanRunsService } from './scanRuns.service';
import { ScanRunsController } from './scanRuns.controller';
import { Account, AccountSchema } from 'libs/schemas/account.schema';

@Module({
  controllers: [ScanRunsController],
  imports: [
    MongooseModule.forFeature([
      { name: Project.name, schema: ProjectSchema },
      { name: RawPacket.name, schema: RawPacketSchema },
      { name: ScanRun.name, schema: ScanRunSchema },
      { name: JaelesScanner.name, schema: JaelesScannerSchema },
      { name: Account.name, schema: AccountSchema },
    ]),
    BullModule.registerQueue({ name: ScannerQueue.name }),
  ],
  providers: [ScanRunsService],
})
export class ScanRunsModule {}
