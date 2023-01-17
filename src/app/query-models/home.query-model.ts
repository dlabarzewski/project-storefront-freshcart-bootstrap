import { CategoryModel } from '../models/category.model';

export interface HomeQueryModel {
  readonly categories: CategoryModel[];
}
