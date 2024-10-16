import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UserModule } from './user/user.module';
import { PrismaService } from './Prisma/prisma.service';
@Module({
  imports: [UserModule],
  controllers: [AppController],
  providers: [PrismaService, AppService],
  exports: [PrismaService],
})
export class AppModule {}
