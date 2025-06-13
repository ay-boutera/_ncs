import {
  Injectable,
  UnauthorizedException,
  ConflictException,
  BadRequestException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { PrismaService } from '../prisma/prisma.service';
import { LoginDto, RegisterDto } from './dto/auth.dto';
import * as bcrypt from 'bcrypt';

@Injectable()
export class AuthService {
  constructor(
    private prismaService: PrismaService,
    private jwtService: JwtService,
  ) {}

  public async validateUser(
    registrationNumber: string,
    pass: string,
  ): Promise<any> {
    const user = await this.prismaService.user.findUnique({
      where: { registrationNumber },
    });

    if (user && bcrypt.compareSync(pass, user.password)) {
      const { password, ...result } = user;
      return result;
    }
    return null;
  }

  private generateTokens(payload: any) {
    const accessToken = this.jwtService.sign(payload, {
      expiresIn: '15m',
    });

    const refreshToken = this.jwtService.sign(payload, {
      expiresIn: '7d',
    });

    return {
      accessToken,
      refreshToken,
    };
  }

  public async register(registerDto: RegisterDto) {
    const { registrationNumber, password, confirmPassword } = registerDto;

    // Check if passwords match
    if (password !== confirmPassword) {
      throw new BadRequestException('Passwords do not match');
    }

    // Check if user already exists
    const existingUser = await this.prismaService.user.findUnique({
      where: { registrationNumber },
    });

    if (existingUser) {
      throw new ConflictException(
        'User with this registration number already exists',
      );
    }

    const hashedPassword = bcrypt.hashSync(password, 10);
    const user = await this.prismaService.user.create({
      data: {
        registrationNumber,
        password: hashedPassword,
      },
    });

    const { password: _, ...result } = user;
    const payload = {
      sub: user.id,
      registrationNumber: user.registrationNumber,
      role: 'USER',
    };

    const tokens = this.generateTokens(payload);
    return {
      ...tokens,
      user: {
        id: user.id,
        registrationNumber: user.registrationNumber,
        role: 'USER',
      },
    };
  }

  public async login(loginDto: LoginDto) {
    const { registrationNumber, password } = loginDto;
    const user = await this.prismaService.user.findUnique({
      where: { registrationNumber },
    });

    if (!user) {
      throw new UnauthorizedException(
        'Invalid registration number or password',
      );
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      throw new UnauthorizedException(
        'Invalid registration number or password',
      );
    }

    const payload = {
      sub: user.id,
      registrationNumber: user.registrationNumber,
      role: 'USER',
    };

    const tokens = this.generateTokens(payload);
    return {
      ...tokens,
      user: {
        id: user.id,
        registrationNumber: user.registrationNumber,
        role: 'USER',
      },
    };
  }

  public async refreshToken(refreshToken: string) {
    try {
      const payload = this.jwtService.verify(refreshToken);
      const user = await this.prismaService.user.findUnique({
        where: { id: payload.sub },
      });

      if (!user) {
        throw new UnauthorizedException('Invalid refresh token');
      }

      const tokens = this.generateTokens({
        sub: user.id,
        registrationNumber: user.registrationNumber,
        role: payload.role,
      });

      return tokens;
    } catch (error) {
      throw new UnauthorizedException('Invalid refresh token');
    }
  }

  public async logout(userId: number) {
    return { message: 'Logged out successfully' };
  }
}
