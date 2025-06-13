import { Module } from '@nestjs/common';
import { UserAdminModule } from './userAdmin/userAdmin.module';
import { PrismaModule } from './prisma/prisma.module';
import { UserModule } from './user/user.module';
import { AuthModule } from './auth/auth.module';
import { ConfigModule } from '@nestjs/config';

@Module({
  imports: [UserModule, UserAdminModule, PrismaModule, AuthModule, ConfigModule.forRoot({
  isGlobal: true,
})],
  // The controllers and providers arrays are optional here, as they are automatically registered by the imported modules.
  controllers: [],
  providers: [],
})
export class AppModule {}
