import { CategoryProductsSortQueryModel } from "./category-products-sort.query-model";
import { CategoryProductsStoreQueryModel } from "./category-products-store.query-model";

export interface CategoryProductsAvailableFiltersQueryModel {
  readonly sortings: CategoryProductsSortQueryModel[];
  readonly pageSizeOptions: number[];
  readonly ratingOptions: number[];
  readonly pages: number[];
  readonly stores: CategoryProductsStoreQueryModel[];
}
