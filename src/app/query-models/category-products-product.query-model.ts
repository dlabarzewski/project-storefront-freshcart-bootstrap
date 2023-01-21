import { CategoryProductsCategoryQueryModel } from "./category-products-category.query-model";

export interface CategoryProductsProductQueryModel {
  readonly id: string;
  readonly name: string;
  readonly category: CategoryProductsCategoryQueryModel;
  readonly ratingValue: number;
  readonly ratingCount: number;
  readonly price: number;
  readonly imageUrl: string;
}
