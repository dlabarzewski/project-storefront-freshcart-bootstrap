export interface CategoryProductsFiltersQueryModel {
  readonly categoryId: string;
  readonly sort: number;
  readonly limit: number;
  readonly page: number;
  readonly rateFilter: number;
  readonly priceFromFilter: string;
  readonly priceToFilter: string;
  readonly checkedStores: string[];
}
