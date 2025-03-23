import { Injectable, Logger, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Product, ProductDocument } from '../../schemas/product.schema';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
@Injectable()
export class ProductService {
  constructor(@InjectModel(Product.name) private productModel: Model<ProductDocument>) {}

  async createAsync(createProductDto: CreateProductDto): Promise<Product> {
    try {
      const newProduct = new this.productModel(createProductDto);
      return await newProduct.save();
    } catch (error) {
      Logger.error(`Failed to create product: ${error.message}`);
      throw error;
    }
  }

  async findAllAsync(): Promise<Product[]> {
    const products: Product[] = await this.productModel.find().lean().exec();
    return products;
  }

  async findOneAsync(id: string): Promise<Product> {
    const product = await this.productModel.findById(id).exec();
    if (!product) {
      throw new Error(`Product with id ${id} not found`);
    }
    return product;
  }

  async updateAsync(id: string, updateProductDto: UpdateProductDto): Promise<Product> {
    const updatedProduct = await this.productModel.findByIdAndUpdate(id, updateProductDto, { new: true, runValidators: true  }).exec();
    if (!updatedProduct) {
        throw new NotFoundException('Product not found')
    }
    return updatedProduct;
  }


  async updateStockAsync(productId: string, quantity: number): Promise<Product> {
    try {
      const product = await this.productModel.findById(productId).exec();
      if (!product) {
        throw new NotFoundException('Product not found');
      }

      product.stock += quantity;
      await product.save();

      return product;
    } catch (error) {
      Logger.error(`Failed to update stock for product ${productId}: ${error.message}`);
      throw error;
    }
  }

  async removeAsync(id: string): Promise<Product> {
    const deletedProduct = await this.productModel.findByIdAndDelete(id).exec();
    if (!deletedProduct) {
        throw new NotFoundException('Product not found')
    }
    return deletedProduct;
  } 
  
}
