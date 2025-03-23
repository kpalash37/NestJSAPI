import {
  IsString,
  IsOptional,
  IsNumber,
  MaxLength,
  Min,
} from "class-validator";

export class CreateProductDto {
  @IsString()
  @MaxLength(64)
  name: string;

  @IsString()
  @IsOptional()
  @MaxLength(2048)
  description?: string;

  @IsString()
  image: string;

  @IsNumber()
  @Min(0)
  price: number;

  @IsNumber()
  @Min(0)
  stock: number;
}
