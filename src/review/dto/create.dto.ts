import { IsNotEmpty, IsNumber, IsString } from 'class-validator';

export class CreateReviewDto {
  @IsString()
  @IsNotEmpty({ message: 'Content is required' })
  content: string;

  @IsNumber()
  @IsNotEmpty({ message: 'Rating is required' })
  rating: number;

  @IsNumber()
  @IsNotEmpty({ message: 'Product ID is required' })
  productId: number;
}
