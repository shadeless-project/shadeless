import { Controller, Get } from '@nestjs/common';
import { numCPUs } from 'clusterize.service';

@Controller('healthcheck')
export class HealthcheckController {
  @Get()
  healthCheck(): string {
    return 'OK';
  }

  @Get('stats')
  stats() {
    return {
      env: process.env.NODE_ENV,
      cpus: numCPUs,
    };
  }
}
