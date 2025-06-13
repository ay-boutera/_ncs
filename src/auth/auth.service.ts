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

    // Add a unique identifier to refresh token payload to prevent reuse
    const refreshPayload = {
      ...payload,
      tokenId: Date.now() + Math.random(), // Simple unique identifier
      type: 'refresh'
    };

    const refreshToken = this.jwtService.sign(refreshPayload, {
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
      // Verify the refresh token
      const payload = this.jwtService.verify(refreshToken);
      
      // Check if it's actually a refresh token
      if (payload.type !== 'refresh') {
        throw new UnauthorizedException('Invalid token type');
      }

      // Verify user still exists
      const user = await this.prismaService.user.findUnique({
        where: { id: payload.sub },
      });

      if (!user) {
        throw new UnauthorizedException('User not found');
      }

      // Generate new tokens with fresh payload
      const newPayload = {
        sub: user.id,
        registrationNumber: user.registrationNumber,
        role: payload.role,
      };

      const tokens = this.generateTokens(newPayload);

      return tokens;
    } catch (error) {
      // Handle specific JWT errors
      if (error.name === 'JsonWebTokenError') {
        throw new UnauthorizedException('Invalid refresh token');
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

  // Utility method to check if user exists (useful for other services)
  public async findUserById(userId: number) {
    return this.prismaService.user.findUnique({
      where: { id: userId },
      select: {
        id: true,
        registrationNumber: true,
        createdAt: true,
        updatedAt: true,
      },
    });
  }
}