import { Controller, Get } from '@nestjs/common';
import { Public } from './common/decorater/public.decorater';

@Controller('health')
export class HealthController {
  @Public()
  @Get()
  checkHealth() {
    return {
      status: 'UP',
      timestamp: new Date().toISOString(),
    };
  }
}
