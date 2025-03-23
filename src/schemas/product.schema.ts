import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";

import { HydratedDocument } from "mongoose";

export type ProductDocument = HydratedDocument<Product>;

@Schema({ timestamps: true })
export class Product {
  @Prop({ required: true, maxlength: 64 })
  name: string;

  @Prop({ maxlength: 2048 })
  description?: string;

  @Prop({ required: true })
  image: string; // Base64 or URL

  @Prop({ required: true, type: Number, min: 0 })
  price: number;

  @Prop({ required: true, type: Number, min: 0 })
  stock: number;
}

export const ProductSchema = SchemaFactory.createForClass(Product);
