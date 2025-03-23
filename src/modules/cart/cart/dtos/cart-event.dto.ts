export class ProductStockUpdateEventDto {
    constructor(
      public readonly productId: string,
      public readonly quantity: number,
      public readonly operation: 'increase' | 'decrease',
    ) {}
  }
  