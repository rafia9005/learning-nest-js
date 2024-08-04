import { Controller, Get, Head, Header, HttpCode, Res } from '@nestjs/common';
import { AppService } from './app.service';
import { response, Response } from 'express';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get()
  getHello(@Res() response: Response): void {
    response.status(200).json({
      status: true,
      message: 'NEST JS WORK!',
    });
  }
}
