import { Controller, Get, Header, HttpCode } from '@nestjs/common';

@Controller('/api/users')
export class UsersController {
  @Get()
  @Header('Content-Type', 'application/json')
  @HttpCode(200)
  get(): Record<string, string> {
    return {
      message: 'succes',
    };
  }
}
