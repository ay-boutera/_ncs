
import { Strategy } from 'passport-local';
import { PassportStrategy } from '@nestjs/passport';
import { Injectable, UnauthorizedException } from '@nestjs/common';
import { AuthService } from '../auth.service';

@Injectable()
export class LocalStrategy extends PassportStrategy(Strategy) {
  constructor(private authService: AuthService) {
    super({
      usernameField: 'registrationNumber'
    });
  }

  async validate(registrationNumber: string, password: string): Promise<any> {
    const user = await this.authService.validateUser(registrationNumber, password);
    if (!user) {
      throw new UnauthorizedException("from local strategy: Invalid credentials");
    }
    return user;
  }
}
