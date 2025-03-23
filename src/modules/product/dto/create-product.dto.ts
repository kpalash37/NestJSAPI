
import { ApiProperty, ApiPropertyOptional } from "@nestjs/swagger";
import { IsString,
  IsOptional,
  IsNumber,
  MaxLength,
  Min,
} from "class-validator";

export class CreateProductDto {
  @ApiProperty({example: 'Computer', description: "The name of the product", maxLength: 64 })
  @IsString()
  @MaxLength(64)
  name: string;

  @ApiPropertyOptional({example: 'Description', description: "The description of the product", maxLength: 2048 })
  @IsString()
  @IsOptional()
  @MaxLength(2048)
  description?: string;

  @ApiPropertyOptional({ description: "The image URL of the product" })
  @IsString()
  @IsOptional()
  image: string;

  @ApiProperty({ description: "The price of the product", minimum: 0 })
  @IsNumber()
  @Min(0)
  price: number;

  @ApiProperty({ description: "The stock quantity of the product", minimum: 0 })
  @IsNumber()
  @Min(0)
  stock: number;
}
