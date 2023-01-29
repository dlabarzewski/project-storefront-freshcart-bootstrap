import { LayoutCategoryQueryModel } from './layout-category.query-model';
import { LayoutStoreQueryModel } from './layout-store.query-model';

export interface LayoutQueryModel {
  readonly categories: LayoutCategoryQueryModel[];
  readonly stores: LayoutStoreQueryModel[];
  readonly basketProductsCount: number;
  readonly footerLinks: string[];
  readonly isMobileMenuShown: boolean;
}
