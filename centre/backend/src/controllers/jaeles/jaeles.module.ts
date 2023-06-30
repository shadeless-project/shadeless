import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { JaelesController } from './jaeles.controller';
import { JaelesScannerService } from './jaeles_scanner.service';
import {
  JaelesScanner,
  JaelesScannerSchema,
} from 'libs/schemas/jaeles_scanner.schema';
import { Account, AccountSchema } from 'libs/schemas/account.schema';
import { JaelesSignatureService } from './jaeles_signature.service';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: JaelesScanner.name, schema: JaelesScannerSchema },
      { name: Account.name, schema: AccountSchema },
    ]),
  ],
  controllers: [JaelesController],
  providers: [JaelesScannerService, JaelesSignatureService],
})
export class JaelesModule {}
