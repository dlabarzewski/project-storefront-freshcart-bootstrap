import { CategoryProductsCategoryQueryModel } from "./category-products-category.query-model";
import { CategoryProductsFiltersQueryModel } from "./category-products-filters.query-model";
import { CategoryProductsProductQueryModel } from "./category-products-product.query-model";
import { CategoryProductsSortQueryModel } from "./category-products-sort.query-model";

export interface CategoryProductsQueryModel {
  readonly category: CategoryProductsCategoryQueryModel|undefined;
  readonly categories: CategoryProductsCategoryQueryModel[];
  readonly products: CategoryProductsProductQueryModel[];
  readonly productsCount: number;
  readonly sortings: CategoryProductsSortQueryModel[];
  readonly filters: CategoryProductsFiltersQueryModel;
}
