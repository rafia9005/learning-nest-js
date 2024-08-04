import { IsNotEmpty, IsNumber, IsString } from 'class-validator';

export class CreateProductDto {
  @IsString()
  @IsNotEmpty({ message: 'title is required' })
  title: string;

  @IsString()
  @IsNotEmpty({ message: 'description is required' })
  description: string;

  @IsNumber()
  @IsNotEmpty({ message: 'price is required' })
  price: number;
}
