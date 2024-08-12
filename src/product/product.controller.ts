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
  UseGuards,
} from '@nestjs/common';
import { ProductService } from './product.service';
import { Prisma } from '@prisma/client';
import { Response } from 'express';
import { CreateProductDto } from './dto/create.dto';
import { JwtAuthGuard } from 'src/utils/jwt.guard';

@Controller('api/product')
export class ProductController {
  constructor(private readonly productService: ProductService) {}
  @Post()
  //@UseGuards(JwtAuthGuard)
  @UsePipes(new ValidationPipe({ transform: true }))
  async create(
    @Body() createProductDto: CreateProductDto,
    @Res() res: Response,
  ) {
    try {
      const result = await this.productService.create(createProductDto);
      return res.status(201).json({
        status: true,
        message: 'success',
        data: result,
      });
    } catch (error) {
      console.error('Error creating product:', error);
      return res.status(500).json({
        statusCode: 500,
        message: 'Internal server error',
      });
    }
  }

  @Get()
  async findAll(@Res() res: Response) {
    const result = await this.productService.findAll();
    const nowDate = new Date();
    if (result) {
      return res.status(200).json({
        status: true,
        message: 'success',
        data: result,
        current_date: nowDate,
      });
    } else {
      return res.status(404).json({
        status: false,
        message: 'product is empty',
        current_date: nowDate,
      });
    }
  }

  @Get(':id')
  async findOne(@Param('id') id: string, @Res() response: Response) {
    const data = await this.productService.findOne(+id);
    if (data) {
      const nowDate = new Date();
      return response.status(200).json({
        status: true,
        message: 'succes',
        data,
        current_date: nowDate,
      });
    } else {
      return response.status(404).json({
        message: 'not found',
      });
    }
  }

  @Patch(':id')
  //@UseGuards(JwtAuthGuard)
  update(
    @Param('id') id: string,
    @Body() updateProductDto: Prisma.ProductUpdateInput,
  ) {
    return this.productService.update(+id, updateProductDto);
  }

  @Delete(':id')
  @UseGuards(JwtAuthGuard)
  remove(@Param('id') id: string) {
    return this.productService.remove(+id);
  }
}
