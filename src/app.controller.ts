import { Controller, Get, Res } from '@nestjs/common';
import { AppService } from './app.service';
import { Response } from 'express';

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
