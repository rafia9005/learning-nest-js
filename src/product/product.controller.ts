import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Res,
  UsePipes,
  ValidationPipe,
} from '@nestjs/common';
import { ProductService } from './product.service';
import { Prisma } from '@prisma/client';
import { Response } from 'express';
import { CreateProductDto } from './dto/create.dto';

@Controller('product')
export class ProductController {
  constructor(private readonly productService: ProductService) {}

  @Post()
  @UsePipes(new ValidationPipe({ transform: true }))
  async create(@Body() createProductDto: CreateProductDto) {
    try {
      const result = await this.productService.create(createProductDto);
      return { statusCode: 201, data: result };
    } catch (error) {
      console.error('Error creating product:', error);
      return {
        statusCode: 500,
        message: 'Internal server error',
      };
    }
  }

  @Get()
  findAll() {
    return this.productService.findAll();
  }

  @Get(':id')
  async findOne(@Param('id') id: string, @Res() response: Response) {
    const data = await this.productService.findOne(+id);
    if (data) {
      return response.status(200).json({
        status: true,
        message: 'succes',
        data,
      });
    } else {
      return response.status(404).json({
        message: 'not found',
      });
    }
  }

  @Patch(':id')
  update(
    @Param('id') id: string,
    @Body() updateProductDto: Prisma.ProductUpdateInput,
  ) {
    return this.productService.update(+id, updateProductDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.productService.remove(+id);
  }
}
