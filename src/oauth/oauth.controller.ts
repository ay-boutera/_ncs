import { Controller, Get, Req, UseGuards, Post } from '@nestjs/common';
import { OauthService } from './oauth.service';
import { GoogleOAuthGuard } from '../common/guards/google-oauth.guard';
import { Request } from 'express';

@Controller('oauth')
export class OauthController {
  constructor(private readonly oauthService: OauthService) {}

  @Get('google/sign') // if the email of the user exists in the database, it will be sign-in, otherwise it will create a new user (sign-up)
  @UseGuards(GoogleOAuthGuard)
  public async googleAuth() {
    return {
      message: 'Redirecting to Google for authentication...',
    };
  }

  @Get('google_/callback')
  @UseGuards(GoogleOAuthGuard)
  public async googleAuthRedirect(@Req() req: Request) {
    const user = req.user as any; // user will be populated by the GoogleOAuthGuard
    const userData = {
      email: user.email,
      firstName: user.firstName,
      lastName: user.lastName,
      picture: user.picture,
    };
    return await this.callbackSign(userData);
  }

  @Post('callback/sign')
  async callbackSign(user: any) {
    return await this.oauthService.validateUser(user);
  }
}
