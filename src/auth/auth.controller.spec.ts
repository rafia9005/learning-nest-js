import { Controller, Post, Body } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthEntity } from './entity/auth.entity';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('login')
  async login(
    @Body('email') email: string,
    @Body('password') password: string,
  ): Promise<AuthEntity> {
    return this.authService.login(email, password);
  }

  @Post('register')
  async register(
    @Body('name') name: string,
    @Body('email') email: string,
    @Body('password') password: string,
  ): Promise<AuthEntity> {
    return this.authService.register(name, email, password);
  }
}
