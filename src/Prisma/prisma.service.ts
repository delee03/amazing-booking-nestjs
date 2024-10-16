import {
  Injectable,
  OnModuleInit,
  INestApplication,
  Global,
} from '@nestjs/common';
import { PrismaClient } from '@prisma/client';

@Global() // Thêm @Global() để biến PrismaService thành một provider toàn cục
@Injectable()
export class PrismaService extends PrismaClient implements OnModuleInit {
  async onModuleInit() {
    await this.$connect();
  }

  async enableShutdownHooks(app: INestApplication) {
    this.$on('beforeExit', async () => {
      await app.close();
    });
  }
}
