import {
  Injectable,
  NotFoundException,
  BadRequestException,
  InternalServerErrorException,
} from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import { Model, Types } from "mongoose";
import { Cart, CartDocument } from "../../../schemas/cart.schema";
import { EventEmitter2 } from "@nestjs/event-emitter";
import { CART_EVENTS } from "src/common/events/cart-events";
import { ProductStockUpdateEventDto } from "./dtos/cart-event.dto";

@Injectable()
export class CartService {
  constructor(
    @InjectModel(Cart.name) private cartModel: Model<CartDocument>,
    private eventEmitter: EventEmitter2,
  ) {}
  
  async createCartAsync(userId: string): Promise<Cart> {
    try {
      let cart = await this.cartModel.findOne({ userId });

      if (!cart) {
      cart = new this.cartModel({ userId, items: [], totalPrice: 0 });
      await cart.save();
      }

      return cart;
    } catch (error: any) {
      console.log('error', error);
      throw new InternalServerErrorException('Error retrieving or creating cart');
    }
  }

  async getCartByUserIdAsync(userId: string): Promise<Cart> {
    try {
      const cart = await this.cartModel.findOne({ userId });
      if (!cart) throw new NotFoundException('Cart not found');

      return cart;
    }
    catch (error: any) {
      console.error('Error getting cart:', error);
      throw new InternalServerErrorException('Error getting cart details');
    }
  }

  async getCartByIdAsync(cartId: string): Promise<Cart> {
    try {
      const cart = await this.cartModel.findById(cartId);
      if (!cart) throw new NotFoundException('Cart not found');

      return cart;
    }
    catch (error: any) {
      console.error('Error getting cart:', error);
      throw new InternalServerErrorException('Error getting cart details');
    }
  }

  async getAllCartsAsync(): Promise<Cart[]> {
    try {
      const carts = await this.cartModel.find().lean().exec();
      return carts;
    }
    catch (error: any) {
      console.error('Error getting all carts:', error);
      throw new InternalServerErrorException('Error getting cart details');
    }
  }



  async addProductToCartAsync(cartId: string, productId: string, quantity: number): Promise<Cart> {
   
      const cart = await this.cartModel.findById(cartId);
      const stockQuantity : number = quantity;
      if (!cart) throw new NotFoundException('Cart not found');

      
      const product =await this.getProductByIdAsync(productId);
      if (product.stock < quantity)
        throw new BadRequestException(`Product stock is less than the quantity you are trying to add`);


      try {
        const existingItem = cart.items.find(item => item.product?.toString() === productId);        

        if (existingItem) {
          existingItem.quantity += quantity;
        } else {
          cart.items.push({ product: new Types.ObjectId(productId), quantity });
        }

        cart.totalPrice += product.price * quantity;
        await cart.save();

        // Emit event to decrease stock
        const operation = 'decrease';
        // eslint-disable-next-line @typescript-eslint/await-thenable      
        await this.eventEmitter.emit(CART_EVENTS.PRODUCT_ADDED, new ProductStockUpdateEventDto(productId, Math.abs(stockQuantity), operation));

        return cart;
    } catch (error: any) {
      console.error('Error adding product to cart:', error);
      throw new InternalServerErrorException('Error adding product to cart');
    }
  }

  async removeProductFromCartAsync(cartId: string, productId: string): Promise<Cart> {
    const cart = await this.cartModel.findById(cartId);
    if (!cart) throw new NotFoundException('Cart not found');

    const itemIndex = cart.items.findIndex(item => item.product.toString() === productId);
    if (itemIndex === -1) throw new NotFoundException('Product not found in cart');

    const removedItem = cart.items[itemIndex];
    cart.items.splice(itemIndex, 1);
    cart.totalPrice -= removedItem.quantity * 10; // Example price handling

    await cart.save();

    // Emit event to increase stock
    this.eventEmitter.emit(CART_EVENTS.PRODUCT_REMOVED, new ProductStockUpdateEventDto(productId, removedItem.quantity, 'increase'));

    return cart;
  }

  async updateProductQuantityAsync(cartId: string, productId: string, newQuantity: number): Promise<Cart> {
    const cart = await this.cartModel.findById(cartId);
    if (!cart) throw new NotFoundException('Cart not found');

    const item = cart.items.find(item => item.product.toString() === productId);
    if (!item) throw new NotFoundException('Product not found in cart');
 

    const quantityDifference = newQuantity - item.quantity;
    item.quantity = newQuantity;

    const product = await this.getProductByIdAsync(productId);
    if (product.stock < quantityDifference)
      throw new BadRequestException(`Product stock is less than the quantity you are trying to add`);

    cart.totalPrice += quantityDifference * product.price; 

    await cart.save();

    // Emit event for stock update
    const operation = quantityDifference > 0 ? 'decrease' : 'increase';
    this.eventEmitter.emit(CART_EVENTS.QUANTITY_UPDATED, new ProductStockUpdateEventDto(productId, Math.abs(quantityDifference), operation));

    return cart;
  }

  async deleteCartAsync(cartId: string): Promise<void> {
   
      const cart = await this.cartModel.findById(cartId);
      if (!cart) throw new NotFoundException('Cart not found');

      try {

        for (const item of cart.items) {
          this.eventEmitter.emit(CART_EVENTS.PRODUCT_REMOVED, new ProductStockUpdateEventDto(item.product.toString(), item.quantity, 'increase'));
        }

        await this.cartModel.deleteOne({ _id: cartId });
    } catch (error: any) {
      console.error('Error deleting cart:', error);
      throw new InternalServerErrorException('Error deleting cart');
    }
  }

  private async getProductByIdAsync(productId: string): Promise<any> {
    const productArray: any = await this.eventEmitter.emitAsync(CART_EVENTS.PRODUCT_GET, productId);
    const product = productArray.find(x => x._id == productId);
    console.log("product::", product);

    if (!product) {
      throw new NotFoundException(`Product not found, please try with another product`);
    }

    return product;
  }
}
