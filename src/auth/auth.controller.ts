import {
  BadRequestException,
  Body,
  Controller,
  Post,
  Request,
  UseGuards,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { ApiOkResponse, ApiTags } from '@nestjs/swagger';
import { AuthEntity, RegisterResponse } from './entity/auth.entity';
import { LoginDto, RegisterDto } from './dto/auth.dto';
import { JwtAuthGuard } from 'src/utils/jwt.guard';
import { VerifyTokenService } from 'src/middleware/verify-token.service';

@Controller('auth')
@ApiTags('auth')
export class AuthController {
  constructor(
    private readonly authService: AuthService,
    private readonly verifyTokenService: VerifyTokenService,
  ) {}

  @Post('login')
  @ApiOkResponse({ type: AuthEntity })
  async login(@Body() loginDto: LoginDto): Promise<AuthEntity> {
    return this.authService.login(loginDto.email, loginDto.password);
  }

  @Post('register')
  async register(@Body() registerDto: RegisterDto): Promise<RegisterResponse> {
    return this.authService.register(
      registerDto.name,
      registerDto.email,
      registerDto.password,
    );
  }

  @Post('verify-token')
  @UseGuards(JwtAuthGuard)
  async verifyToken(@Body('token') token: string, @Request() req: any) {
    const bearerToken = req.headers.authorization?.split(' ')[1];

    if (!bearerToken) {
      throw new BadRequestException('Bearer token missing');
    }

    return this.verifyTokenService.verifyToken(token, bearerToken);
  }
}
