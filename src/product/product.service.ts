import {
  Injectable,
  NotFoundException,
  InternalServerErrorException,
  ConflictException,
} from '@nestjs/common';
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
      if (
        error instanceof Prisma.PrismaClientKnownRequestError &&
        error.code === 'P2002'
      ) {
        throw new ConflictException(
          'Product with the same name already exists.',
        );
      } else {
        throw new InternalServerErrorException(
          'An unexpected error occurred while creating the product.',
        );
      }
    }
  }

  async findAll() {
    try {
      const products = await this.databaseService.product.findMany({
        include: { tag: true },
      });

      return products.map((product) => ({
        id: product.id,
        title: product.title,
        description: product.description,
        price: product.price,
        tag: product.tag,
        createdAt: product.createdAt,
        updatedAt: product.updatedAt,
      }));
    } catch (error) {
      throw new InternalServerErrorException('Failed to retrieve products');
    }
  }

  async findOne(id: number) {
    try {
      const product = await this.databaseService.product.findUnique({
        where: { id },
        include: { tag: true, review: true },
      });

      if (!product) {
        throw new NotFoundException(`Product with id ${id} not found`);
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
    } catch (error) {
      if (error instanceof NotFoundException) {
        throw error;
      }
      throw new InternalServerErrorException('Failed to retrieve the product');
    }
  }

  async update(id: number, updateProductDto: Prisma.ProductUpdateInput) {
    try {
      return await this.databaseService.product.update({
        where: { id },
        data: updateProductDto,
      });
    } catch (error) {
      throw new InternalServerErrorException('Failed to update product');
    }
  }

  async remove(id: number) {
    try {
      return await this.databaseService.product.delete({
        where: { id },
      });
    } catch (error) {
      throw new InternalServerErrorException('Failed to delete product');
    }
  }

  async search(query: string) {
    try {
      const products = await this.databaseService.product.findMany({
        where: {
          title: {
            contains: query,
          },
        },
        include: {
          tag: true,
        },
      });
      console.log(products);
      return products;
    } catch (error) {
      console.error('Error in search method:', error);
      throw new InternalServerErrorException('Failed to search products');
    }
  }
}
