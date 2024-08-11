import { Injectable } from '@nestjs/common';
import { DatabaseService } from 'src/database/database.service';
import { Prisma } from '@prisma/client';
import { CreateReviewDto } from './dto/create.dto';

@Injectable()
export class ReviewService {
  constructor(private readonly database: DatabaseService) {}

  async create(createReviewDto: CreateReviewDto) {
    try {
      return await this.database.review.create({
        data: {
          content: createReviewDto.content,
          rating: createReviewDto.rating,
          product: {
            connect: { id: createReviewDto.productId },
          },
        },
      });
    } catch (error) {
      return {
        statusCode: 500,
        message: 'Internal server error',
        errors: error,
      };
    }
  }

  async findAll() {
    try {
      return await this.database.review.findMany();
    } catch (error) {
      return {
        statusCode: 500,
        message: 'Internal server error',
        errors: error,
      };
    }
  }

  async findOne(id: number) {
    try {
      const review = await this.database.review.findUnique({
        where: { id },
      });

      if (!review) {
        return {
          statusCode: 404,
          message: 'Review not found',
        };
      }
      return review;
    } catch (error) {
      return {
        statusCode: 500,
        message: 'Internal server error',
        errors: error,
      };
    }
  }

  async update(id: number, updateReviewDto: Prisma.ReviewUpdateInput) {
    try {
      return await this.database.review.update({
        where: { id },
        data: updateReviewDto,
      });
    } catch (error) {
      return {
        statusCode: 500,
        message: 'Internal server error',
        errors: error,
      };
    }
  }

  async remove(id: number) {
    try {
      await this.database.review.delete({
        where: { id },
      });
      return {
        statusCode: 200,
        message: `Successfully deleted review ${id}`,
      };
    } catch (error) {
      if (error.code === 'P2025') {
        // Prisma specific error code for record not found
        return {
          statusCode: 404,
          message: 'Review not found',
        };
      }
      return {
        statusCode: 500,
        message: 'Internal server error',
        errors: error,
      };
    }
  }
}
