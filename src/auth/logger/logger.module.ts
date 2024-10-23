import { Module } from '@nestjs/common';
import { createLogger, transports, format } from 'winston';

const logger = createLogger({
  level: 'info',
  format: format.combine(format.timestamp(), format.json()),
  transports: [new transports.Console()],
});

@Module({
  providers: [
    {
      provide: 'Logger',
      useValue: logger,
    },
  ],
  exports: ['Logger'],
})
export class LoggerModule {}
