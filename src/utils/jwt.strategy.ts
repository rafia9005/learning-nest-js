import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { jwtSecret } from '../auth/auth.module';

export interface JwtPayload {
  id: number;
  name: string;
  email: string;
  verify?: boolean;
}

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor() {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      secretOrKey: jwtSecret,
    });
  }

  async validate(payload: any): Promise<JwtPayload> {
    return {
      id: payload.id,
      name: payload.name,
      email: payload.email,
      verify: payload.verify,
    };
  }
}
