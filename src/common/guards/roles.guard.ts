import { Injectable, CanActivate, ExecutionContext } from '@nestjs/common';
import { Reflector } from '@nestjs/core';

export const ROLES_KEY = 'roles';

@Injectable()
export class RolesGuard implements CanActivate {
  constructor(private reflector: Reflector) {}

  canActivate(context: ExecutionContext): boolean {
    const requiredRoles = this.reflector.getAllAndOverride<string[]>(
      ROLES_KEY,
      [context.getHandler(), context.getClass()],
    );

    if (!requiredRoles) {
      return true;
    }

    const { user } = context.switchToHttp().getRequest();

    if (!user) {
      return false;
    }

    // Check if user has a role property (could be string or array)
    const userRole = user.role || user.roles;
    
    if (!userRole) {
      return false;
    }

    // Handle both single role (string) and multiple roles (array)
    const userRoles = Array.isArray(userRole) ? userRole : [userRole];
    
    // Check if user has any of the required roles
    return requiredRoles.some((role) => userRoles.includes(role));
  }
}