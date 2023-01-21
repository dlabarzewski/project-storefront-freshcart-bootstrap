import { StoreProductsProductQueryModel } from "./store-products-product.query-model";

export interface StoreProductsQueryModel {
  readonly id: string;
  readonly name: string;
  readonly distanceInMeters: number;
  readonly logoUrl: string;
  readonly products: StoreProductsProductQueryModel[];
}
