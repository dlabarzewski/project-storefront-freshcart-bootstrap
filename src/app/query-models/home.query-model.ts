import { HomeCategoryQueryModel } from './home-category.query-model';
import { HomeStoreQueryModel } from './home-store.query-model';

export interface HomeQueryModel {
  readonly categories: HomeCategoryQueryModel[];
  readonly stores: HomeStoreQueryModel[];
  readonly storesCount: number;
}
