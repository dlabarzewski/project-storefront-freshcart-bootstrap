import { CategoryProductsSortQueryModel } from "./category-products-sort.query-model";

export interface CategoryProductsFiltersQueryModel {
  readonly categoryId: string;
  readonly sort: number;
  readonly limit: number;
  readonly page: number;
  readonly rateFilter: number;
  readonly sortings: CategoryProductsSortQueryModel[];
  readonly pageSizeOptions: number[];
  readonly priceFromFilter: string;
  readonly priceToFilter: string;
  readonly ratingOptions: number[];
  readonly checkedStores: string[];
  readonly storeSearchFilter: string;
}
