import { Module } from "@nestjs/common";
import { AppController } from "./app.controller";
import { AppService } from "./app.service";
 import { ProductModule } from "./modules/product/product.module";
import { MongooseModule } from "@nestjs/mongoose";
import { EventEmitterModule } from "@nestjs/event-emitter";
import { ConfigModule } from "@nestjs/config";
import { CartModule } from "./modules/cart/cart/cart.module";

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),

    MongooseModule.forRootAsync({
      useFactory: () => {
        const mongoUri = process.env.MONGO_URI;

        if (!mongoUri) {
          throw new Error(`MONGO_CONNECTION environment variable is not defined.Con: ${process.env.MONGO_CONNECTION}` );
        }

        // Optionally, you can validate the URI format here (example: simple check)
        if (!mongoUri.startsWith('mongodb://') && !mongoUri.startsWith('mongodb+srv://')) {
          throw new Error('Invalid MongoDB URI format. It should start with "mongodb://" or "mongodb+srv://".');
        }

        return {
          uri: mongoUri
        };
      },
    }),

    EventEmitterModule.forRoot(),
     ProductModule,
     CartModule
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
