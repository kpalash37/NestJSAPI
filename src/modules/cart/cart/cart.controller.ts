import {
  Controller,
  Post,
  Param,
  Body,
  Delete,
  Patch,
  HttpCode,
  HttpStatus,
  Get,
} from "@nestjs/common";
import { CartService } from "./cart.service";
import {
  ApiBody,
  ApiOperation,
  ApiParam,
  ApiResponse,
  ApiTags,
} from "@nestjs/swagger";
import { AddProductToCartDto, UpdateProductQuantityDto } from "./dtos/cart.dto";

@ApiTags("Cart")
@Controller("cart")
export class CartController {
  constructor(private readonly cartService: CartService) {}

  @ApiOperation({ summary: "Create a shopping cart for a user" })
  @ApiResponse({ status: 201, description: "Cart created successfully" })
  @Post("/:userId")
  async createCart(@Param("userId") userId: string) {
    return this.cartService.createCartAsync(userId);
  }

  @Get()
  @ApiOperation({ summary: "Get all cart details" })
  @ApiResponse({ status: 200, description: "Retrieve all carts details." })
  async getAllCarts() {
    return await this.cartService.getAllCartsAsync();
  }

  @Get("/:userId")
  @ApiOperation({ summary: "Get cart details by userId" })
  @ApiResponse({ status: 200, description: "Retrieve cart details." })
  async getByUserId(@Param("userId") userId: string) {
    return await this.cartService.getCartByUserIdAsync(userId);
  }

  

  @ApiOperation({ summary: "Add a product to the cart" })
  @ApiBody({ type: AddProductToCartDto })
  @ApiResponse({ status: 200, description: "Product added to cart successfully"})
  @Post("/:cartId/add-product")
  async addProduct(
    @Param("cartId") cartId: string,
    @Body() addProductDto: AddProductToCartDto,
  ) {
    return this.cartService.addProductToCartAsync(
      cartId,
      addProductDto.productId,
      addProductDto.quantity,
      10, // Example price
    );
  }

  @ApiOperation({ summary: "Update the quantity of a product in the cart" })
  @ApiParam({ name: "cartId", required: true, description: "Cart ID" })
  @ApiBody({ type: UpdateProductQuantityDto })
  @ApiResponse({
    status: 200,
    description: "Product quantity updated successfully",
  })
  @Patch("/:cartId/update-quantity")
  async updateProductQuantity(
    @Param("cartId") cartId: string,
    @Body() updateQuantityDto: UpdateProductQuantityDto,
  ) {
    return this.cartService.updateProductQuantityAsync(
      cartId,
      updateQuantityDto.productId,
      updateQuantityDto.quantity,
    );
  }

  @ApiOperation({ summary: "Remove a product from the cart" })
  @ApiParam({ name: "cartId", required: true, description: "Cart ID" })
  @ApiParam({ name: "productId", required: true, description: "Product ID" })
  @ApiResponse({
    status: 204,
    description: "Product removed from cart successfully",
  })
  @Delete("/:cartId/remove-product/:productId")
  @HttpCode(HttpStatus.NO_CONTENT)

  async removeProduct(
    @Param("cartId") cartId: string,
    @Param("productId") productId: string,
  ) {
    return this.cartService.removeProductFromCartAsync(cartId, productId);
  }

  @ApiOperation({ summary: "Delete the entire shopping cart" })
  @ApiParam({ name: "cartId", required: true, description: "Cart ID" })
  @ApiResponse({ status: 204, description: "Cart deleted successfully" })
  @Delete("/:cartId")
  @HttpCode(HttpStatus.NO_CONTENT)

  async deleteCart(@Param("cartId") cartId: string) {
    await this.cartService.deleteCartAsync(cartId);
  }
}
