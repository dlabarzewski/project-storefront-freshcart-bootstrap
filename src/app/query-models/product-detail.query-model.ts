import { ProductDetailProductQueryModel } from "./product-detail-product.query-model";
import { ProductDetailRelatedProductQueryModel } from "./product-detail-related-product.query-model";

export interface ProductDetailQueryModel {
  readonly product: ProductDetailProductQueryModel|undefined;
  readonly relatedProducts: ProductDetailRelatedProductQueryModel[];
}
