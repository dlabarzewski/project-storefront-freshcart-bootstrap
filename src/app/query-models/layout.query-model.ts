import { CategoryModel } from '../models/category.model';
import { StoreModel } from '../models/store.model';

export interface LayoutQueryModel {
  readonly categories: CategoryModel[];
  readonly stores: StoreModel[];
  readonly footerLinks: string[];
}
