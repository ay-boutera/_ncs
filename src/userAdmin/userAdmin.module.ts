import { Module } from '@nestjs/common';
import { UserAdminService } from './userAdmin.service';
import { UserController } from './userAdmin.controller';

@Module({
  controllers: [UserController],
  providers: [UserAdminService],
  exports: [UserAdminService],
})
export class UserAdminModule {}
