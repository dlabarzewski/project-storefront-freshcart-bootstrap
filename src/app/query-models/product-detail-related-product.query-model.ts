import { ProductDetailCategoryQueryModel } from "./product-detail-category.query-model";

export interface ProductDetailRelatedProductQueryModel {
  readonly id: string;
  readonly name: string;
  readonly imageUrl: string;
  readonly category: ProductDetailCategoryQueryModel;
  readonly price: number;
}
