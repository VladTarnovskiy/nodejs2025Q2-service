import {
  Injectable,
  ExecutionContext,
  UnauthorizedException,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { Reflector } from '@nestjs/core';

@Injectable()
export class JwtAuthGuard extends AuthGuard('jwt') {
  constructor(private reflector: Reflector) {
    super();
  }

  canActivate(context: ExecutionContext) {
    const request = context.switchToHttp().getRequest();
    const path = request.url;

    // Exclude auth routes, doc, and root
    const publicPaths = ['/auth/signup', '/auth/login', '/doc', '/'];

    // Check if the path starts with any public path
    const isPublic = publicPaths.some((publicPath) => {
      if (publicPath === '/') {
        return path === '/';
      }
      // For /doc, also allow /doc/ and sub-paths
      if (publicPath === '/doc') {
        return path === '/doc' || path.startsWith('/doc/');
      }
      return path.startsWith(publicPath);
    });

    if (isPublic) {
      return true;
    }

    return super.canActivate(context);
  }

  handleRequest(err: any, user: any) {
    if (err || !user) {
      throw err || new UnauthorizedException('Unauthorized');
    }
    return user;
  }
}
