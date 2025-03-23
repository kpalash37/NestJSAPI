import { Module } from "@nestjs/common";
import { CartService } from "./cart.service";
import { CartController } from "./cart.controller";
import { MongooseModule } from "@nestjs/mongoose";
import { Cart, CartSchema } from "src/schemas/cart.schema";
//import { EventEmitterModule } from "@nestjs/event-emitter";
import { Product, ProductSchema } from "src/schemas/product.schema";
import { EventEmitterModule } from "@nestjs/event-emitter";
import { ProductServiceListener } from "src/modules/product/product-listener.service";

@Module({
  imports: [
    MongooseModule.forFeature([{ name: Cart.name, schema: CartSchema }]),
    MongooseModule.forFeature([{ name: Product.name, schema: ProductSchema }]),
    EventEmitterModule.forRoot(),
  ], // Inject product service to update stock],
  providers: [CartService, ProductServiceListener],
  controllers: [CartController],
})
export class CartModule {}
