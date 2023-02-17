import { MiddlewareConsumer, Module, NestModule } from '@nestjs/common';
import { InjectModel, MongooseModule } from '@nestjs/mongoose';
import { HealthcheckController } from './controllers/healthcheck/healthcheck.controller';
import { BurpModule } from './controllers/burp/burp.module';
import { ProjectsModule } from './controllers/projects/projects.module';
import { AuthModule } from 'controllers/auth/auth.module';
import { StaticFileModule } from 'controllers/static-file/static-file.module';
import { CensorsModule } from 'controllers/censors/censors.module';
import {
  Account,
  AccountDocument,
  AccountRole,
  AccountSchema,
} from 'libs/schemas/account.schema';
import { Model } from 'mongoose';
import { AccountsModule } from 'controllers/account/accounts.module';

@Module({
  imports: [
    MongooseModule.forRoot(process.env.DATABASE_URL),
    MongooseModule.forFeature([{ name: Account.name, schema: AccountSchema }]),
    BurpModule,
    ProjectsModule,
    AuthModule,
    CensorsModule,
    StaticFileModule,
    AccountsModule,
  ],
  controllers: [HealthcheckController],
  providers: [],
})
export class AppModule implements NestModule {
  constructor(
    @InjectModel(Account.name) private accountModel: Model<AccountDocument>,
  ) {}

  configure(consumer: MiddlewareConsumer): void {
    // consumer.apply(AppLoggerMiddleware).forRoutes('*');
  }

  async initdb() {
    const adminAccount = await this.accountModel.findOne({
      role: AccountRole.ADMIN,
    });
    if (!adminAccount) {
      await this.accountModel.create({
        username: process.env.ADMIN_USERNAME || 'admin',
        password: process.env.ADMIN_PASSWORD || 'adminpassword',
        role: AccountRole.ADMIN,
      });
    }
  }

  onApplicationBootstrap() {
    this.initdb()
      .catch((e) => console.log(e))
      .then(() => {
        console.log('Done initdb');
      });
  }
}
