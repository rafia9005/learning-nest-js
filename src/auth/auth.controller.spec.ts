import { Controller, Post, Body } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthEntity } from './entity/auth.entity';
import { UserResponse } from './entity/auth.entity';
import { RegisterDto } from './dto/auth.dto';

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
  async register(@Body() RegisterDto: RegisterDto): Promise<UserResponse> {
    return this.authService.register(
      RegisterDto.name,
      RegisterDto.email,
      RegisterDto.password,
    );
  }
}
