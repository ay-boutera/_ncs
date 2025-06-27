import {
  Controller,
  Post,
  Body,
  UseGuards,
  HttpCode,
  HttpStatus,
  Get,
  Req,
  Param,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import {
  changePasswordDto,
  ChangePasswordForLoggedInUserDto,
  LoginDto,
  RegisterDto,
} from './dto/auth.dto';
import { LocalAuthGuard } from '../common/guards/local-auth.guard';
import { JwtAuthGuard } from '../common/guards/jwt-auth.guard';
import { EmailDto } from './dto/auth.dto';
import { VerifyCodeDto } from './dto/auth.dto';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @HttpCode(HttpStatus.CREATED)
  @Post('register')
  public async register(@Body() registerDto: RegisterDto) {
    return this.authService.register(registerDto);
  }

  @HttpCode(HttpStatus.OK)
  @UseGuards(LocalAuthGuard)
  @Post('login')
  public async login(@Body() loginDto: LoginDto) {
    return this.authService.login(loginDto);
  }

  @UseGuards(JwtAuthGuard)
  @Post('logout')
  public async logout(@Req() req) {
    return this.authService.logout(req.user);
  }

  @HttpCode(HttpStatus.OK)
  @Post('refreshToken/:refresh_token')
  public async refreshToken(@Param('refresh_token') refreshToken: string) {
    return this.authService.refreshToken(refreshToken);
  }

  @HttpCode(HttpStatus.OK)
  @Post('reset-password')
  public async resetPassword(@Body() email: EmailDto) {
    return this.authService.resetPassword(email);
  }

  @HttpCode(HttpStatus.OK)
  @Post('verify-code')
  public async verifyCode(@Body() VerifyCodeDto: VerifyCodeDto) {
    return this.authService.verifyCode(VerifyCodeDto);
  }

  @HttpCode(HttpStatus.OK)
  @Post('change-password')
  public async changePassword(@Body() changePasswordDto: changePasswordDto) {
    return this.authService.changePassword(changePasswordDto);
  }

  @HttpCode(HttpStatus.OK)
  @UseGuards(JwtAuthGuard)
  @Post('change-password-for-logged-in-user')
  public async changePasswordForLoggedInUser(
    @Body() ChangePasswordForLoggedInUserDto: ChangePasswordForLoggedInUserDto,
  ) {
    return this.authService.changePasswordForLoggedInUser(
      ChangePasswordForLoggedInUserDto,
    );
  }
}
