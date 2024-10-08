import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { PassportModule } from '@nestjs/passport';
import { JwtModule } from '@nestjs/jwt';
import { DatabaseService } from 'src/database/database.service';
import { JwtStrategy } from '../utils/jwt.strategy';
import { VerifyTokenService } from 'src/middleware/verify-token.service';

export const jwtSecret = 'zjP9h6ZI5LoSKCRj';

@Module({
  imports: [
    PassportModule,
    JwtModule.register({
      secret: jwtSecret,
      signOptions: { expiresIn: '7d' },
    }),
  ],
  controllers: [AuthController],
  providers: [AuthService, DatabaseService, JwtStrategy, VerifyTokenService],
})
export class AuthModule {}
