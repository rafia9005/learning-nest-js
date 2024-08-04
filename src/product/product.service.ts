import { Injectable } from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { DatabaseService } from 'src/database/database.service';

@Injectable()
export class ProductService {
  constructor(private readonly databaseService: DatabaseService) {}

  async create(createProductDto: Prisma.ProductCreateInput) {
    try {
      return await this.databaseService.product.create({
        data: createProductDto,
        include: { tag: true },
      });
    } catch (error) {
      return {
        statusCode: 500,
        message: 'Internal server error',
      };
    }
  }

  findAll() {
    return this.databaseService.product.findMany({ include: { tag: true } });
  }

  findOne(id: number) {
    return this.databaseService.product.findUnique({
      where: {
        id,
      },
      include: {
        tag: true,
        review: true,
      },
    });
  }

  update(id: number, updateProductDto: Prisma.ProductUpdateInput) {
    return this.databaseService.product.update({
      where: {
        id,
      },
      data: updateProductDto,
    });
  }

  remove(id: number) {
    return this.databaseService.product.delete({
      where: {
        id,
      },
    });
  }
}
