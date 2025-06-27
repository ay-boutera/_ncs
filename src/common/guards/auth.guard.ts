import {
  Injectable,
  CanActivate,
  ExecutionContext,
  UnauthorizedException,
} from '@nestjs/common';
import { Observable } from 'rxjs';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class AuthGuard implements CanActivate {
  constructor(private jwtService: JwtService) {}

  canActivate(
    context: ExecutionContext,
  ): boolean | Promise<boolean> | Observable<boolean> {
    const request = context.switchToHttp().getRequest();
    return validateRequest(request, this.jwtService);
  }
}

function validateRequest(
  request: any,
  jwtService: JwtService,
): boolean | Promise<boolean> | Observable<boolean> {
  const authHeader =
    request.headers['authorization'] || request.headers['Authorization'];
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    throw new UnauthorizedException('Missing or invalid Authorization header');
  }
  const token = authHeader.split(' ')[1];
  if (!token) {
    throw new UnauthorizedException('Missing token');
  }
  try {
    const payload = jwtService.verify(token, {
      secret: process.env.JWT_SECRET,
    });
    request.user = payload;
    return true;
  } catch (error) {
    throw new UnauthorizedException('Invalid or expired token');
  }
}
