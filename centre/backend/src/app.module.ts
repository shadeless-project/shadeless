import { MiddlewareConsumer, Module, NestModule } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { MongooseModule } from '@nestjs/mongoose';
import { HealthcheckController } from './controllers/healthcheck/healthcheck.controller';
import { BurpModule } from './controllers/burp/burp.module';
import { ProjectsModule } from './controllers/projects/projects.module';
import { AuthModule } from 'controllers/auth/auth.module';
import { StaticFileModule } from 'controllers/static-file/static-file.module';
import { CensorsModule } from 'controllers/censors/censors.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      envFilePath: `.env.${process.env.NODE_ENV}`,
    }),
    MongooseModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: async (config: ConfigService) => ({
        uri: config.get('DATABASE_URL'),
        useNewUrlParser: true,
        useUnifiedTopology: true,
      }),
    }),
    BurpModule,
    ProjectsModule,
    AuthModule,
    CensorsModule,
    StaticFileModule,
  ],
  controllers: [HealthcheckController],
  providers: [],
})
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer): void {
    // consumer.apply(AppLoggerMiddleware).forRoutes('*');
  }
}
