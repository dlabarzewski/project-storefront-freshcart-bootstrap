import { CategoryProductsSortQueryModel } from "./category-products-sort.query-model";

export interface CategoryProductsFiltersQueryModel {
  readonly categoryId: string;
  readonly sort: number;
  readonly limit: number;
  readonly page: number;
  readonly rate: number;
  readonly sortings: CategoryProductsSortQueryModel[];
  readonly pageSizeOptions: number[];
  readonly priceFrom: string;
  readonly priceTo: string;
  readonly ratingOptions: number[];
  readonly ratingValues: number[];
}
