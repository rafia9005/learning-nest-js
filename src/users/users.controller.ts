import { Controller, Get, Req, UseGuards, HttpCode } from '@nestjs/common';
import { Request } from 'express';
import { DatabaseService } from 'src/database/database.service';
import { JwtAuthGuard } from 'src/utils/jwt.guard';
import { JwtPayload } from 'src/utils/jwt.strategy';

@Controller('users')
export class UsersController {
  constructor(private readonly databaseService: DatabaseService) {}

  @Get()
  @HttpCode(200)
  async get(): Promise<any> {
    const products = await this.databaseService.users.findMany({});
    return { data: products };
  }

  @Get('/profile')
  @HttpCode(200)
  @UseGuards(JwtAuthGuard)
  getProfile(@Req() request: Request): { data: JwtPayload } {
    const user = request.user as JwtPayload;
    return {
      data: {
        id: user.id,
        name: user.name,
        email: user.email,
        verify: user.verify,
      },
    };
  }
}
