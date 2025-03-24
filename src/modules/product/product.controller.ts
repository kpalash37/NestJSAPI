import { Controller, Get, Post, Body, Param, Patch, Delete } from '@nestjs/common';
import { ProductService } from './product.service';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { UpdateStockDto } from './dto/update-stock.dto';

@ApiTags('Products')
@Controller('products')
export class ProductController {
  constructor(private readonly productService: ProductService) {}

  @Post()
  @ApiOperation({ summary: "Create a new product." })
  @ApiResponse({ status: 201, description: 'Product created successfully.' })
  async create(@Body() createProductDto: CreateProductDto) {
    return await this.productService.createAsync(createProductDto);
  }

  @Get()
  @ApiOperation({ summary: "Retrieve a list of all products." })
  @ApiResponse({ status: 200, description: 'Retrieve all products.' })
  async findAll() {
    return await this.productService.findAllAsync();
  }

  @Get(':id')
  @ApiOperation({ summary: "Retrieve a single product by ID." })
  @ApiResponse({ status: 200, description: 'Retrieve a single product by ID.' })
  async findOne(@Param('id') id: string) {
    return await this.productService.findOneAsync(id);
  }

  @Patch(':id')
  @ApiOperation({ summary: "Update an existing product by ID." })
  @ApiResponse({ status: 200, description: 'Product updated successfully.' })
  async update(@Param('id') id: string, @Body() updateProductDto: UpdateProductDto) {
    return await this.productService.updateAsync(id, updateProductDto);
  }

  @Delete(':id')
  @ApiOperation({ summary: "Remove product by id from the product list." })
  @ApiResponse({ status: 200, description: 'Product deleted successfully.' })
  async delete(@Param('id') id: string) {
    return this.productService.removeAsync(id);
  }

  @Patch(':id/update-stock')
  @ApiOperation({ summary: "Update an existing product stock" })
  @ApiResponse({ status: 200, description: 'Stock updated successfully.' })
  async updateStock(
    @Param('id') id: string, 
    @Body() body: UpdateStockDto
  ) {
    return await this.productService.updateStockAsync(id, body.quantity);
  }
}
