import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { jwtSecret } from '../auth/auth.module';
import { DatabaseService } from 'src/database/database.service';

export interface JwtPayload {
  id: number;
  name: string;
  email: string;
}

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(private readonly databaseService: DatabaseService) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      secretOrKey: jwtSecret,
    });
  }

  async validate(payload: any): Promise<JwtPayload> {
    const user = await this.databaseService.users.findUnique({
      where: { id: payload.id },
    });

    if (!user) {
      throw new UnauthorizedException('User not found');
    }

    if (!user.verify) {
      throw new UnauthorizedException('Email belum diverifikasi');
    }

    return {
      id: user.id,
      name: user.name,
      email: user.email,
    };
  }
}
