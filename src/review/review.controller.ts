import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
} from '@nestjs/common';
import { ReviewService } from './review.service';
import { Prisma } from '@prisma/client';
import { CreateReviewDto } from './dto/create.dto';

@Controller('api/review')
export class ReviewController {
  constructor(private readonly reviewService: ReviewService) {}

  @Post()
  async create(@Body() createReviewDto: CreateReviewDto) {
    return this.reviewService.create(createReviewDto);
  }

  @Get()
  findAll() {
    return this.reviewService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.reviewService.findOne(+id);
  }

  @Patch(':id')
  update(
    @Param('id') id: string,
    @Body() updateReviewDto: Prisma.ReviewUpdateInput,
  ) {
    return this.reviewService.update(+id, updateReviewDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.reviewService.remove(+id);
  }
}
