import { Controller, Get, Req, UseGuards } from '@nestjs/common';
import { OauthService } from './oauth.service';
import { GoogleOAuthGuard } from '../common/guards/google-oauth.guard';
import { Request } from 'express';

@Controller('oauth')
export class OauthController {
  constructor(private readonly oauthService: OauthService) {}

  @Get('google')
  @UseGuards(GoogleOAuthGuard)
  public async googleAuth() {
    // This route will redirect to Google
  }

  @Get('google/callback')
  @UseGuards(GoogleOAuthGuard)
  public async googleAuthRedirect(@Req() req: Request) {
    // req.user will have the Google profile info from the strategy
    return req.user;
  }
}
