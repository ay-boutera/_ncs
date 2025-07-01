import {
  Injectable,
  UnauthorizedException,
  ConflictException,
  BadRequestException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { PrismaService } from '../prisma/prisma.service';
import {
  changePasswordDto,
  ChangePasswordForLoggedInUserDto,
  EmailDto,
  LoginDto,
  RegisterDto,
  VerifyCodeDto,
} from './dto/auth.dto';
import { MailerService } from '@nestjs-modules/mailer';
import generateTokens from '../common/jwt/generateTokens';
import * as bcrypt from 'bcrypt';

@Injectable()
export class AuthService {
  constructor(
    private prismaService: PrismaService,
    private jwtService: JwtService,
    private mailService: MailerService,
  ) {}

  public async validateUser(email: string, pass: string): Promise<any> {
    const user = await this.prismaService.user.findUnique({
      where: { email },
    });
    if (!user) {
      return null;
    }
    const isPasswordValid = await bcrypt.compare(pass, user.password);
    if (!isPasswordValid) {
      return null;
    }
    const { password, ...result } = user; // Exclude password from result
    return result;
  }

  public async register(registerDto: RegisterDto) {
    const { userName, email, firstName, lastName, password, confirmPassword } =
      registerDto;

    // Check if passwords match
    if (password !== confirmPassword) {
      throw new BadRequestException('Passwords do not match');
    }

    // Check if userName or email already exists
    const existingUser = await this.prismaService.user.findFirst({
      where: {
        OR: [{ userName }, { email }],
      },
    });

    if (existingUser) {
      if (existingUser.userName === userName) {
        throw new ConflictException('Username is already taken');
      }
      if (existingUser.email === email) {
        throw new ConflictException('Email is already registered');
      }
    }

    const hashedPassword = bcrypt.hashSync(password, 10);
    const user = await this.prismaService.user.create({
      data: {
        userName,
        email,
        firstName,
        lastName,
        password: hashedPassword,
      },
    });

    const { password: _, ...result } = user;
    const payload = {
      id: user.id,
      email: user.email,
      role: user.role,
    };

    const tokens = generateTokens(this.jwtService, payload);
    return {
      user: {
        id: user.id,
        userName: user.userName,
        email: user.email,
        firstName: user.firstName,
        lastName: user.lastName,
        role: user.role,
      },
      ...tokens,
    };
  }

  public async login(loginDto: LoginDto) {
    const { email, password } = loginDto;
    const user = await this.prismaService.user.findUnique({
      where: { email },
    });

    if (!user) {
      throw new UnauthorizedException('Invalid email or password');
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      throw new UnauthorizedException('Invalid email or password');
    }

    const payload = {
      id: user.id,
      email: user.email,
      role: user.role,
    };
    

    const tokens = generateTokens(this.jwtService, payload);
    return {
      data: user,
      ...tokens,
    };
  }

  public async refreshToken(refreshToken: string) {
    // Validate that refresh token is provided
    if (!refreshToken || refreshToken.trim() === '') {
      throw new UnauthorizedException('Refresh token is required');
    }

    try {
      // Verify the refresh token
      const payload = this.jwtService.verify(refreshToken, {
        secret: process.env.JWT_REFRESH_SECRET,
      });

      // Check if it's actually a refresh token
      if (!payload || payload.countEx <= 0) {
        throw new UnauthorizedException(
          'Invalid refresh token , please go to login',
        );
      }

      const { exp, ...newpayload } = payload; // Exclude exp from payload

      const newpayloadaccess = {
        sub: newpayload.sub,
        userName: newpayload.userName,
        email: newpayload.email,
        role: newpayload.role,
      };

      const accessToken = this.jwtService.sign(newpayloadaccess, {
        secret: process.env.JWT_SECRET,
      });

      const refresh_Token = this.jwtService.sign(
        {
          ...newpayload,
          countEx: newpayload.countEx - 1, // Decrement the count
        },
        {
          secret: process.env.JWT_REFRESH_SECRET,
          // You can set a longer expiration for refresh tokens
        },
      );

      return {
        message: 'Tokens refreshed successfully',
        accessToken,
        refresh_Token,
      };
    } catch (error) {
      // Handle specific JWT errors
      if (error.name === 'JsonWebTokenError') {
        throw new UnauthorizedException(
          'Invalid refresh token: ' + error.message,
        );
      }
      if (error.name === 'TokenExpiredError') {
        throw new UnauthorizedException('Refresh token expired');
      }
      throw new UnauthorizedException('Invalid refresh token');
    }
  }

  public async logout(userId: number) {
    // For now, just return success message
    // In a more secure implementation, you'd blacklist the tokens
    return { message: 'Logged out successfully' };
  }

  // Reset password functionality
  public async resetPassword(email: EmailDto) {
    const { email: userEmail } = email;
    const user = await this.prismaService.user.findUnique({
      where: { email: userEmail },
    });

    if (!user) {
      throw new BadRequestException('Email not found');
    }

    // create code of 6 digits
    const resetCode = Math.floor(100000 + Math.random() * 900000).toString();
    if (!resetCode) {
      throw new BadRequestException('Failed to generate reset code');
    }
    await this.prismaService.user.update({
      where: { email: userEmail },
      data: { verificationCode: resetCode },
    });

    const emailHtml = `
      <!DOCTYPE html>
      <html>
      <head>
          <style>
              body {
                  font-family: Arial, sans-serif;
                  background-color: #f4f4f4;
                  margin: 0;
                  padding: 0;
              }
              .container {
                  max-width: 600px;
                  margin: 20px auto;
                  background-color: #ffffff;
                  padding: 20px;
                  border-radius: 8px;
                  box-shadow: 0 2px 4px rgba(0,0,0,0.1);
              }
              .header {
                  color: #333333;
                  text-align: center;
                  padding-bottom: 20px;
                  border-bottom: 1px solid #dddddd;
              }
              .content {
                  padding: 20px 0;
              }
              .code {
                  font-size: 24px;
                  font-weight: bold;
                  text-align: center;
                  padding: 12px;
                  background-color: #f2f2f2;
                  border: 1px dashed #cccccc;
                  margin: 20px 0;
                  color: #333;
              }
              .footer {
                  text-align: center;
                  font-size: 12px;
                  color: #777777;
                  padding-top: 20px;
                  border-top: 1px solid #dddddd;
              }
          </style>
      </head>
      <body>
          <div class="container">
              <div class="header">
                  <h2>Password Reset Request</h2>
              </div>
              <div class="content">
                  <p>Hello ${user.userName},</p>
                  <p>You requested a password reset. Please use the following verification code to reset your password:</p>
                  <div class="code">${resetCode}</div>
                  <p>This code will expire in 10 minutes.</p>
                  <p>If you did not request a password reset, you can safely ignore this email.</p>
              </div>
              <div class="footer">
                  <p>Thank you for using our application!</p>
              </div>
          </div>
      </body>
      </html>`;
    // Send email with reset code
    this.sendMail(
      emailHtml,
      'kingsleyokgeorge@gmail.com',
      userEmail,
      `Password Reset Code`,
    );
    // Return the reset code (or a success message)
    return {
      message: `code sent successfully to your email ${userEmail}`,
    };
  }

  // Utility method to check if user exists (useful for other services)
  public async findUserById(userId: number) {
    return this.prismaService.user.findUnique({
      where: { id: userId },
    });
  }

  public async verifyCode(verificationCode: VerifyCodeDto) {
    const { email, code } = verificationCode;
    const user = await this.prismaService.user.findUnique({
      where: { email },
    });
    if (!user) {
      throw new BadRequestException('Email not found');
    }
    if (user.verificationCode !== code) {
      throw new BadRequestException('Invalid verification code');
    }
    // Clear the verification code after successful verification
    await this.prismaService.user.update({
      where: { email },
      data: { verificationCode: null },
    });

    return {
      message: 'Verification code is valid , go to change your password',
    };
  }

  public async changePassword(changePasswordDto: changePasswordDto) {
    const { email, password, confirmPassword } = changePasswordDto;

    // Check if passwords match
    if (password !== confirmPassword) {
      throw new BadRequestException('Passwords do not match');
    }

    const user = await this.prismaService.user.findUnique({
      where: { email },
    });

    if (!user) {
      throw new BadRequestException('Email not found');
    }

    // Hash the new password
    const hashedPassword = bcrypt.hashSync(password, 10);

    // Update the user's password
    await this.prismaService.user.update({
      where: { email },
      data: { password: hashedPassword },
    });

    return { message: 'Password changed successfully , go to login' };
  }

  public async changePasswordForLoggedInUser(
    ChangePasswordForLoggedInUserDto: ChangePasswordForLoggedInUserDto,
  ) {
    const { userId, currentPassword, newPassword, confirmPassword } =
      ChangePasswordForLoggedInUserDto;

    // Check if passwords match
    if (newPassword !== confirmPassword) {
      throw new BadRequestException('Passwords do not match');
    }

    const user = await this.prismaService.user.findUnique({
      where: { id: userId },
    });

    if (!user) {
      throw new BadRequestException('User not found');
    }

    // Check if old password is correct
    const isOldPasswordValid = await bcrypt.compare(
      currentPassword,
      user.password,
    );
    if (!isOldPasswordValid) {
      throw new UnauthorizedException('urrent password is incorrect');
    }

    // Hash the new password
    const hashedNewPassword = bcrypt.hashSync(newPassword, 10);

    // Update the user's password
    await this.prismaService.user.update({
      where: { id: userId },
      data: { password: hashedNewPassword },
    });

    return { message: 'Password changed successfully' };
  }

  private sendMail(htmlMsg: string, from: string, to: string, subject: string) {
    const message = htmlMsg;

    this.mailService.sendMail({
      from: from,
      to: to,
      subject: subject,
      html: htmlMsg,
    });
  }
}
