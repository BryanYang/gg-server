import { Injectable, CanActivate, ExecutionContext } from '@nestjs/common';
import { Reflector } from '@nestjs/core';

@Injectable()
export class RolesGuard implements CanActivate {
  constructor(private reflector: Reflector) {}

  canActivate(context: ExecutionContext): boolean {
    const requiredRoles = this.reflector.get<string[]>(
      'roles',
      context.getHandler(),
    );

    if (!requiredRoles) {
      return true; // 如果没有指定角色要求，则放行
    }

    const request = context.switchToHttp().getRequest();
    const user = request.user; // 这里假设用户信息已经在验证中存储到请求对象中

    return requiredRoles.some((role) => user.roles?.includes(role));
  }
}
