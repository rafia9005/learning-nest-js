import {
  Controller,
  Get,
  Req,
  UseGuards,
  Logger,
  HttpCode,
} from '@nestjs/common';
import { Request } from 'express';
import { JwtAuthGuard } from 'src/utils/jwt.guard';
import { JwtPayload } from 'src/utils/jwt.strategy';

@Controller('users')
export class UsersController {
  private readonly logger = new Logger(UsersController.name);

  @Get('/profile')
  @HttpCode(200)
  @UseGuards(JwtAuthGuard)
  getProfile(@Req() request: Request) {
    const user = request.user as JwtPayload;
    return {
      data: {
        id: user.id,
        name: user.name,
        email: user.email,
      },
    };
  }
}
