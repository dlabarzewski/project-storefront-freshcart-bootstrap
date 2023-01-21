import { CategoryProductsCategoryQueryModel } from "./category-products-category.query-model";

export interface CategoryProductsQueryModel {
  readonly category: CategoryProductsCategoryQueryModel|undefined;
  readonly categories: CategoryProductsCategoryQueryModel[];
}
