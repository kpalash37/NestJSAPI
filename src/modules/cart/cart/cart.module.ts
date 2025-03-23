import { Module } from "@nestjs/common";
import { CartService } from "./cart.service";
import { CartController } from "./cart.controller";
import { MongooseModule } from "@nestjs/mongoose";
import { Cart, CartSchema } from "src/schemas/cart.schema";
import { ProductService } from "src/modules/product/product.service";
//import { EventEmitterModule } from "@nestjs/event-emitter";
import { Product, ProductSchema } from "src/schemas/product.schema";
import { EventEmitterModule } from "@nestjs/event-emitter";

@Module({
  imports: [
    MongooseModule.forFeature([{ name: Cart.name, schema: CartSchema }]),
    MongooseModule.forFeature([{ name: Product.name, schema: ProductSchema }]),
    EventEmitterModule.forRoot(),
  ], // Inject product service to update stock],
  providers: [CartService, ProductService],
  controllers: [CartController],
})
export class CartModule {}
