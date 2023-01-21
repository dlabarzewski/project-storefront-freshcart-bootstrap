import { CategoryProductsSortQueryModel } from "./category-products-sort.query-model";

export interface CategoryProductsFiltersQueryModel {
  readonly categoryId: string;
  readonly sort: number;
  readonly sortings: CategoryProductsSortQueryModel[];
}
