import { Injectable, Logger } from '@nestjs/common';
import { OnEvent } from '@nestjs/event-emitter';
import { CART_EVENTS } from 'src/common/events/cart-events';
import { ProductStockUpdateEventDto } from '../cart/cart/dtos/cart-event.dto';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Product, ProductDocument } from 'src/schemas/product.schema';

@Injectable()
export class ProductServiceListener {

  constructor(@InjectModel(Product.name) private productModel: Model<ProductDocument>) {}

  @OnEvent(CART_EVENTS.PRODUCT_ADDED)
  @OnEvent(CART_EVENTS.PRODUCT_REMOVED)
  @OnEvent(CART_EVENTS.QUANTITY_UPDATED)

  async handleStockUpdateAsync(event: ProductStockUpdateEventDto) {
    const product = await this.productModel.findById(event.productId);
    if (!product) return;

    if (event.operation === 'decrease' && product.stock >= event.quantity) {
      product.stock -= event.quantity;
    } else if (event.operation === 'increase') {
      product.stock += event.quantity;
    }

    await product.save();
    Logger.log(`Stock updated for product ${product.id}: ${product.stock}`);
  } 

  @OnEvent(CART_EVENTS.PRODUCT_GET)
  async handleProductAsync(productId: string): Promise<Product> {
    const product = await this.productModel.findById(productId).exec();
    if (!product) {
      return {} as Product;
    }

    Logger.log(`Get product ${product?.id}: ${product?.stock}`);
    return product;
    
  } 
}
