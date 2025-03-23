import { ApiProperty } from "@nestjs/swagger";
import { IsNumber } from "class-validator";

export class UpdateStockDto {
  @ApiProperty({ description: "Update stock quantity of the product", minimum: 0 })
  @IsNumber()
  quantity: number; 
}
