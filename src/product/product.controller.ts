import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UsePipes,
  ValidationPipe,
  UseGuards,
  HttpException,
  HttpStatus,
  Query,
  InternalServerErrorException,
} from '@nestjs/common';
import { ProductService } from './product.service';
import { Prisma } from '@prisma/client';
import { CreateProductDto } from './dto/create.dto';
import { JwtAuthGuard } from 'src/utils/jwt.guard';
import { profile } from 'console';

@Controller('api/product')
export class ProductController {
  constructor(private readonly productService: ProductService) {}

  @Post()
  //@UseGuards(JwtAuthGuard)
  @UsePipes(new ValidationPipe({ transform: true }))
  async create(@Body() createProductDto: CreateProductDto) {
    try {
      const result = await this.productService.create(createProductDto);
      return {
        status: true,
        message: 'Product created successfully',
        data: JSON.stringify(result),
      };
    } catch (error) {
      throw error;
    }
  }

  @Get()
  async findAll() {
    const products = await this.productService.findAll();
    const nowDate = new Date();
    if (products.length > 0) {
      return {
        status: true,
        message: 'Products retrieved successfully',
        data: products,
        current_date: nowDate,
      };
    } else {
      return {
        status: false,
        message: 'No products found',
        current_date: nowDate,
      };
    }
  }

  @Get(':id')
  async findOne(@Param('id') id: string) {
    const product = await this.productService.findOne(+id);
    return {
      status: true,
      message: 'Product retrieved successfully',
      data: product,
      current_date: new Date(),
    };
  }

  @Patch(':id')
  //@UseGuards(JwtAuthGuard)
  async update(
    @Param('id') id: string,
    @Body() updateProductDto: Prisma.ProductUpdateInput,
  ) {
    try {
      const updatedProduct = await this.productService.update(
        +id,
        updateProductDto,
      );
      return {
        status: true,
        message: 'Product updated successfully',
        data: updatedProduct,
      };
    } catch (error) {
      throw error;
    }
  }

  @Delete(':id')
  //@UseGuards(JwtAuthGuard)
  async remove(@Param('id') id: string) {
    try {
      await this.productService.remove(+id);
      return {
        status: true,
        message: 'Product deleted successfully',
      };
    } catch (error) {
      throw error;
    }
  }

  @Get('search')
  async search(@Query('query') query: string) {
    try {
      const products = await this.productService.search(query);
      if (products.length > 0) {
        return {
          status: true,
          message: 'Products found',
          data: products,
        };
      } else {
        return {
          status: false,
          message: 'No products found',
        };
      }
    } catch (error) {
      //throw new InternalServerErrorException('Failed to retrieve products');
    }
  }
}
