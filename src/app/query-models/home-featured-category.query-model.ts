import { HomeFeaturedCategoryProductQueryModel } from './home-featured-category-product.query-model';

export interface HomeFeaturedCategoryQueryModel {
  readonly id: string;
  readonly name: string;
  readonly products: HomeFeaturedCategoryProductQueryModel[];
}
