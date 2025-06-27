import { Module } from '@nestjs/common';
import { UserService } from './user.service';
import { UserController, UserMeController } from './user.controller';
import { JwtModule } from '@nestjs/jwt';

@Module({
  imports: [JwtModule],
  controllers: [UserController, UserMeController],
  providers: [UserService],
})
export class UserModule {}
