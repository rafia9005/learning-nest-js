import { Test, TestingModule } from '@nestjs/testing';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { Response } from 'express';

describe('AppController', () => {
  let appController: AppController;
  let response: Response;

  beforeEach(async () => {
    const app: TestingModule = await Test.createTestingModule({
      controllers: [AppController],
      providers: [AppService],
    }).compile();

    appController = app.get<AppController>(AppController);
    response = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    } as unknown as Response;
  });

  describe('getHello', () => {
    it('should return the correct JSON response', () => {
      appController.getHello(response);

      expect(response.status).toHaveBeenCalledWith(200);
      expect(response.json).toHaveBeenCalledWith({
        status: true,
        message: 'NEST JS WORK!',
      });
    });
  });
});
