import { BasketProductQueryModel } from "./basket-product.query-model";

export interface BasketQueryModel {
  readonly products: BasketProductQueryModel[];
  readonly subtotal: number;
  readonly productsSubtotal: number;
  readonly deliveryValue: number;
  readonly leftToFreeDelivery: number;
}
