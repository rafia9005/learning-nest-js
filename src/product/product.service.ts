import { Injectable } from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { DatabaseService } from 'src/database/database.service';

@Injectable()
export class ProductService {
  constructor(private readonly databaseService: DatabaseService) {}

  async create(createProductDto: Prisma.ProductCreateInput) {
    return await this.databaseService.product.create({
      data: createProductDto,
      include: { tag: true },
    });
  }

  async findAll() {
    const products = await this.databaseService.product.findMany({
      include: { tag: true },
    });
    if (!products) {
      return null;
    }
    return products.map((product) => ({
      id: product.id,
      title: product.title,
      description: product.description,
      price: product.price,
      tag: product.tag,
      createdAt: product.createdAt,
      updatedAt: product.updatedAt,
    }));
  }

  async findOne(id: number) {
    const product = await this.databaseService.product.findUnique({
      where: {
        id: id,
      },
      include: {
        tag: true,
        review: true,
      },
    });

    if (!product) {
      return null;
    }

    return {
      id: product.id,
      title: product.title,
      description: product.description,
      price: product.price,
      tag: product.tag,
      review: product.review,
      createdAt: product.createdAt,
      updatedAt: product.updatedAt,
    };
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
