import {
  Injectable,
  CanActivate,
  ExecutionContext,
  ForbiddenException,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { ROLES_KEY } from '../../common/decorators/roles.decorator';

@Injectable()
export class RolesGuard implements CanActivate {
  constructor(private reflector: Reflector) {}

  canActivate(context: ExecutionContext): boolean {
    const requiredRole = this.reflector.getAllAndOverride<string>(ROLES_KEY, [
      context.getHandler(),
      context.getClass(),
    ]);

    if (!requiredRole) {
      return true;
    }

    const { user } = context.switchToHttp().getRequest();

    if (!user || !user.role) {
      throw new ForbiddenException(
        'You do not have the required role to access this resource. Please contact your administrator if you believe this is a mistake.',
      );
    }

    const hasRole = user.role === requiredRole;

    if (!hasRole) {
      throw new ForbiddenException(
        `User with role '${user.role}' is not authorized to access this resource. Required role: '${requiredRole}'`,
      );
    }
    return true;
  }
}
