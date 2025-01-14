import { CategoryProductsCategoryQueryModel } from "./category-products-category.query-model";
import { CategoryProductsFiltersQueryModel } from "./category-products-filters.query-model";
import { CategoryProductsProductQueryModel } from "./category-products-product.query-model";
import { CategoryProductsStoreQueryModel } from "./category-products-store.query-model";

export interface CategoryProductsQueryModel {
  readonly category: CategoryProductsCategoryQueryModel|undefined;
  readonly categories: CategoryProductsCategoryQueryModel[];
  readonly products: CategoryProductsProductQueryModel[];
  readonly productsCount: number;
  readonly filters: CategoryProductsFiltersQueryModel;
  readonly stores: CategoryProductsStoreQueryModel[];
}
