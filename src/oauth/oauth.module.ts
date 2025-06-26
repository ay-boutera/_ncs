import { Module } from '@nestjs/common';
import { OauthService } from './oauth.service';
import { OauthController } from './oauth.controller';
import { GoogleStrategy } from './strategies/google.strategy';

@Module({
  controllers: [OauthController],
  providers: [GoogleStrategy, OauthService],
})
export class OauthModule {}
