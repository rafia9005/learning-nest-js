import { Test, TestingModule } from '@nestjs/testing';
import { ProductService } from './product.service';
import { DatabaseService } from 'src/database/database.service';

describe('ProductService', () => {
  let service: ProductService;
  let databaseService: DatabaseService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ProductService,
        {
          provide: DatabaseService,
          useValue: {},
        },
      ],
    }).compile();

    service = module.get<ProductService>(ProductService);
    databaseService = module.get<DatabaseService>(DatabaseService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
