import { Controller, Get } from '@nestjs/common';

@Controller('healthcheck')
export class HealthcheckController {
  @Get()
  healthCheck(): string {
    return 'OK';
  }
}
