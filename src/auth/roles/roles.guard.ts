import { CanActivate, ExecutionContext, ForbiddenException, Injectable } from "@nestjs/common";
import { Reflector } from "@nestjs/core";
import { UserRole } from "./user-role.enum";

@Injectable()
export class RolesGuard implements CanActivate {
  constructor(private readonly reflector: Reflector) {}

  canActivate(context: ExecutionContext): boolean {
    const request = context.switchToHttp().getRequest();
    const user = request.user;

  
    if (!user) {
      throw new ForbiddenException('User not authenticated');
    }

 
    const requiredRoles = this.reflector.get<UserRole[]>('roles', context.getHandler());
    
   
    if (!requiredRoles) {
      return true;
    }

    
    const hasRole = requiredRoles.includes(user.role);
    if (!hasRole) {
      throw new ForbiddenException('User does not have the required role');
    }

    return true;
  }
}
