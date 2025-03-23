import { IsMongoId, IsNumber, Min, IsNotEmpty } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class AddProductToCartDto {
  @ApiProperty({ example: '60d21b96f72e4c001c8eb5e5', description: 'Product ID' })
  @IsMongoId()
  @IsNotEmpty()
  productId: string;

  @ApiProperty({ example: 2, description: 'Quantity of product', minimum: 1 })
  @IsNumber()
  @Min(1)
  quantity: number;
}

export class UpdateProductQuantityDto {
  @ApiProperty({ example: '60d21b96f72e4c001c8eb5e5', description: 'Product ID' })
  @IsMongoId()
  @IsNotEmpty()
  productId: string;

  @ApiProperty({ example: 3, description: 'Updated quantity', minimum: 1 })
  @IsNumber()
  @Min(1)
  quantity: number;
}
