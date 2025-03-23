import { Controller, Get, Post, Body, Param, Patch, Delete } from '@nestjs/common';
import { ProductService } from './product.service';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { ApiResponse, ApiTags } from '@nestjs/swagger';

@ApiTags('Products')
@Controller('products')
export class ProductController {
  constructor(private readonly productService: ProductService) {}

  @Post()
  @ApiResponse({ status: 201, description: 'Product created successfully.' })
  async create(@Body() createProductDto: CreateProductDto) {
    return await this.productService.createAsync(createProductDto);
  }

  @Get()
  @ApiResponse({ status: 200, description: 'Retrieve all products.' })
  async findAll() {
    return await this.productService.findAllAsync();
  }

  @Get(':id')
  @ApiResponse({ status: 200, description: 'Retrieve a single product by ID.' })
  async findOne(@Param('id') id: string) {
    return await this.productService.findOneAsync(id);
  }

  @Patch(':id')
  @ApiResponse({ status: 200, description: 'Product updated successfully.' })
  async update(@Param('id') id: string, @Body() updateProductDto: UpdateProductDto) {
    return await this.productService.updateAsync(id, updateProductDto);
  }

  @Delete(':id')
  @ApiResponse({ status: 200, description: 'Product deleted successfully.' })
  async delete(@Param('id') id: string) {
    return this.productService.removeAsync(id);
  }

  @Patch(':id/update-stock')
  @ApiResponse({ status: 200, description: 'Stock updated successfully.' })
  async updateStock(@Param('id') id: string, @Body() body: { quantity: number }) {
    return await this.productService.updateStockAsync(id, body.quantity );
  }
}
