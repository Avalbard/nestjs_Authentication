import {
  CanActivate,
  ExecutionContext,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { jwtConstants } from './constants';
import { Request } from 'express';

@Injectable()
export class AuthGuard implements CanActivate {
  constructor(private jwtService: JwtService) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    // 클라이언트에서 request 요청을 받아옵니다.
    const request = context.switchToHttp().getRequest();

    // request 요청에서 token을 추출합니다.
    const token = this.extractTokenFromHeader(request);

    // 토큰이 없다면 에러를 던집니다.
    if (!token) {
      throw new UnauthorizedException();
    }
    // 받아온 토큰을 복호화합니다.
    try {
      const payload = await this.jwtService.verifyAsync(token, {
        secret: jwtConstants.secret,
      });
      // 💡 We're assigning the payload to the request object here
      // so that we can access it in our route handlers
      // request에 user객체를 생성한 후, 복호화 된 payload 값을 넣습니다.
      request['user'] = payload;
      console.log(payload);
    } catch {
      throw new UnauthorizedException();
    }
    // 일치한다면 true를 반환합니다.
    return true;
  }

  // request로 보내진 토큰을 거르는 작업입니다. header에 Bearer로 보내지게 됩니다.
  private extractTokenFromHeader(request: Request): string | undefined {
    const [type, token] = request.headers.authorization?.split(' ') ?? [];
    return type === 'Bearer' ? token : undefined;
  }
}
